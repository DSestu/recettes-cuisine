#!/usr/bin/env python3
"""ComfyUI orchestration for the `implement-recipe-from-image` skill.

Uploads a local image, fetches and patches a server-stored workflow,
queues it, waits for completion, then emits a single JSON line on stdout
with the OCR text and the path to the saved preview image.

All progress/info logging is on stderr. Only the final JSON goes to stdout.
"""

from __future__ import annotations

import argparse
import copy
import json
import mimetypes
import sys
import time
import urllib.parse
import uuid
from pathlib import Path
from typing import Any

import requests
from websocket import WebSocket, WebSocketException, create_connection

REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_CONFIG = Path(__file__).with_name("config.json")
TMP_DIR = REPO_ROOT / ".tmp" / "comfyui"
ALLOWED_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
WS_TIMEOUT_S = 600
POLL_INTERVAL_S = 2.0
ALL_MODES = ("full", "ocr", "image", "prompt")


def mode_cfg(cfg: dict, mode: str) -> dict:
    modes = cfg.get("modes")
    if not isinstance(modes, dict) or mode not in modes:
        die(f"config has no entry for modes.{mode}; known: {sorted((modes or {}).keys())}")
    return modes[mode]


def require_node_ids(mcfg: dict, mode: str, keys: list[str]) -> None:
    missing = [k for k in keys if mcfg.get(k) in (None, "", "<tbd>")]
    if missing:
        die(
            f"config modes.{mode} is missing node IDs: {missing}. "
            "Run `run.py --print-workflow --mode {mode}` to inspect the workflow and fill them in."
        )


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


def die(msg: str, code: int = 1) -> "Any":
    print(f"error: {msg}", file=sys.stderr, flush=True)
    sys.exit(code)


def load_config(path: Path) -> dict:
    with path.open() as f:
        return json.load(f)


def http_base(cfg: dict) -> str:
    return f"http://{cfg['host']}"


def ws_base(cfg: dict) -> str:
    return f"ws://{cfg['host']}"


def ping(cfg: dict) -> dict:
    r = requests.get(f"{http_base(cfg)}/system_stats", timeout=10)
    r.raise_for_status()
    return r.json()


def find_text_sibling(image_path: Path) -> Path | None:
    """Look for `<stem>_text.<ext>` next to image_path; any image extension."""
    parent = image_path.parent
    stem = image_path.stem
    for suffix in (".jpg", ".jpeg", ".png", ".webp"):
        cand = parent / f"{stem}_text{suffix}"
        if cand.exists():
            return cand
        cand_upper = parent / f"{stem}_text{suffix.upper()}"
        if cand_upper.exists():
            return cand_upper
    return None


def upload_image(cfg: dict, image_path: Path) -> dict:
    if not image_path.exists():
        die(f"image not found: {image_path}")
    if image_path.suffix.lower() not in ALLOWED_SUFFIXES:
        die(f"unsupported image suffix {image_path.suffix!r} (allowed: {sorted(ALLOWED_SUFFIXES)})")
    mime = mimetypes.guess_type(image_path.name)[0] or "application/octet-stream"
    with image_path.open("rb") as f:
        r = requests.post(
            f"{http_base(cfg)}/upload/image",
            files={"image": (image_path.name, f, mime)},
            data={"overwrite": "true"},
            timeout=60,
        )
    if r.status_code >= 400:
        die(f"upload failed ({r.status_code}): {r.text[:300]}")
    return r.json()


def fetch_workflow(cfg: dict, mcfg: dict, required_node_keys: list[str] | None = None) -> dict:
    encoded = urllib.parse.quote(mcfg["workflow"], safe="")
    url = f"{http_base(cfg)}/userdata/{encoded}"
    r = requests.get(url, timeout=30)
    if r.status_code >= 400:
        die(f"cannot fetch workflow from {url}: HTTP {r.status_code} {r.text[:200]}")
    try:
        wf = r.json()
    except ValueError:
        die(f"workflow at {url} is not valid JSON")
    if isinstance(wf, dict) and "nodes" in wf and isinstance(wf.get("nodes"), list):
        die(
            f"workflow at {url} is in UI format (has top-level 'nodes' list). "
            "Re-export from ComfyUI with Dev Mode → Workflow → Export (API), "
            "then save it to the same userdata path (or update config.json)."
        )
    if required_node_keys:
        required = [mcfg[k] for k in required_node_keys if mcfg.get(k) not in (None, "", "<tbd>")]
        missing = [nid for nid in required if nid not in wf]
        if missing:
            die(
                f"workflow at {url} is missing required node IDs: {missing}. "
                "Is this the API-format JSON (Dev Mode → Save (API Format))?"
            )
    return wf


