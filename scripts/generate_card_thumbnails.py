#!/usr/bin/env python3
"""
Generate downscaled card thumbnails from images/ into images/cards/.
Max width 480px, same filename. Idempotent (overwrites existing).
Run from repo root: uv run python scripts/generate_card_thumbnails.py
"""

from pathlib import Path

from PIL import Image

CARD_MAX_WIDTH = 480
JPEG_QUALITY = 82
IMAGES_DIR = "images"
CARDS_DIR = "images/cards"


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    src_dir = repo_root / IMAGES_DIR
    out_dir = repo_root / CARDS_DIR

    if not src_dir.is_dir():
        return

    out_dir.mkdir(parents=True, exist_ok=True)

    for path in src_dir.iterdir():
        if path.is_dir() or path.name == "cards":
            continue
        suffix = path.suffix.lower()
        if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            continue

        out_path = out_dir / path.name
        try:
            with Image.open(path) as im:
                im.load()
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert("RGBA" if im.mode == "P" and "transparency" in im.info else "RGB")

                w, h = im.size
                if w <= CARD_MAX_WIDTH:
                    new_im = im
                else:
                    ratio = CARD_MAX_WIDTH / w
                    new_size = (CARD_MAX_WIDTH, int(h * ratio))
                    new_im = im.resize(new_size, Image.Resampling.LANCZOS)

                save_kw: dict = {}
                if out_path.suffix.lower() in (".jpg", ".jpeg"):
                    if new_im.mode == "RGBA":
                        new_im = new_im.convert("RGB")
                    save_kw["quality"] = JPEG_QUALITY
                    save_kw["optimize"] = True

                new_im.save(out_path, **save_kw)
        except Exception as e:
            print(f"Warning: skipped {path.name}: {e}", flush=True)


if __name__ == "__main__":
    main()
