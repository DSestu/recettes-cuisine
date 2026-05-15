#!/usr/bin/env python3
"""
One-shot migration: convert non-WebP sources under `images/` to WebP.

Walks `images/` top level AND one level of subdirectories (excluding
`cards/`, `hero/`, `full/`). For each `.png|.jpg|.jpeg|.avif` file, encodes
the equivalent `.webp` at q90 with `method=6`. After successful encode +
verify, deletes the original (unless `--no-delete` is passed).

Idempotent: skips files whose WebP twin already exists and is newer than
the source.

Run from repo root:
  uv run python scripts/migrate_to_webp.py --dry-run
  uv run python scripts/migrate_to_webp.py --no-delete
  uv run python scripts/migrate_to_webp.py
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

TOP_LEVEL_QUALITY = 90
INLINE_FULL_QUALITY = 88
INLINE_FULL_MAX_WIDTH = 2400
IMAGES_DIR = "images"
EXCLUDE_SUBDIRS = {"cards", "hero", "full"}
LOSSY_EXTS = {".png", ".jpg", ".jpeg", ".avif"}


def iter_sources(images_dir: Path):
    """Yield (src, is_subfolder) for non-WebP images in images/ and one level of subdirs."""
    for path in images_dir.iterdir():
        if path.is_dir():
            if path.name in EXCLUDE_SUBDIRS:
                continue
            for child in path.iterdir():
                if child.is_file() and child.suffix.lower() in LOSSY_EXTS:
                    yield child, True
            continue
        if path.suffix.lower() in LOSSY_EXTS:
            yield path, False


def dst_for(src: Path, is_subfolder: bool) -> Path:
    """Top-level: <stem>.webp. Subfolder: <stem>.full.webp (full-size source of truth)."""
    if is_subfolder:
        return src.with_name(src.stem + ".full.webp")
    return src.with_suffix(".webp")


def needs_rebuild(src: Path, dst: Path) -> bool:
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime


def encode(src: Path, dst: Path, is_subfolder: bool) -> None:
    with Image.open(src) as im:
        im.load()
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert(
                "RGBA" if im.mode == "P" and "transparency" in im.info else "RGB"
            )
        if is_subfolder:
            w, h = im.size
            if w > INLINE_FULL_MAX_WIDTH:
                ratio = INLINE_FULL_MAX_WIDTH / w
                im = im.resize(
                    (INLINE_FULL_MAX_WIDTH, int(h * ratio)), Image.Resampling.LANCZOS
                )
            quality = INLINE_FULL_QUALITY
        else:
            quality = TOP_LEVEL_QUALITY
        im.save(dst, format="WEBP", quality=quality, method=6)


def verify(webp: Path) -> bool:
    if not webp.exists() or webp.stat().st_size == 0:
        return False
    try:
        with Image.open(webp) as im:
            im.verify()
        return True
    except Exception:
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true",
                        help="list planned encodes/deletes without writing")
    parser.add_argument("--no-delete", action="store_true",
                        help="encode only; leave originals in place")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    src_dir = repo_root / IMAGES_DIR
    if not src_dir.is_dir():
        print(f"error: {src_dir} not found", file=sys.stderr)
        return 1

    planned: list[tuple[Path, Path, bool]] = []
    skipped = 0
    for src, is_subfolder in iter_sources(src_dir):
        dst = dst_for(src, is_subfolder)
        if not needs_rebuild(src, dst):
            skipped += 1
            continue
        planned.append((src, dst, is_subfolder))

    print(f"sources: {len(planned) + skipped}  to-encode: {len(planned)}  up-to-date: {skipped}")

    if args.dry_run:
        for src, dst, _ in planned:
            print(f"  encode {src.relative_to(repo_root)} -> {dst.relative_to(repo_root)}")
            if not args.no_delete:
                print(f"  delete {src.relative_to(repo_root)}")
        return 0

    failures = 0
    for src, dst, is_subfolder in planned:
        try:
            encode(src, dst, is_subfolder)
        except Exception as e:
            print(f"FAIL encode {src.name}: {e}", file=sys.stderr)
            failures += 1
            continue
        if not verify(dst):
            print(f"FAIL verify {dst.name}; leaving {src.name} untouched", file=sys.stderr)
            failures += 1
            continue
        print(f"encoded {src.relative_to(repo_root)} -> {dst.relative_to(repo_root)}")
        if not args.no_delete:
            src.unlink()
            print(f"deleted {src.relative_to(repo_root)}")

    if failures:
        print(f"{failures} failure(s)", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
