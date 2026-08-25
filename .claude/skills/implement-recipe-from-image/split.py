"""Split a raw cookbook-page photo into per-recipe crops (text + dish photo).

Preprocessing stage for the `implement-recipe-from-image` skill: when an input
image has no `<stem>_text` sibling, this script detects every recipe on the
page via the `SDXL_recettes_cuisine_split` ComfyUI workflow (Qwen3-VL
grounding), picks the correct page orientation, and cuts full-resolution crops
that the existing `run.py` modes consume unchanged.

Key invariants (see SKILL.md):
- Detection runs on a 2 MP copy server-side, but crops are ALWAYS cut from the
  full-resolution original (after lossless 90/180 transposes only).
- Photo crops are expanded to squares (site framing convention), with an
  aspect-ratio guard so wildly elongated detections don't swallow the page.
- Orientation is chosen by detection health, never by a VLM orientation
  question (Qwen perceives rotated text as upright — measured, do not retry).

Usage:
  uv run python .claude/skills/implement-recipe-from-image/split.py \
      --image <path> [--config <path>] [--out-dir <dir>] [--dry-run]

stderr: progress logs. stdout last line: JSON result:
  {"source", "orientation", "axis_score", "candidates", "review_flag",
   "overlay", "recipes": [{"index", "title", "photo"|null, "text"}]}
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import uuid
from pathlib import Path

import numpy as np
import requests
from PIL import Image, ImageDraw, ImageOps

SKILL_DIR = Path(__file__).parent
REPO_ROOT = SKILL_DIR.parents[2]
DEFAULT_CONFIG = SKILL_DIR / "config.json"
DEFAULT_OUT = REPO_ROOT / ".tmp" / "split"

# --- Tuning constants (benchmarked 2026-08-23 on the marabout corpus) ---
AXIS_UPRIGHT = 1.3     # above: trust upright, single detection
AXIS_ROTATED = 0.5     # below: clearly rotated, skip the 0-degree candidate
TEXT_PAD = (15, 20, 15, 50)   # left, top, right, bottom — 0-1000 normalized
PHOTO_MARGIN = 0.035          # fraction of each image dimension
PHOTO_AR_GUARD = 1.6          # don't square boxes more elongated than this
GHOST_EDGE = 25               # text bbox hugging a vertical edge (0-1000)
GHOST_MAX_WIDTH = 280         # ...and narrower than this is a facing-page sliver
REVIEW_MARGIN = 0.15          # top-2 health closer than this -> flag for review
POLL_TIMEOUT_S = 420


def log(msg: str) -> None:
    print(f"[split] {msg}", file=sys.stderr, flush=True)


def die(msg: str) -> None:
    print(f"[split] ERROR: {msg}", file=sys.stderr, flush=True)
    sys.exit(1)


# --------------------------------------------------------------- server I/O

def upload(base: str, path: Path) -> str:
    with open(path, "rb") as f:
        r = requests.post(
            f"{base}/upload/image",
            files={"image": (path.name, f, "image/jpeg")},
            data={"overwrite": "true"},
            timeout=120,
        )
    r.raise_for_status()
    d = r.json()
    name = d["name"]
    if d.get("subfolder"):
        name = d["subfolder"] + "/" + name
    return name


def fetch_workflow(base: str, userdata_path: str) -> dict:
    enc = urllib.parse.quote(userdata_path, safe="")
    r = requests.get(f"{base}/userdata/{enc}", timeout=30)
    if r.status_code != 200:
        die(f"cannot fetch workflow {userdata_path}: HTTP {r.status_code} {r.text[:200]}")
    wf = r.json()
    if "nodes" in wf:
        die(f"workflow {userdata_path} is in UI format; re-export as API and save "
            "to the same userdata path (or update config.json).")
    return wf


def run_prompt(base: str, graph: dict) -> str:
    r = requests.post(f"{base}/prompt",
                      json={"prompt": graph, "client_id": uuid.uuid4().hex},
                      timeout=30)
    if r.status_code != 200:
        die(f"queue failed: {r.status_code} {r.text[:400]}")
    pid = r.json()["prompt_id"]
    t0 = time.time()
    while time.time() - t0 < POLL_TIMEOUT_S:
        time.sleep(2)
        h = requests.get(f"{base}/history/{pid}", timeout=30).json()
        if pid not in h:
            continue
        entry = h[pid]
        status = entry.get("status", {})
        if status.get("status_str") == "error":
            msgs = [m for m in status.get("messages", []) if m[0] == "execution_error"]
            die(f"execution error: {json.dumps(msgs)[:600]}")
        if status.get("completed") or entry.get("outputs"):
            for out in entry.get("outputs", {}).values():
                if "text" in out:
                    v = out["text"]
                    return v[0] if isinstance(v, list) else v
            die("workflow completed but produced no text output")
    die("timeout waiting for detection")
    raise AssertionError("unreachable")


# --------------------------------------------------------------- detection

def detect(base: str, workflow_path: str, loader_id: str, server_image: str) -> list | None:
    wf = fetch_workflow(base, workflow_path)
    if loader_id not in wf:
        die(f"workflow is missing loader node id {loader_id}")
    wf[loader_id]["inputs"]["image"] = server_image
    text = run_prompt(base, wf)
    try:
        data = json.loads(re.sub(r"^\s*```(json)?|```\s*$", "", text.strip(), flags=re.M))
    except json.JSONDecodeError:
        log(f"unparseable detection response: {text[:200]!r}")
        return None
    if not isinstance(data, list):
        return None
    return [r for r in data if _valid_recipe(r) and not _is_edge_ghost(r)]


def _valid_recipe(r) -> bool:
    try:
        x1, y1, x2, y2 = r["text_bbox"]
        return x2 > x1 and y2 > y1
    except (KeyError, TypeError, ValueError):
        return False


def _is_edge_ghost(r) -> bool:
    """Facing-page sliver: narrow text box hugging a vertical image edge."""
    x1, _, x2, _ = r["text_bbox"]
    width = x2 - x1
    return width < GHOST_MAX_WIDTH and (x2 >= 1000 - GHOST_EDGE or x1 <= GHOST_EDGE)


def health(data) -> float:
    """Detection healthiness: wide, large text boxes = correct orientation."""
    if not data:
        return 0.0
    scores = []
    for r in data:
        x1, y1, x2, y2 = r["text_bbox"]
        w, h = (x2 - x1) / 1000, (y2 - y1) / 1000
        if w > 0 and h > 0:
            scores.append(min(w / h, 4.0) * (w * h) ** 0.5)
    return sum(scores) / len(scores) if scores else 0.0


# --------------------------------------------------------------- orientation

def axis_score(im: Image.Image) -> float:
    """>1: text lines horizontal (upright); <1: vertical (page rotated 90)."""
    g = im.convert("L")
    g.thumbnail((800, 800))
    a = np.asarray(g, dtype=np.float32)
    gy, gx = np.gradient(a)
    edges = np.abs(gx) + np.abs(gy)
    rows, cols = edges.sum(axis=1), edges.sum(axis=0)

    def hf_var(p):
        smooth = np.convolve(p, np.ones(15) / 15, mode="same")
        return float(np.var(p - smooth))

    return hf_var(rows) / max(hf_var(cols), 1e-6)


TRANSPOSES = {
    "0": None,
    "90cw": Image.Transpose.ROTATE_270,
    "90ccw": Image.Transpose.ROTATE_90,
}


def orient_and_detect(base, cfg_split, src: Path, im: Image.Image, out_dir: Path):
    """Try candidate orientations, return (results sorted by health, axis score).

    results items: (health, orientation_tag, detection_list)
    """
    score = axis_score(im)
    if score >= AXIS_UPRIGHT:
        tags = ["0"]
    elif score < AXIS_ROTATED:
        tags = ["90cw", "90ccw"]
    else:
        tags = ["0", "90cw", "90ccw"]
    log(f"axis score {score:.2f} -> candidates {tags}")

    results = []
    for tag in tags:
        t = TRANSPOSES[tag]
        if t is None:
            server_image = upload(base, src)
        else:
            tmp = out_dir / f"{src.stem}_{tag}.jpg"
            im.transpose(t).save(tmp, quality=95)
            server_image = upload(base, tmp)
        data = detect(base, cfg_split["workflow"], cfg_split["loader_id"], server_image)
        h = health(data)
        log(f"orientation {tag}: {len(data) if data else 0} recipe(s), health {h:.2f}")
        results.append((h, tag, data or []))
    results.sort(key=lambda r: r[0], reverse=True)
    return results, score


# --------------------------------------------------------------- cropping

# Crops are written as WebP: q90 keeps the page text fully legible for OCR and
# manual reading while being ~88% smaller than PNG (measured over 185 crops,
# 679 MB -> 84 MB). They stay small enough to keep in git as the audit trail.
CROP_QUALITY = 90


def save_crop(im: Image.Image, path: Path) -> None:
    """Write a crop as WebP. RGB conversion keeps palette/alpha inputs valid."""
    im.convert("RGB").save(path, "WEBP", quality=CROP_QUALITY, method=6)


def cut_text(im: Image.Image, bbox) -> Image.Image:
    W, H = im.size
    x1, y1, x2, y2 = bbox
    l, t, r, b = TEXT_PAD
    px1 = max(0, (x1 - l) / 1000 * W)
    py1 = max(0, (y1 - t) / 1000 * H)
    px2 = min(W, (x2 + r) / 1000 * W)
    py2 = min(H, (y2 + b) / 1000 * H)
    return im.crop((int(px1), int(py1), int(px2), int(py2)))


def square_photo_box(W: int, H: int, bbox):
    x1, y1, x2, y2 = (bbox[0] / 1000 * W, bbox[1] / 1000 * H,
                      bbox[2] / 1000 * W, bbox[3] / 1000 * H)
    mx, my = PHOTO_MARGIN * W, PHOTO_MARGIN * H
    x1, y1, x2, y2 = x1 - mx, y1 - my, x2 + mx, y2 + my
    bw, bh = x2 - x1, y2 - y1
    ar = max(bw, bh) / max(min(bw, bh), 1)
    side = max(bw, bh) if ar <= PHOTO_AR_GUARD else min(bw, bh) * PHOTO_AR_GUARD
    side = max(side, min(bw, bh))
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    if bw < side:
        x1, x2 = cx - side / 2, cx + side / 2
    if bh < side:
        y1, y2 = cy - side / 2, cy + side / 2
    # clamp by shifting so the box stays square
    if x1 < 0:
        x2 -= x1
        x1 = 0
    if y1 < 0:
        y2 -= y1
        y1 = 0
    if x2 > W:
        x1 -= x2 - W
        x2 = W
    if y2 > H:
        y1 -= y2 - H
        y2 = H
    return (int(max(0, x1)), int(max(0, y1)), int(x2), int(y2))


def draw_overlay(im: Image.Image, recipes: list, out: Path) -> None:
    W, H = im.size
    view = im.copy()
    view.thumbnail((1400, 1400))
    w, h = view.size
    d = ImageDraw.Draw(view)
    colors = ["#00c800", "#0064ff", "#ff9900", "#ff00ff"]
    for i, r in enumerate(recipes):
        c = colors[i % 4]
        x1, y1, x2, y2 = r["text_bbox"]
        l, t, rr, b = TEXT_PAD
        d.rectangle((max(0, x1 - l) / 1000 * w, max(0, y1 - t) / 1000 * h,
                     min(1000, x2 + rr) / 1000 * w, min(1000, y2 + b) / 1000 * h),
                    outline=c, width=3)
        d.text((max(0, x1 - l) / 1000 * w + 6, max(0, y1 - t) / 1000 * h + 6),
               f"{i + 1} text", fill=c)
        pb = r.get("photo_bbox")
        if pb:
            sx1, sy1, sx2, sy2 = square_photo_box(W, H, pb)
            d.rectangle((sx1 / W * w, sy1 / H * h, sx2 / W * w, sy2 / H * h),
                        outline=c, width=6)
            d.text((sx1 / W * w + 6, sy1 / H * h + 6), f"{i + 1} photo", fill=c)
    view.save(out, quality=85)


# --------------------------------------------------------------- main

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--image", type=Path, required=True, help="raw page photo")
    ap.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    ap.add_argument("--out-dir", type=Path, default=None,
                    help=f"crop output dir (default {DEFAULT_OUT}/<stem>)")
    ap.add_argument("--dry-run", action="store_true",
                    help="detect + overlay only, no crop files")
    args = ap.parse_args()

    if not args.image.is_file():
        die(f"no such image: {args.image}")
    cfg = json.loads(args.config.read_text(encoding="utf-8"))
    base = f"http://{cfg['host']}"
    cfg_split = cfg["modes"].get("split")
    if not cfg_split:
        die("config has no entry for modes.split")

    out_dir = args.out_dir or (DEFAULT_OUT / args.image.stem)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Full-resolution original; EXIF transpose so pixels match what a viewer sees.
    im = ImageOps.exif_transpose(Image.open(args.image)) or Image.open(args.image)

    results, score = orient_and_detect(base, cfg_split, args.image, im, out_dir)
    best_h, best_tag, recipes = results[0]
    review = len(results) > 1 and results[1][0] > 0 and \
        (best_h - results[1][0]) / max(best_h, 1e-6) < REVIEW_MARGIN
    if review:
        log(f"REVIEW FLAG: top-2 orientation healths within {REVIEW_MARGIN:.0%} "
            f"({best_h:.2f} vs {results[1][0]:.2f}) — check the overlay carefully")

    t = TRANSPOSES[best_tag]
    oriented = im if t is None else im.transpose(t)

    overlay = out_dir / f"{args.image.stem}_boxes.jpg"
    draw_overlay(oriented, recipes, overlay)

    out_recipes = []
    for i, r in enumerate(recipes, start=1):
        entry = {"index": i, "title": r.get("title", ""), "photo": None, "text": None}
        if not args.dry_run:
            text_crop = cut_text(oriented, r["text_bbox"])
            text_path = out_dir / f"{args.image.stem}_r{i}_text.webp"
            save_crop(text_crop, text_path)
            entry["text"] = str(text_path)
            pb = r.get("photo_bbox")
            if pb:
                box = square_photo_box(*oriented.size, pb)
                photo_path = out_dir / f"{args.image.stem}_r{i}.webp"
                save_crop(oriented.crop(box), photo_path)
                entry["photo"] = str(photo_path)
        out_recipes.append(entry)

    print(json.dumps({
        "source": str(args.image.resolve()),
        "orientation": best_tag,
        "axis_score": round(score, 2),
        "candidates": [{"orientation": tag, "health": round(h, 2)} for h, tag, _ in results],
        "review_flag": review,
        "overlay": str(overlay),
        "recipes": out_recipes,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
