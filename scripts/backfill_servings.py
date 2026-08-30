#!/usr/bin/env python3
"""Backfill the `servings:` frontmatter key on recipes and components.

The serving count has always been free text in the body (« Pour 4 personnes.
Temps de préparation : … »). The servings scaler needs it as data, so this
script reads the body, extracts the first yield statement, and inserts a
`servings:` line into the frontmatter. Non-person yields (« Pour 24 pièces »)
additionally get `servings_unit:`.

The key is inserted right after `date:` (else after `image:`, else after
`title:`), matching the canonical frontmatter order. Editing is textual, one
or two lines inserted, so diffs stay minimal — no YAML round-trip that would
reflow every ingredient list.

Ranges collapse to their lower bound (« Pour 6 à 8 personnes » -> 6): the
scaler's factor is `chosen / base`, so the smaller base errs toward serving
slightly more rather than slightly less.

Files with no parseable yield fall back to 4, the corpus median.

Idempotent: files that already declare `servings:` are skipped unless --force.

Usage (from repo root):
  uv run python scripts/backfill_servings.py [--dry-run] [--force]
"""
# /// script
# requires-python = ">=3.12"
# ///

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TARGET_DIRS = ("_recipes", "_components")
DEFAULT_SERVINGS = 4

# « Pour 4 personnes », « pour 6 à 8 personnes », « Pour 24 pièces »,
# « ... traditionnelle pour 10 personnes. », « 2 portions ».
YIELD_RE = re.compile(
    r"\bpour\s+(\d{1,3})\s*(?:à|-|ou)?\s*(?:\d{1,3})?\s*"
    r"(personnes?|pièces?|pieces?|parts?|portions?|bocaux|bocal|pots?)\b",
    re.IGNORECASE,
)
BARE_YIELD_RE = re.compile(
    r"\b(\d{1,3})\s+(portions?|parts?|pièces?|pieces?)\b", re.IGNORECASE
)

# Everything that is not "personnes" is a countable yield worth recording, so
# the stepper can say « 24 pièces » instead of « 24 personnes ».
def normalise_unit(word: str) -> str | None:
    low = word.lower().rstrip("s")
    if low.startswith("personne"):
        return None
    if low in ("piece", "pièce"):
        return "pièces"
    if low == "part":
        return "parts"
    if low == "portion":
        return "portions"
    if low in ("bocal", "bocaux", "pot"):
        return "pots"
    return None


def split_frontmatter(lines: list[str]) -> tuple[int, int] | None:
    """Return (start, end) line indices of the frontmatter fences."""
    if not lines or lines[0].strip() != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return 0, i
    return None


def has_key(lines: list[str], end: int, key: str) -> bool:
    return any(lines[i].startswith(key) for i in range(1, end))


def strip_key(lines: list[str], end: int, keys: tuple[str, ...]) -> list[str]:
    return [
        line
        for i, line in enumerate(lines)
        if not (1 <= i < end and line.startswith(keys))
    ]


def find_insertion_index(lines: list[str], end: int) -> int:
    """After `date:`, else after `image:`, else after `title:`, else line 1."""
    for key in ("date:", "image:", "title:"):
        for i in range(1, end):
            if lines[i].lstrip().startswith(key):
                return i + 1
    return 1


def extract_yield(body: str) -> tuple[int, str | None] | None:
    m = YIELD_RE.search(body)
    if m:
        return int(m.group(1)), normalise_unit(m.group(2))
    m = BARE_YIELD_RE.search(body)
    if m:
        return int(m.group(1)), normalise_unit(m.group(2))
    return None


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Backfill `servings:` frontmatter from body yield text.",
    )
    ap.add_argument("--dry-run", action="store_true",
                    help="report planned changes without writing any file")
    ap.add_argument("--force", action="store_true",
                    help="overwrite an existing `servings:` value")
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    files: list[Path] = []
    for d in TARGET_DIRS:
        files.extend(sorted((repo_root / d).glob("*.md")))

    written = skipped = defaulted = 0
    unparseable: list[str] = []
    non_person: list[str] = []

    for path in files:
        rel = path.relative_to(repo_root).as_posix()
        # newline="" keeps CRLF intact — some files use it, and translating
        # them to LF would turn a one-line insertion into a whole-file diff.
        with path.open("r", encoding="utf-8", newline="") as fh:
            lines = fh.read().splitlines(keepends=True)

        bounds = split_frontmatter(lines)
        if bounds is None:
            unparseable.append(rel)
            continue
        _, end = bounds
        eol = "\r\n" if lines[0].endswith("\r\n") else "\n"

        if has_key(lines, end, "servings:"):
            if not args.force:
                skipped += 1
                continue
            lines = strip_key(lines, end, ("servings:", "servings_unit:"))
            end = split_frontmatter(lines)[1]

        body = "".join(lines[end + 1:])
        found = extract_yield(body)
        if found is None:
            servings, unit = DEFAULT_SERVINGS, None
            defaulted += 1
        else:
            servings, unit = found
            if unit:
                non_person.append(f"{rel}: {servings} {unit}")

        idx = find_insertion_index(lines, end)
        new_lines = [f"servings: {servings}{eol}"]
        if unit:
            new_lines.append(f"servings_unit: {unit}{eol}")
        lines[idx:idx] = new_lines

        if args.dry_run:
            print(f"  {rel}: servings: {servings}" + (f" ({unit})" if unit else ""))
        else:
            with path.open("w", encoding="utf-8", newline="") as fh:
                fh.write("".join(lines))
        written += 1

    verb = "would write" if args.dry_run else "wrote"
    print(f"{verb} {written} file(s) · skipped {skipped} (already had servings)")
    print(f"  defaulted to {DEFAULT_SERVINGS}: {defaulted}")
    if non_person:
        print(f"  non-person yields: {len(non_person)}")
        for line in non_person:
            print(f"    {line}")
    if unparseable:
        print(f"  UNPARSEABLE frontmatter: {len(unparseable)}", file=sys.stderr)
        for rel in unparseable:
            print(f"    {rel}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
