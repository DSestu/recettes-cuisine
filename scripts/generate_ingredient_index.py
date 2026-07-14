#!/usr/bin/env python3
"""Generate `assets/data/ingredient_index.json` + `assets/data/seasonality.json`.

Feeds the `/calendrier/` page: maps each seasonal ingredient to the recipes
that use it, and provides recipe metadata (title, image, seasonal ingredients).

Rules:
- A recipe is included iff it uses ≥ 1 ingredient from `_data/seasonality.yml`.
- Only tags that are BOTH in the seasonality file AND appear on the recipe
  are recorded — non-seasonal tags are dropped.
- Output is deterministic (sorted keys, sorted lists) for clean git diffs.

Run: `uv run python scripts/generate_ingredient_index.py`
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
RECIPES_DIR = ROOT / "_recipes"
SEASONALITY_YML = ROOT / "_data" / "seasonality.yml"
OUT_DIR = ROOT / "assets" / "data"
OUT_INDEX = OUT_DIR / "ingredient_index.json"
OUT_SEASONALITY = OUT_DIR / "seasonality.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def load_seasonality() -> dict[str, dict]:
    with SEASONALITY_YML.open("r", encoding="utf-8") as f:
        entries = yaml.safe_load(f)
    return {e["id"]: {"category": e["category"], "season": e["season"]} for e in entries}


def parse_frontmatter(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        print(f"WARN: bad frontmatter in {path.name}: {e}", file=sys.stderr)
        return None


def slug_of(path: Path) -> str:
    return path.stem


def main() -> int:
    seasonality = load_seasonality()
    seasonal_ids = set(seasonality.keys())

    ingredient_recipes: dict[str, list[str]] = {k: [] for k in seasonal_ids}
    recipes_out: dict[str, dict] = {}

    for path in sorted(RECIPES_DIR.glob("*.md")):
        fm = parse_frontmatter(path)
        if not fm:
            continue
        tags = fm.get("tags") or []
        if not isinstance(tags, list):
            continue
        seasonal_hits = sorted({t for t in tags if isinstance(t, str) and t in seasonal_ids})
        if not seasonal_hits:
            continue
        slug = slug_of(path)
        recipes_out[slug] = {
            "title": fm.get("title", slug),
            "image": fm.get("image", slug),
            "ingredients": seasonal_hits,
        }
        for ing in seasonal_hits:
            ingredient_recipes[ing].append(slug)

    ingredients_out = {}
    for iid, meta in sorted(seasonality.items()):
        ingredients_out[iid] = {
            "category": meta["category"],
            "recipes": sorted(ingredient_recipes[iid]),
        }

    index = {
        "ingredients": ingredients_out,
        "recipes": dict(sorted(recipes_out.items())),
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_INDEX.write_text(
        json.dumps(index, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    OUT_SEASONALITY.write_text(
        json.dumps(seasonality, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    with_recipes = sum(1 for v in ingredients_out.values() if v["recipes"])
    exploratory = len(ingredients_out) - with_recipes
    print(f"Wrote {OUT_INDEX.relative_to(ROOT)}")
    print(f"  ingredients: {len(ingredients_out)} ({with_recipes} with recipes, {exploratory} exploratory)")
    print(f"  recipes with ≥1 seasonal ingredient: {len(recipes_out)}")
    print(f"Wrote {OUT_SEASONALITY.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