def queue_prompt(cfg: dict, workflow: dict, client_id: str) -> str:
    r = requests.post(
        f"{http_base(cfg)}/prompt",
        json={"prompt": workflow, "client_id": client_id},
        timeout=30,
    )
    if r.status_code >= 400:
        die(f"prompt rejected ({r.status_code}): {r.text[:500]}")
    data = r.json()
    pid = data.get("prompt_id")
    if not pid:
        die(f"no prompt_id in response: {data}")
    return pid


def _ws_wait(cfg: dict, client_id: str, prompt_id: str, deadline: float) -> bool:
    url = f"{ws_base(cfg)}/ws?clientId={client_id}"
    ws: WebSocket = create_connection(url, timeout=30)
    try:
        ws.settimeout(30)
        while time.time() < deadline:
            try:
                raw = ws.recv()
            except WebSocketException as e:
                log(f"ws recv error: {e}")
                return False
            if not isinstance(raw, str):
                continue
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                continue
            if msg.get("type") == "executing":
                d = msg.get("data") or {}
                if d.get("node") is None and d.get("prompt_id") == prompt_id:
                    return True
        return False
    finally:
        try:
            ws.close()
        except Exception:
            pass


def _history_poll(cfg: dict, prompt_id: str, deadline: float) -> bool:
    url = f"{http_base(cfg)}/history/{prompt_id}"
    while time.time() < deadline:
        try:
            r = requests.get(url, timeout=10)
            if r.status_code < 400:
                data = r.json()
                if prompt_id in data:
                    return True
        except requests.RequestException as e:
            log(f"history poll error: {e}")
        time.sleep(POLL_INTERVAL_S)
    return False


def wait_for_completion(cfg: dict, client_id: str, prompt_id: str) -> None:
    deadline = time.time() + WS_TIMEOUT_S
    log(f"waiting for prompt {prompt_id} (timeout {WS_TIMEOUT_S}s)…")
    try:
        if _ws_wait(cfg, client_id, prompt_id, deadline):
            return
    except WebSocketException as e:
        log(f"ws connect failed once: {e}")
    log("ws path failed; falling back to /history polling")
    if not _history_poll(cfg, prompt_id, deadline):
        die(f"timed out waiting for prompt {prompt_id}")


def _extract_text(node_output: Any) -> str:
    if isinstance(node_output, dict):
        for key in ("text", "string", "value", "STRING"):
            v = node_output.get(key)
            if isinstance(v, list) and v:
                return str(v[0]).strip()
            if isinstance(v, str):
                return v.strip()
    if isinstance(node_output, list) and node_output:
        return str(node_output[0]).strip()
    if isinstance(node_output, str):
        return node_output.strip()
    return ""


def _get_history_outputs(cfg: dict, prompt_id: str) -> dict:
    r = requests.get(f"{http_base(cfg)}/history/{prompt_id}", timeout=30)
    r.raise_for_status()
    history = r.json().get(prompt_id) or {}
    return history.get("outputs") or {}


def _fetch_preview_image(cfg: dict, mcfg: dict, prompt_id: str, outputs: dict) -> Path:
    img_node = mcfg["preview_image_id"]
    img_out = outputs.get(img_node) or {}
    images = img_out.get("images") or []
    if not images:
        die(f"preview image node {img_node} has no images: {img_out!r}")
    desc = images[0]
    params = {
        "filename": desc["filename"],
        "subfolder": desc.get("subfolder", ""),
        "type": desc.get("type", cfg.get("preview_image_type", "temp")),
    }
    ir = requests.get(f"{http_base(cfg)}/view", params=params, timeout=60)
    ir.raise_for_status()
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    out_path = TMP_DIR / f"{prompt_id}.png"
    out_path.write_bytes(ir.content)
    return out_path


def _read_ocr_text(mcfg: dict, outputs: dict) -> str:
    text_node = mcfg["text_output_id"]
    if text_node not in outputs:
        die(f"text output node {text_node} not in history outputs: keys={list(outputs)}")
    ocr_text = _extract_text(outputs[text_node])
    if not ocr_text:
        die(
            f"vision LM returned no text; raw outputs[{text_node}]={outputs[text_node]!r}. "
            "Re-shoot the photo or check the workflow."
        )
    return ocr_text


