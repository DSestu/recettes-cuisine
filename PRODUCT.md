# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site owner, cooking at home, plus a close circle of family and friends who open
links or QR codes the owner shares. Used equally on phone (kitchen, market) and desktop
(planning, browsing).

## Product Purpose

A personal French-language recipe collection (`dsestu.github.io/recettes-cuisine`) that
helps decide what to cook and then cook it: find a recipe, scale it, follow it. Success
means reaching a dish worth cooking quickly, and following it without friction.

## Positioning

- Curated: only recipes the owner actually cooks, around 217 recipes plus reusable
  components (sauces, marinades, bouillons).
- Seasonality data: a fortnight-level produce calendar (`_data/seasonality.yml`) that
  drives the ingredient calendar and seasonal recipe scoring.
- Rich recipe tooling: servings scaler, prep/cook/rest times, difficulty, components,
  advanced search by tags, time and difficulty, country grouping.
- Dish photos on every recipe (real or generated), served as WebP derivatives.

## Operating Context

- Static Jekyll site on GitHub Pages; no server. Data is generated at commit time by
  Python scripts run through pre-commit.
- Shared state lives in the URL (verbose French params), with an on-page QR code that
  encodes the current view.
- Content is authored in Markdown with YAML frontmatter and canonical tags
  (`_data/recipe_tags.yml`).

## Capabilities and Constraints

- All user-facing text is French.
- Vanilla JS and D3 only; no heavy JS dependencies, no backend.
- Images are WebP only.
- Recipe content (quantities, steps) is never altered by tooling.

## Evidence on Hand

- `_recipes/` (≈217), `_components/`, `images/` with card/hero/full derivatives.
- `_data/seasonality.yml`, `_data/recipe_tags.yml`, `_data/scaling.json`.
- No testimonials, analytics or audience data exist; do not invent any.

## Product Principles

1. Seasonality is the site's signature; surface it where it helps choose a dish.
2. Show the food: photos carry decisions more than scores or tables.
3. Every view is linkable: the URL reproduces what is on screen.
4. Personal over generic: suggestions draw only from recipes the owner cooks.
