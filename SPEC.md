# SPEC — "Recettes utilisant ce composant" section on component pages

## Objective

On component pages only (files in `_components/`), display a reverse-lookup list of all recipes that reference the component via their frontmatter `components:` field. This helps users browsing a component (sauce, marinade, vinaigrette, etc.) discover the parent dishes that use it.

## Scope

- Applies only when the currently rendered page belongs to the `components` collection.
- Recipe pages (`_recipes/`) are unchanged.
- No new build step, no new data file — the lookup is done in Liquid against `site.recipes` at build time.

## Placement

In `_layouts/recipe.html`, insert the new section:
- **After** the "Recherche similaires" button block (around line 529).
- **Before** the ingredients/components/directions block (around line 545).

Render only when:
1. The current page is in the `components` collection, AND
2. At least one recipe in `site.recipes` lists `page.title` inside its `components:` frontmatter array.

If either condition fails, render nothing (no heading, no empty state).

## Detecting component pages

Components live in the `components` Jekyll collection. Use `{% if page.collection == "components" %}` to gate the block. If the variable is unavailable in this Jekyll setup, fall back to `{% if page.url contains "/components/" %}` — verify before committing.

## Matching semantics

A recipe `R` is considered to use component `C` when:
- `R.components` exists, AND
- `R.components` contains a string exactly equal to `C.title` (case-sensitive, trimmed).

Mirrors the existing pattern at `_layouts/recipe.html:611` (`{% if recipe.title == component %}`).

## Visual design

Reuse the markup pattern of the existing **Suggestions** grid at `_layouts/recipe.html:693-700`:

- Heading: `Recettes utilisant ce composant` (uppercase, primary color, `h2` matching sibling headings).
- Card style identical to Suggestions: `aspect-video` canvas with `images/cards/<slug>.webp` background, title below, hover scale/rotate.
- Grid: `grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`.
- **No limit** on number of cards shown.
- Sort: alphabetical by `title` (use `sort_natural: "title"`).

## Data flow

Pure Liquid, evaluated at build time. Pseudocode:

```liquid
{% if page.collection == "components" %}
  {% assign uses = "" | split: "" %}
  {% for r in site.recipes %}
    {% if r.components contains page.title %}
      {% assign uses = uses | push: r %}
    {% endif %}
  {% endfor %}
  {% if uses.size > 0 %}
    {% assign uses = uses | sort_natural: "title" %}
    <!-- render grid -->
  {% endif %}
{% endif %}
```

If the `push` filter is unavailable, use the standard single-item-array concat workaround.

## Out of scope

- No JS-driven dynamic list (server-render in Liquid; data is static and small).
- No image regeneration, no new derivatives.
- No changes to `_components/` content, frontmatter schema, or the tag registry.
- No changes to recipe pages' rendering.

## Acceptance criteria

1. Open a component page that is referenced by ≥1 recipe (e.g. `_components/sauce_orange.md`, referenced by `ribs_sauce_orange`). The section appears with the correct heading, between the "Recherche similaires" button and the ingredients list, listing the parent recipe(s) as cards.
2. Open a component page that is referenced by no recipe. No section, no heading, no empty placeholder.
3. Open any recipe page. No new section; the page is visually unchanged.
4. Cards link to the parent recipe URL; image background uses the parent recipe's `images/cards/<slug>.webp`.
5. `bundle exec jekyll build` succeeds with no new warnings.

## Boundaries

**Always do:**
- Render server-side via Liquid; keep the section static HTML.
- Reuse existing Tailwind utility classes and color tokens (`text-primary`, etc.).
- Match the Suggestions grid markup for visual consistency.

**Ask first:**
- Before changing component frontmatter, the tag registry, or any image asset.
- Before introducing new build scripts, data files, or JS for this feature.

**Never:**
- Modify `_recipes/` files or recipe page rendering for this change.
- Add JS to compute the reverse lookup (build-time Liquid is sufficient).
- Add a "no parent recipe" empty state UI.

## Testing strategy

Manual verification (no automated tests in this repo):
1. `bundle exec jekyll serve` (or `docker compose up`).
2. Visit a known component page with parents (`/components/sauce_orange/`).
3. Visit a component page with no parent (pick one after grep-confirming).
4. Visit a recipe page; confirm no change.
5. Inspect HTML to confirm section is absent (not just hidden) when there are no matches.

## Files touched

- `_layouts/recipe.html` — single insertion of the new Liquid block.

No other files change.