def run_full(cfg: dict, image_path: Path, dry_run: bool) -> dict:
    """Compose the two standalone workflows: OCR first, then restoration.

    `modes.full` no longer references a single combined workflow — it carries
    two sub-configs (`ocr` and `restore`), each mirroring the standalone `ocr`
    and `image` mode entries. We run them as separate prompts and merge the
    results into the same output shape callers already expect.
    """
    mcfg = mode_cfg(cfg, "full")
    ocr_cfg = mcfg.get("ocr")
    restore_cfg = mcfg.get("restore")
    if not isinstance(ocr_cfg, dict) or not isinstance(restore_cfg, dict):
        die(
            "config modes.full must contain 'ocr' and 'restore' sub-objects, "
            "each with its own workflow + node IDs (see config.json)."
        )
    require_node_ids(ocr_cfg, "full.ocr", ["loader_ocr_id", "loader_restore_id", "text_output_id"])
    require_node_ids(restore_cfg, "full.restore", ["loader_image_id", "preview_image_id"])

    # Resolve inputs (unchanged behaviour): a `<stem>_text` sibling feeds the OCR
    # loader while the main image feeds restoration; otherwise the same image
    # feeds both. `restore_name` is the uploaded main photo — restoration in
    # full mode runs on that uploaded file directly, no slug lookup needed.
    text_sibling = find_text_sibling(image_path)
    if text_sibling:
        log(f"found text sibling: {text_sibling} — routing to OCR loader")
        log(f"uploading restore image {image_path}…")
        restore_name = upload_image(cfg, image_path)["name"]
        log(f"uploading OCR image {text_sibling}…")
        ocr_name = upload_image(cfg, text_sibling)["name"]
    else:
        log(f"uploading {image_path} (same image to OCR + restore)…")
        ocr_name = restore_name = upload_image(cfg, image_path)["name"]
    log(f"OCR loader={ocr_name!r}, restore loader={restore_name!r}")

    # --- Prepare OCR workflow (OCR + dummy restore loader, as in `ocr` mode) ---
    log(f"[ocr] fetching workflow {ocr_cfg['workflow']}…")
    ocr_wf = fetch_workflow(cfg, ocr_cfg, ["loader_ocr_id", "loader_restore_id", "text_output_id"])
    log("[ocr] patching workflow (OCR + dummy restore)…")
    ocr_patched = copy.deepcopy(ocr_wf)
    ocr_patched[ocr_cfg["loader_ocr_id"]].setdefault("inputs", {})["image"] = ocr_name
    ocr_patched[ocr_cfg["loader_restore_id"]].setdefault("inputs", {})["image"] = restore_name

    # --- Prepare restoration workflow (main photo → image loader) ---
    log(f"[restore] fetching workflow {restore_cfg['workflow']}…")
    restore_wf = fetch_workflow(cfg, restore_cfg, ["loader_image_id", "preview_image_id"])
    log(f"[restore] patching loader_image_id={restore_cfg['loader_image_id']} with {restore_name!r}…")
    restore_patched = copy.deepcopy(restore_wf)
    restore_patched[restore_cfg["loader_image_id"]].setdefault("inputs", {})["image"] = restore_name

    if dry_run:
        log("--dry-run: skipping /prompt; emitting both patched workflows on stdout")
        return {
            "dry_run": True,
            "ocr_name": ocr_name,
            "restore_name": restore_name,
            "ocr_workflow": ocr_patched,
            "restore_workflow": restore_patched,
        }

    # --- Run 1: OCR (must yield text before we spend a restore run) ---
    ocr_client = str(uuid.uuid4())
    log(f"[ocr] queueing prompt (client_id={ocr_client})…")
    ocr_pid = queue_prompt(cfg, ocr_patched, ocr_client)
    log(f"[ocr] prompt_id={ocr_pid}")
    wait_for_completion(cfg, ocr_client, ocr_pid)
    log("[ocr] complete; reading text output…")
    ocr_text = _read_ocr_text(ocr_cfg, _get_history_outputs(cfg, ocr_pid))

    # --- Run 2: restoration ---
    restore_client = str(uuid.uuid4())
    log(f"[restore] queueing prompt (client_id={restore_client})…")
    restore_pid = queue_prompt(cfg, restore_patched, restore_client)
    log(f"[restore] prompt_id={restore_pid}")
    wait_for_completion(cfg, restore_client, restore_pid)
    log("[restore] complete; fetching preview image…")
    restore_outputs = _get_history_outputs(cfg, restore_pid)
    img_path = _fetch_preview_image(cfg, restore_cfg, restore_pid, restore_outputs)
    log(f"image saved to {img_path}")

    return {
        "ocr_text": ocr_text,
        "image_temp_path": str(img_path),
        "ocr_prompt_id": ocr_pid,
        "image_prompt_id": restore_pid,
        "prompt_id": restore_pid,  # back-compat alias for the restoration run
    }


