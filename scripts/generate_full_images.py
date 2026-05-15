#!/usr/bin/env python3
"""
Generate full-resolution WebP variants for the zoom overlay.

Reads `images/*.{png,jpg,jpeg,webp,avif}` and writes `images/full/<stem>.webp`
at max 2400 px wide, quality 88. Used by the recipe page zoom overlay so the
PNG/JPG originals are no longer needed at request time.

Idempotent: skips files whose full variant already exists and is newer than
the source. Run from repo root: `uv run python scripts/generate_full_images.py`.
"""

from pathlib import Path

from PIL import Image

FULL_MAX_WIDTH = 2400
WEBP_QUALITY = 88
IMAGES_DIR = "images"
FULL_DIR = "images/full"
SOURCE_EXTS = {".webp"}
EXCLUDE_SUBDIRS = {"cards", "hero", "full"}


def needs_rebuild(src: Path, dst: Path) -> bool:
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    src_dir = repo_root / IMAGES_DIR
    out_dir = repo_root / FULL_DIR

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
                if w > FULL_MAX_WIDTH:
                    ratio = FULL_MAX_WIDTH / w
                    im = im.resize(
                        (FULL_MAX_WIDTH, int(h * ratio)), Image.Resampling.LANCZOS
                    )

                im.save(out_path, format="WEBP", quality=WEBP_QUALITY, method=6)
                print(f"full: {path.name} -> {out_path.relative_to(repo_root)}", flush=True)
        except Exception as e:
            print(f"Warning: skipped {path.name}: {e}", flush=True)


if __name__ == "__main__":
    main()
