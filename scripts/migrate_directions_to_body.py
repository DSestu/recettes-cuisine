#!/usr/bin/env python3
"""
Migrate recipe/component files from list-style `directions:` in frontmatter
to body Markdown (## Préparation + numbered steps).

Converts one or more files, or all .md files in _recipes/ and _components/.
Idempotent: skips files that have no `directions` key or empty directions.

Usage (from repo root):
  uv run python scripts/migrate_directions_to_body.py [--dry-run] [FILE ...]
  uv run python scripts/migrate_directions_to_body.py [--dry-run] --all

With --dry-run, only reports what would be done; no files are written.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import yaml

DIRECTIONS_HEADING = "## Préparation"
RECIPES_DIR = "_recipes"
COMPONENTS_DIR = "_components"


def parse_frontmatter_and_body(content: str) -> tuple[dict, str]:
    """Split content into frontmatter (dict) and body (str)."""
    content = content.rstrip()
    if not content.startswith("---"):
        return {}, content
    parts = content.split("\n", 1)
    if len(parts) < 2:
        return {}, ""
    rest = parts[1]
    if "---" not in rest:
        return {}, content
    fm_str, body = rest.split("---", 1)
    fm_str = fm_str.strip()
    body = body.lstrip("\n")
    try:
        data = yaml.safe_load(fm_str) or {}
    except yaml.YAMLError:
        return {}, content
    return data if isinstance(data, dict) else {}, body


def dump_frontmatter(data: dict) -> str:
    """Serialize frontmatter to YAML (no trailing newline)."""
    return yaml.dump(
        data,
        allow_unicode=True,
        default_flow_style=False,
        sort_keys=False,
        width=1000,
    ).rstrip()


def migrate_file(path: Path, dry_run: bool) -> bool:
    """
    Migrate a single file: move directions from frontmatter to body.
    Returns True if the file was (or would be) modified.
    """
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as e:
        print(f"Warning: could not read {path}: {e}", file=sys.stderr)
        return False

    fm, body = parse_frontmatter_and_body(text)
    directions = fm.get("directions")
    if not directions or not isinstance(directions, list):
        return False

    steps = [s for s in directions if isinstance(s, str) and s.strip()]
    if not steps:
        return False

    # New frontmatter: remove directions
    new_fm = {k: v for k, v in fm.items() if k != "directions"}

    # New body: existing body (trimmed) + ## Préparation + numbered steps
    existing = body.strip()
    numbered = "\n".join(f"{i}. {s}" for i, s in enumerate(steps, 1))
    if existing:
        new_body = f"{existing}\n\n{DIRECTIONS_HEADING}\n\n{numbered}\n"
    else:
        new_body = f"{DIRECTIONS_HEADING}\n\n{numbered}\n"

    new_content = f"---\n{dump_frontmatter(new_fm)}\n---\n\n{new_body}"

    if dry_run:
        print(f"Would migrate: {path}")
        return True

    try:
        path.write_text(new_content, encoding="utf-8")
    except OSError as e:
        print(f"Error writing {path}: {e}", file=sys.stderr)
        return False
    print(f"Migrated: {path}")
    return True


def collect_paths(repo_root: Path, files: list[Path] | None, all_flag: bool) -> list[Path]:
    """Return list of .md paths to process."""
    if all_flag:
        out: list[Path] = []
        for name in (RECIPES_DIR, COMPONENTS_DIR):
            d = repo_root / name
            if d.is_dir():
                out.extend(sorted(d.glob("*.md")))
        return out
    if not files:
        return []
    return [p for p in files if p.suffix.lower() == ".md"]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Migrate directions from frontmatter list to body Markdown (## Préparation)."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only report what would be done; do not write files",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Process all .md files in _recipes/ and _components/",
    )
    parser.add_argument(
        "files",
        nargs="*",
        type=Path,
        help="Recipe or component .md files to migrate",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    paths = collect_paths(repo_root, args.files if args.files else None, args.all)

    if not paths:
        print("No files to process. Pass file paths or --all.", file=sys.stderr)
        return 1

    count = 0
    for p in paths:
        if not p.is_absolute():
            p = repo_root / p
        if not p.is_file():
            print(f"Warning: not a file: {p}", file=sys.stderr)
            continue
        if migrate_file(p, args.dry_run):
            count += 1

    if args.dry_run and count:
        print(f"Dry run: {count} file(s) would be migrated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