def run_ocr(cfg: dict, image_path: Path, dry_run: bool) -> dict:
    mcfg = mode_cfg(cfg, "ocr")
    require_node_ids(mcfg, "ocr", ["loader_ocr_id", "loader_restore_id", "text_output_id"])

    text_sibling = find_text_sibling(image_path)
    if text_sibling:
        log(f"found text sibling: {text_sibling} — routing to OCR loader")
        log(f"uploading restore image {image_path}…")
        restore_name = upload_image(cfg, image_path)["name"]
        log(f"uploading OCR image {text_sibling}…")
        ocr_name = upload_image(cfg, text_sibling)["name"]
    else:
        log(f"uploading {image_path} (same image to both loaders)…")
        ocr_name = restore_name = upload_image(cfg, image_path)["name"]

    log(f"fetching workflow {mcfg['workflow']}…")
    wf = fetch_workflow(cfg, mcfg, ["loader_ocr_id", "loader_restore_id", "text_output_id"])

    log("patching workflow (OCR + dummy restore)…")
    patched = copy.deepcopy(wf)
    patched[mcfg["loader_ocr_id"]].setdefault("inputs", {})["image"] = ocr_name
    patched[mcfg["loader_restore_id"]].setdefault("inputs", {})["image"] = restore_name

    if dry_run:
        log("--dry-run: skipping /prompt; emitting patched workflow on stdout")
        return {"dry_run": True, "ocr_name": ocr_name, "restore_name": restore_name, "workflow": patched}

    client_id = str(uuid.uuid4())
    log(f"queueing prompt (client_id={client_id})…")
    prompt_id = queue_prompt(cfg, patched, client_id)
    log(f"prompt_id={prompt_id}")

    wait_for_completion(cfg, client_id, prompt_id)
    log("workflow complete; fetching text output…")
    outputs = _get_history_outputs(cfg, prompt_id)
    ocr_text = _read_ocr_text(mcfg, outputs)
    return {"ocr_text": ocr_text, "prompt_id": prompt_id}


def _resolve_recipe_image(slug: str) -> Path:
    p = REPO_ROOT / "images" / f"{slug}.webp"
    if p.exists():
        return p
    die(f"no existing image found at {p.relative_to(REPO_ROOT)} (site is WebP-only post-migration)")


def run_image(cfg: dict, slug: str, dry_run: bool) -> dict:
    mcfg = mode_cfg(cfg, "image")
    require_node_ids(mcfg, "image", ["loader_image_id", "preview_image_id"])

    src = _resolve_recipe_image(slug)
    log(f"uploading existing image {src} for slug {slug!r}…")
    image_name = upload_image(cfg, src)["name"]

    log(f"fetching workflow {mcfg['workflow']}…")
    wf = fetch_workflow(cfg, mcfg, ["loader_image_id", "preview_image_id"])

    log(f"patching loader_image_id={mcfg['loader_image_id']} with {image_name!r}…")
    patched = copy.deepcopy(wf)
    patched[mcfg["loader_image_id"]].setdefault("inputs", {})["image"] = image_name

    if dry_run:
        log("--dry-run: skipping /prompt; emitting patched workflow on stdout")
        return {"dry_run": True, "image_name": image_name, "workflow": patched}

    client_id = str(uuid.uuid4())
    log(f"queueing prompt (client_id={client_id})…")
    prompt_id = queue_prompt(cfg, patched, client_id)
    log(f"prompt_id={prompt_id}")

    wait_for_completion(cfg, client_id, prompt_id)
    log("workflow complete; fetching preview image…")
    outputs = _get_history_outputs(cfg, prompt_id)
    img_path = _fetch_preview_image(cfg, mcfg, prompt_id, outputs)
    log(f"image saved to {img_path}")
    return {"image_temp_path": str(img_path), "prompt_id": prompt_id}


