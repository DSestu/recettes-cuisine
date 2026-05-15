#!/usr/bin/env python3
"""
Generate small WebP variants for inline recipe images.

For every `images/<slug>/<step>.full.webp` (the source-of-truth inline image),
emit `images/<slug>/<step>.webp` at max 1000 px wide, q82. This is what the
recipe body renders inline; the `.full.webp` is loaded only when the user
clicks the inline image.

Skips top-level `images/*.webp` and the `cards/`, `hero/`, `full/` dirs —
those are the main-image variants, handled by their own scripts.

Idempotent: skips when the small variant is newer than its `.full.webp` source.
Run from repo root: uv run python scripts/generate_inline_small.py
"""

from pathlib import Path

from PIL import Image

SMALL_MAX_WIDTH = 1000
WEBP_QUALITY = 82
IMAGES_DIR = "images"
EXCLUDE_SUBDIRS = {"cards", "hero", "full"}
FULL_SUFFIX = ".full.webp"


def needs_rebuild(src: Path, dst: Path) -> bool:
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    src_dir = repo_root / IMAGES_DIR
    if not src_dir.is_dir():
        return

    for slug_dir in src_dir.iterdir():
        if not slug_dir.is_dir() or slug_dir.name in EXCLUDE_SUBDIRS:
            continue

        for path in slug_dir.iterdir():
            if not path.is_file() or not path.name.endswith(FULL_SUFFIX):
                continue

            stem = path.name[: -len(FULL_SUFFIX)]
            out_path = slug_dir / f"{stem}.webp"
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
                    if w > SMALL_MAX_WIDTH:
                        ratio = SMALL_MAX_WIDTH / w
                        im = im.resize(
                            (SMALL_MAX_WIDTH, int(h * ratio)), Image.Resampling.LANCZOS
                        )

                    im.save(out_path, format="WEBP", quality=WEBP_QUALITY, method=6)
                    print(f"inline: {path.relative_to(repo_root)} -> {out_path.relative_to(repo_root)}", flush=True)
            except Exception as e:
                print(f"Warning: skipped {path.name}: {e}", flush=True)


if __name__ == "__main__":
    main()
