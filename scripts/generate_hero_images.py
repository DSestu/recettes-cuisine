#!/usr/bin/env python3
"""
Generate optimized hero images for recipe pages.

Reads `images/*.{png,jpg,jpeg,webp,avif}` and writes `images/hero/<stem>.webp`
at max 1600 px wide, quality 80. The optimized hero is what the recipe
page renders inline; the original stays for the zoom overlay (full-res).

Idempotent: skips files whose hero already exists and is newer than the
source. Run from repo root: `uv run python scripts/generate_hero_images.py`.
"""

from pathlib import Path

from PIL import Image

HERO_MAX_WIDTH = 1600
WEBP_QUALITY = 80
IMAGES_DIR = "images"
HERO_DIR = "images/hero"
SOURCE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
EXCLUDE_SUBDIRS = {"cards", "hero"}


def needs_rebuild(src: Path, dst: Path) -> bool:
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    src_dir = repo_root / IMAGES_DIR
    out_dir = repo_root / HERO_DIR

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
                # WebP supports RGB and RGBA; flatten palette/other modes.
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert(
                        "RGBA" if im.mode == "P" and "transparency" in im.info else "RGB"
                    )

                w, h = im.size
                if w > HERO_MAX_WIDTH:
                    ratio = HERO_MAX_WIDTH / w
                    im = im.resize(
                        (HERO_MAX_WIDTH, int(h * ratio)), Image.Resampling.LANCZOS
                    )

                im.save(out_path, format="WEBP", quality=WEBP_QUALITY, method=6)
                print(f"hero: {path.name} -> {out_path.relative_to(repo_root)}", flush=True)
        except Exception as e:
            print(f"Warning: skipped {path.name}: {e}", flush=True)


if __name__ == "__main__":
    main()
