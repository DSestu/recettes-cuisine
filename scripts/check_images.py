#!/usr/bin/env python3
"""
Post-WebP-migration verifier.

For every recipe and component, asserts the four canonical WebP files exist:
  - images/<slug>.webp           (source)
  - images/cards/<slug>.webp     (480 w)
  - images/hero/<slug>.webp      (1600 w)
  - images/full/<slug>.webp      (2400 w)

Also greps site-facing files for stale non-WebP image references
(`.png`, `.jpg`, `.jpeg`, `.avif`) and reports them.

Exits 0 on full pass, 1 with a summary on any miss.

Run from repo root: uv run python scripts/check_images.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
RECIPE_DIRS = ["_recipes", "_components"]
GREP_TARGETS = [
    "_recipes",
    "_components",
    "_layouts",
    "_includes",
    "assets/js",
    "index.html",
    "recherche.html",
    "home_categories.md",
]
NON_WEBP_RE = re.compile(r"\.(png|jpe?g|avif)\b", re.IGNORECASE)
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
DERIVED_DIRS = ("cards", "hero", "full")


def parse_frontmatter(md_path: Path) -> dict | None:
    text = md_path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        return None


def slugs_from_image_field(field) -> list[str]:
    """Normalise the `image:` frontmatter value to a list of bare slugs."""
    if not field:
        return []
    if isinstance(field, str):
        items = [field]
    elif isinstance(field, list):
        items = [str(x) for x in field]
    else:
        return []
    out = []
    for item in items:
        stem = Path(item).stem  # strips any extension
        if stem:
            out.append(stem)
    return out


def check_variants(slug: str) -> list[str]:
    missing = []
    for variant in ("", "cards/", "hero/", "full/"):
        p = REPO_ROOT / "images" / variant / f"{slug}.webp"
        if not p.exists():
            missing.append(str(p.relative_to(REPO_ROOT)))
    return missing


def check_inline_pairs() -> list[str]:
    """Every <slug>/<step>.full.webp must have a sibling <step>.webp (and vice-versa)."""
    missing: list[str] = []
    images = REPO_ROOT / "images"
    if not images.is_dir():
        return missing
    for slug_dir in images.iterdir():
        if not slug_dir.is_dir() or slug_dir.name in {"cards", "hero", "full"}:
            continue
        for path in slug_dir.iterdir():
            if not path.is_file():
                continue
            if path.name.endswith(".full.webp"):
                stem = path.name[: -len(".full.webp")]
                small = slug_dir / f"{stem}.webp"
                if not small.exists():
                    missing.append(str(small.relative_to(REPO_ROOT)))
            elif path.suffix.lower() == ".webp":
                full = slug_dir / f"{path.stem}.full.webp"
                if not full.exists():
                    missing.append(str(full.relative_to(REPO_ROOT)))
    return missing


def grep_non_webp() -> list[tuple[Path, int, str]]:
    hits: list[tuple[Path, int, str]] = []
    for target in GREP_TARGETS:
        p = REPO_ROOT / target
        if not p.exists():
            continue
        files = p.rglob("*") if p.is_dir() else [p]
        for f in files:
            if not f.is_file():
                continue
            if f.suffix.lower() not in {".md", ".html", ".js", ".liquid"}:
                continue
            try:
                for lineno, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
                    if NON_WEBP_RE.search(line):
                        hits.append((f.relative_to(REPO_ROOT), lineno, line.strip()))
            except UnicodeDecodeError:
                continue
    return hits


def main() -> int:
    missing_by_recipe: list[tuple[Path, str, list[str]]] = []
    no_image_field: list[Path] = []

    for dir_name in RECIPE_DIRS:
        d = REPO_ROOT / dir_name
        if not d.is_dir():
            continue
        for md in sorted(d.glob("*.md")):
            fm = parse_frontmatter(md)
            if fm is None:
                continue
            slugs = slugs_from_image_field(fm.get("image"))
            if not slugs:
                no_image_field.append(md.relative_to(REPO_ROOT))
                continue
            for slug in slugs:
                missing = check_variants(slug)
                if missing:
                    missing_by_recipe.append((md.relative_to(REPO_ROOT), slug, missing))

    grep_hits = grep_non_webp()
    inline_missing = check_inline_pairs()

    print(f"recipes/components checked: {sum(1 for d in RECIPE_DIRS for _ in (REPO_ROOT / d).glob('*.md'))}")
    print(f"missing-variant entries:    {len(missing_by_recipe)}")
    print(f"recipes without image field:{len(no_image_field)}")
    print(f"non-webp grep hits:         {len(grep_hits)}")
    print(f"missing inline pair files:  {len(inline_missing)}")

    if missing_by_recipe:
        print("\nMISSING VARIANTS")
        for md, slug, missing in missing_by_recipe[:30]:
            print(f"  {md} (slug={slug}): {', '.join(missing)}")
        if len(missing_by_recipe) > 30:
            print(f"  ... +{len(missing_by_recipe) - 30} more")

    if no_image_field:
        print("\nNO IMAGE FIELD")
        for md in no_image_field[:10]:
            print(f"  {md}")
        if len(no_image_field) > 10:
            print(f"  ... +{len(no_image_field) - 10} more")

    if grep_hits:
        print("\nNON-WEBP REFERENCES")
        for path, lineno, line in grep_hits[:30]:
            print(f"  {path}:{lineno}: {line[:200]}")
        if len(grep_hits) > 30:
            print(f"  ... +{len(grep_hits) - 30} more")

    if inline_missing:
        print("\nMISSING INLINE PAIRS")
        for p in inline_missing[:30]:
            print(f"  {p}")
        if len(inline_missing) > 30:
            print(f"  ... +{len(inline_missing) - 30} more")

    if missing_by_recipe or grep_hits or inline_missing:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
