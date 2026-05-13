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


def fetch_workflow(cfg: dict) -> dict:
    encoded = urllib.parse.quote(cfg["workflow_userdata_path"], safe="")
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
    required = [
        cfg["loader_ocr_id"],
        cfg["loader_restore_id"],
        cfg["text_output_id"],
        cfg["preview_image_id"],
    ]
    missing = [nid for nid in required if nid not in wf]
    if missing:
        die(
            f"workflow is missing required node IDs: {missing}. "
            "Is this the API-format JSON (Dev Mode → Save (API Format))?"
        )
    return wf


def patch_workflow(cfg: dict, workflow: dict, uploaded_name: str) -> dict:
    wf = copy.deepcopy(workflow)
    for key in (cfg["loader_ocr_id"], cfg["loader_restore_id"]):
        node = wf[key]
        node.setdefault("inputs", {})["image"] = uploaded_name
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


def fetch_outputs(cfg: dict, prompt_id: str) -> tuple[str, Path]:
    r = requests.get(f"{http_base(cfg)}/history/{prompt_id}", timeout=30)
    r.raise_for_status()
    history = r.json().get(prompt_id) or {}
    outputs = history.get("outputs") or {}

    text_node = cfg["text_output_id"]
    if text_node not in outputs:
        die(f"text output node {text_node} not in history outputs: keys={list(outputs)}")
    ocr_text = _extract_text(outputs[text_node])
    if not ocr_text:
        die(
            f"vision LM returned no text; raw outputs[{text_node}]={outputs[text_node]!r}. "
            "Re-shoot the photo or check the workflow."
        )

    img_node = cfg["preview_image_id"]
    img_out = outputs.get(img_node) or {}
    images = img_out.get("images") or []
    if not images:
        die(f"preview image node {img_node} has no images: {img_out!r}")
    desc = images[0]
    params = {
        "filename": desc["filename"],
        "subfolder": desc.get("subfolder", ""),
        "type": desc.get("type", cfg["preview_image_type"]),
    }
    ir = requests.get(f"{http_base(cfg)}/view", params=params, timeout=60)
    ir.raise_for_status()
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    out_path = TMP_DIR / f"{prompt_id}.png"
    out_path.write_bytes(ir.content)
    return ocr_text, out_path


def run_pipeline(cfg: dict, image_path: Path, dry_run: bool) -> dict:
    log(f"uploading {image_path}…")
    up = upload_image(cfg, image_path)
    name = up["name"]
    log(f"uploaded as {name!r}")

    log("fetching workflow…")
    wf = fetch_workflow(cfg)

    log("patching workflow…")
    patched = patch_workflow(cfg, wf, name)

    if dry_run:
        log("--dry-run: skipping /prompt; emitting patched workflow on stdout")
        return {"dry_run": True, "uploaded_name": name, "workflow": patched}

    client_id = str(uuid.uuid4())
    log(f"queueing prompt (client_id={client_id})…")
    prompt_id = queue_prompt(cfg, patched, client_id)
    log(f"prompt_id={prompt_id}")

    wait_for_completion(cfg, client_id, prompt_id)
    log("workflow complete; fetching outputs…")

    ocr_text, img_path = fetch_outputs(cfg, prompt_id)
    log(f"image saved to {img_path}")
    return {"ocr_text": ocr_text, "image_temp_path": str(img_path), "prompt_id": prompt_id}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--image", type=Path, help="local image path")
    parser.add_argument("--ping", action="store_true", help="ping server and exit")
    parser.add_argument("--upload", type=Path, help="upload-only mode (prints upload response)")
    parser.add_argument("--print-workflow", action="store_true", help="fetch workflow and print")
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
            wf = fetch_workflow(cfg)
            print(json.dumps(wf, indent=2))
            return 0
        if not args.image:
            die("--image is required (or use --ping / --upload / --print-workflow / --dry-run)")
        result = run_pipeline(cfg, args.image.expanduser(), args.dry_run)
        print(json.dumps(result))
        return 0
    except requests.ConnectionError as e:
        die(f"ComfyUI unreachable at {cfg['host']}: {e}. Check VPN / host on.")
    except requests.RequestException as e:
        die(f"HTTP error talking to {cfg['host']}: {e}")


if __name__ == "__main__":
    sys.exit(main())
