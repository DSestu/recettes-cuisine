---
description: Keep homepage categories in home_categories.md aligned with canonical tags in _data/recipe_tags.yml whenever editing recipes/components or the categories file; support an explicit cold run.
globs:
  - _recipes/**/*.md
  - _components/**/*.md
  - home_categories.md
  - _data/recipe_tags.yml
---

# Homepage categories and tag sync (autoloaded)

**When this applies:** You create/edit a recipe in `_recipes/` or a component in `_components/`, or edit `home_categories.md`, or the user asks for "mettre à jour les catégories d'accueil" / "synchroniser les catégories" / a **cold run** on categories.

Complements `format-pasted-recipe.md` and reuses the same tag normalisation rules. Only touches the tag registry (`_data/recipe_tags.yml`) and the homepage category catalogue (`home_categories.md` frontmatter `categories:`).

## Files involved

- **Tag registry** `_data/recipe_tags.yml` — list of `{ id, ingredient }` objects. `id` is the canonical tag string used everywhere (recipes, components, category `tags:`).
- **Homepage categories** `home_categories.md` — frontmatter `categories:` is the ordered list of homepage groupings:

  ```yaml
  ---
  layout: null
  categories:
    - id: "soups"
      label: "Soupes & veloutés"
      description: "Toutes les soupes, potages et veloutés."
      tags:
        - soupe
        - potage
        - veloute
    # ...
    - id: "others"
      label: "Autres"
      description: "Recettes qui ne rentrent dans aucune catégorie ci-dessus."
      mode: "other"
      tags: []
  ---
  ```

  - **Order in `categories:` = display order on homepage.** Do not reorder unless asked.
  - Each category's `tags:` must contain canonical `id`s from `_data/recipe_tags.yml`.
  - The `others` category with `mode: "other"` is a UI filter flag — its `tags:` stays empty.

## Principles

- **Single source of truth:** registry defines allowed tag strings; `home_categories.md` defines how tags group on the homepage.
- **No surprise categories:** never create / delete / rename / reorder categories unless the user explicitly asks. By default, only adjust `tags:` arrays inside existing categories.
- **Respect recipe content:** do not change quantities, directions, or intent — only `tags:` and category metadata.

## Tag normalisation (shared with format-pasted-recipe)

When reading/writing tags in `_recipes/`, `_components/`, `_data/recipe_tags.yml`, or `home_categories.md`:

1. Normalise for matching: trim, lowercase, fold accents/ligatures (`œufs`↔`oeufs`, `crème`↔`creme`, `gâteau`↔`gateau`), treat sing/plur as the same concept (`tomate`↔`tomates`, `oignon`↔`oignons`, `poisson`↔`poissons`).
2. On write, use the registry's canonical `id` everywhere (recipe `tags:`, category `tags:`).
3. If no registry entry matches, add `{ id: new_tag, ingredient: true|false }` (ASCII, one form per concept) and use that `id`. Don't change `ingredient` of existing entries during category sync.
4. Never keep accented + ASCII or singular + plural variants of the same concept.

## Mapping tags to categories

When you touch a recipe/component's `tags:`, decide whether any tag should also be attached to a homepage category.

### 1. Already covered
If the canonical tag already appears in some category's `tags:`, do nothing.

### 2. Candidate tags ("close and related")
If the tag does **not** appear in any category, look for a semantically related category:
- **Ingredient family / lexical root:** `saumon`, `maquereau`, `poisson` → fish/main-dish category; `tiramisu`, `gateau`, `creme` → desserts.
- **Type of dish:** `soupe`, `potage`, `veloute` → "Soupes & veloutés"; `plat`, `plat principal`, `repas` → main dish.
- **Origin / cuisine:** `japon`, `asiatique`, `ramen`, `yakitori` → "Japon".

If exactly one clearly best category: append the tag once to its `tags:`. If several plausible or no clear match: leave uncategorised — the recipe will fall through to "Autres".

**Never** add tags to the `others` category.

### 3. Insertion order
Preserve existing tag order. Append the new tag at the end of the category's `tags:`, unless an obvious nearby sibling (same base word) makes grouping more readable.

## Checklist when editing/creating a recipe or component

After applying `format-pasted-recipe.md`:

1. Ensure the file's `tags:` only contains canonical registry `id`s (add new entries to the registry if needed).
2. Open `home_categories.md`. Do not reorder categories, do not change `id`/`label` without an explicit ask.
3. For each canonical tag on the file: if absent from every category and a single category clearly fits, append it there once.
4. Do not edit the `others` category — its `mode: "other"` is computed in JS from absence in other categories.
5. Save with minimal diffs: keep comments and body text below `---` intact; only modify the relevant `tags:` arrays.

## Cold run on categories and tags

On explicit user request only ("fais un cold run des catégories", "synchronise les catégories avec toutes les recettes"):

**Step 1 — Preparation.** Read `_data/recipe_tags.yml` (create empty list if missing — preserve `ingredient` for existing entries). Read `home_categories.md` frontmatter. Enumerate every `.md` under `_recipes/` and `_components/`.

**Step 2 — Canonicalize per file.** Parse frontmatter, read `tags:`, normalise+canonicalise against registry (adding new `{ id, ingredient }` entries as needed, default `ingredient: true` when uncertain), and rewrite the file's `tags:` block with canonical `id`s.

**Step 3 — Extend category tag lists.** For each category except `mode: "other"`: treat existing `tags:` as a manual seed (preserve). For each canonical tag observed: if it already appears in some category, skip. Otherwise, if exactly one category clearly fits, append it. Otherwise leave it uncategorised. Each tag appears at most once per category. Don't remove tags unless the user asks. Don't create new categories.

**Step 4 — Write back.** Update `_data/recipe_tags.yml` (dedup, preserve `ingredient` for existing). Update `home_categories.md` `categories:` `tags:` lists. Keep original category order; keep comments and body below `---` intact.

**Step 5 — Report.** Summarise: how many new tags added to the registry; per category, how many tags added (and which) — so the user can request adjustments.