def _read_prompt_gallery(slug: str) -> str:
    candidates = [
        REPO_ROOT / "prompts" / "_recipes" / f"{slug}.md",
        REPO_ROOT / "prompts" / "_components" / f"{slug}.md",
    ]
    p = next((c for c in candidates if c.exists()), None)
    if p is None:
        die(f"prompt gallery file not found: tried {', '.join(str(c) for c in candidates)}")
    txt = p.read_text(encoding="utf-8").strip()
    if not txt:
        die(f"prompt gallery file is empty: {p}")
    return txt


def run_prompt(cfg: dict, slug: str, dry_run: bool) -> dict:
    mcfg = mode_cfg(cfg, "prompt")
    require_node_ids(mcfg, "prompt", ["prompt_text_id", "preview_image_id"])
    field = mcfg.get("prompt_text_field", "text")

    prompt_text = _read_prompt_gallery(slug)
    log(f"loaded prompt for slug {slug!r} ({len(prompt_text)} chars)")

    log(f"fetching workflow {mcfg['workflow']}…")
    wf = fetch_workflow(cfg, mcfg, ["prompt_text_id", "preview_image_id"])

    log(f"patching prompt_text_id={mcfg['prompt_text_id']} .{field}…")
    patched = copy.deepcopy(wf)
    patched[mcfg["prompt_text_id"]].setdefault("inputs", {})[field] = prompt_text

    if dry_run:
        log("--dry-run: skipping /prompt; emitting patched workflow on stdout")
        return {"dry_run": True, "prompt_text_chars": len(prompt_text), "workflow": patched}

    client_id = str(uuid.uuid4())
    log(f"queueing prompt (client_id={client_id})…")
    prompt_id = queue_prompt(cfg, patched, client_id)
    log(f"prompt_id={prompt_id}")

    wait_for_completion(cfg, client_id, prompt_id)
    log("workflow complete; fetching preview image…")
    outputs = _get_history_outputs(cfg, prompt_id)
    img_path = _fetch_preview_image(cfg, mcfg, prompt_id, outputs)
    log(f"image saved to {img_path}")
    return {"image_temp_path": str(img_path), "prompt_id": prompt_id}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--mode", choices=ALL_MODES, default="full",
                        help="pipeline mode (default: full)")
    parser.add_argument("--image", type=Path, help="local image path (modes: full, ocr)")
    parser.add_argument("--slug", type=str, help="recipe slug (modes: image, prompt)")
    parser.add_argument("--ping", action="store_true", help="ping server and exit")
    parser.add_argument("--upload", type=Path, help="upload-only mode (prints upload response)")
    parser.add_argument("--print-workflow", action="store_true",
                        help="fetch the workflow for --mode and print it")
    parser.add_argument("--dry-run", action="store_true", help="patch but don't queue")
    args = parser.parse_args(argv)

    try:
        cfg = load_config(args.config)
    except FileNotFoundError:
        die(f"config not found: {args.config}")
    except json.JSONDecodeError as e:
        die(f"invalid config json: {e}")

    try:
        if args.ping:
            stats = ping(cfg)
            print(json.dumps(stats, indent=2))
            return 0
        if args.upload:
            resp = upload_image(cfg, args.upload.expanduser())
            print(json.dumps(resp, indent=2))
            return 0
        if args.print_workflow:
            mcfg = mode_cfg(cfg, args.mode)
            if args.mode == "full":
                # full composes two sub-workflows; dump both.
                out = {}
                for sub in ("ocr", "restore"):
                    scfg = mcfg.get(sub)
                    if isinstance(scfg, dict) and scfg.get("workflow"):
                        out[sub] = fetch_workflow(cfg, scfg)
                print(json.dumps(out, indent=2))
            else:
                wf = fetch_workflow(cfg, mcfg)
                print(json.dumps(wf, indent=2))
            return 0

        if args.mode in ("full", "ocr"):
            if not args.image:
                die(f"--image is required for --mode {args.mode}")
            image_path = args.image.expanduser()
            if args.mode == "full":
                result = run_full(cfg, image_path, args.dry_run)
            else:
                result = run_ocr(cfg, image_path, args.dry_run)
        else:  # image | prompt
            if not args.slug:
                die(f"--slug is required for --mode {args.mode}")
            if args.mode == "image":
                result = run_image(cfg, args.slug, args.dry_run)
            else:
                result = run_prompt(cfg, args.slug, args.dry_run)

        print(json.dumps(result))
        return 0
    except requests.ConnectionError as e:
        die(f"ComfyUI unreachable at {cfg['host']}: {e}. Check VPN / host on.")
    except requests.RequestException as e:
        die(f"HTTP error talking to {cfg['host']}: {e}")


if __name__ == "__main__":
    sys.exit(main())
