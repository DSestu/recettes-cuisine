#!/usr/bin/env python3
"""
Generate downscaled WebP card thumbnails from images/ into images/cards/.
Max width 480 px, quality 82, method=6. Always outputs .webp regardless of
source extension. Idempotent: skips when the thumbnail is newer than its source.
Run from repo root: uv run python scripts/generate_card_thumbnails.py
"""

from pathlib import Path

from PIL import Image

CARD_MAX_WIDTH = 480
WEBP_QUALITY = 82
IMAGES_DIR = "images"
CARDS_DIR = "images/cards"
SOURCE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}
EXCLUDE_SUBDIRS = {"cards", "hero", "full"}


def needs_rebuild(src: Path, dst: Path) -> bool:
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    src_dir = repo_root / IMAGES_DIR
    out_dir = repo_root / CARDS_DIR

    if not src_dir.is_dir():
        return

    out_dir.mkdir(parents=True, exist_ok=True)

    for path in src_dir.iterdir():
        if path.is_dir() or path.name in EXCLUDE_SUBDIRS:
            continue
        if path.suffix.lower() not in SOURCE_EXTS:
            continue

        out_path = out_dir / (path.stem + ".webp")
        if not needs_rebuild(path, out_path):
            continue

        try:
            with Image.open(path) as im:
                im.load()
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert(
                        "RGBA" if im.mode == "P" and "transparency" in im.info else "RGB"
                    )

                w, h = im.size
                if w > CARD_MAX_WIDTH:
                    ratio = CARD_MAX_WIDTH / w
                    new_size = (CARD_MAX_WIDTH, int(h * ratio))
                    new_im = im.resize(new_size, Image.Resampling.LANCZOS)
                else:
                    new_im = im

                new_im.save(out_path, format="WEBP", quality=WEBP_QUALITY, method=6)
                print(f"card: {path.name} -> {out_path.relative_to(repo_root)}", flush=True)
        except Exception as e:
            print(f"Warning: skipped {path.name}: {e}", flush=True)


if __name__ == "__main__":
    main()
