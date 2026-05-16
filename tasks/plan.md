# PLAN — "Recettes utilisant ce composant" section on component pages

References: `SPEC.md` (root), layout at `_layouts/recipe.html`, collections config at `_config.yml`.

## Context

- The site uses a single `_layouts/recipe.html` for both `recipes` and `components` collections (both have `output: true` in `_config.yml`).
- Parent recipes reference components via frontmatter `components: [- Exact Title]`. Existing forward lookup is at `_layouts/recipe.html:611`.
- Suggestions grid (the visual template to mimic) is at `_layouts/recipe.html:693-700` (HTML shell) and `:885-951` (JS data + render).
- Goal section sits **after** the "Recherche similaires" button (~L529) and **before** the ingredients/components/directions block (~L545).

## Dependency graph

The change is a single vertical slice in one file. There are no cross-component dependencies.

```
[Liquid block in _layouts/recipe.html]
         |
         v
 [verify in Jekyll build]
         |
         v
 [verify visually in browser: parent-having component, parent-less component, recipe page]
```

## Slicing strategy

One vertical slice — the entire feature is rendered server-side from existing data. Slicing horizontally (HTML / Liquid logic / styling separately) would create no-op intermediate states. We deliver it as a single self-contained task with explicit verification gates.

## Tasks

### T1 — Add the reverse-lookup section to `_layouts/recipe.html`

**Insert** at L530 (immediately after the closing `</div>` of the "Recherche similaires" block, before the `{% if page.directions.size > 0 %}` description block) a Liquid block guarded by `{% if page.collection == "components" %}` that:

1. Iterates `site.recipes`, collecting recipes whose `r.components` array `contains page.title`.
2. If the collection is non-empty, sorts alphabetically (`sort_natural: "title"`) and renders:
   - `<h2>` heading "Recettes utilisant ce composant" with the same Tailwind classes as the sibling "Suggestions" heading.
   - A grid (`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`) of anchor cards reusing the exact card markup from the Suggestions JS render (`canvas.aspect-video` with `background-image:url(.../images/cards/<slug>.webp)`, title `<h1>` below).
3. If the collection is empty, render nothing (no heading, no wrapper div).
4. Image slug derivation: `{% assign card_slug = r.image | split: '.' | first %}` — handles both bare-slug and legacy-extension frontmatter, consistent with `_layouts/recipe.html:918`.

**Acceptance criteria** (mirrors SPEC):
- A1. `/components/sauce_orange/` shows the section with a card for `ribs_sauce_orange`, positioned between "Recherche similaires" and "Ingrédients".
- A2. A component page with no parent recipe (verify by grepping `site.recipes` for `components:` entries) renders **no** section — the rendered HTML must not contain the heading string.
- A3. Any recipe page (e.g. `/recipes/ribs_sauce_orange/`) is byte-identical to its current rendering in the affected layout region.
- A4. Card links resolve to the parent recipe URL; image background loads from `/images/cards/<slug>.webp`.
- A5. `bundle exec jekyll build` succeeds with no new warnings; no Liquid syntax errors.

**Verification steps:**
1. `bundle exec jekyll build` → confirm exit 0 and no new warnings vs. baseline (`git stash && jekyll build` to capture baseline if needed).
2. `bundle exec jekyll serve` → manually browse the three URL classes above.
3. `curl -s http://localhost:4000/recettes-cuisine/components/<no-parent-component>/ | grep -c "Recettes utilisant ce composant"` → expect `0`.
4. `curl -s http://localhost:4000/recettes-cuisine/components/sauce_orange/ | grep -c "Recettes utilisant ce composant"` → expect `1`.
5. Visually confirm card image, title, and link target.

**Risks / unknowns:**
- `page.collection` may be unset for non-collection pages but should be `"components"` for items in `_components/`. Fallback: `page.url contains "/components/"`. Decide during implementation by inspecting one rendered component page's debug output.
- `sort_natural` on an array of Liquid drops is supported in Jekyll's Liquid; if it fails, fall back to `sort: "title"`.

## Checkpoint — after T1

Before moving on (there is no T2; this is the only task), present diff for human review. Do not commit. After human acks visual verification, work is complete.

## Out of scope (per SPEC)

- No JS for the reverse lookup.
- No new data files, build scripts, or image regeneration.
- No changes to `_recipes/`, `_components/`, tag registry, or the Suggestions grid.
