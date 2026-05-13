---
description: Format pasted raw recipes / edits in _recipes or _components — fix French spelling, normalize tags against the registry, prefer body Markdown directions; never change quantities, steps, or intent.
globs:
  - _recipes/**/*.md
  - _components/**/*.md
  - _data/recipe_tags.yml
---

# Format pasted raw recipes (autoloaded)

**When this applies:** User pastes a raw recipe and asks to format it, or you create/edit a file in `_recipes/` or `_components/`.

**Hard rule:** Do not change recipe content (quantities, steps, intent). Only structure, spelling, and conventions. All user-visible text stays in French.

## Recipe structure

- **Frontmatter (YAML):** `layout: recipe`, `title: "Titre"` (quoted, proper accents), `image: slug.png` (filename only, default extension `.png`). Then `tags:`, `ingredients:` as lists. Optional `components:` (component titles).
- **Directions live in two possible places** — Markdown body is preferred; legacy YAML list in frontmatter is still supported.
- **After `---`:** Optional short description ("Pour X personnes", "Temps de préparation : …"). When using Markdown directions, add a level-2 heading (`## Préparation`) and write full Markdown (paragraphs, bullets, images, tables, sublists).

## Directions: Markdown (preferred) vs list (legacy)

**Preferred — Markdown body.** Omit `directions:` from frontmatter. Body: optional description, then `## Préparation`, then steps as bullet points (`-`, NOT numbered). No blank lines between adjacent bullets. Full Markdown allowed: `:`, **bold**, *italic*, `code`, links, inline images, tables, sublists.

**Legacy — YAML list.** `directions:` in frontmatter as a list. Each item is one step, **no `:` in steps**, keep simple. Use only when no images/tables/sublists are needed.

Components support both forms; prefer body Markdown when content is rich.

**Images in body Markdown:**
- Plain: `![alt](images/photo.png)` — centered, bordered, small, lens-button zooms to fullscreen.
- Sized via Kramdown IAL: `![alt](url){: width="300px" data-aspect-ratio="16/9" }`.
- Captioned: `<figure class="recipe-inline-image"><figcaption>Caption.</figcaption><img src="..." alt="..."></figure>`.

## Tag management

Canonical registry: `_data/recipe_tags.yml` — a list of `{ id, ingredient }` objects.
- `id` = canonical tag string (ASCII, e.g. `oeufs`, `creme`, `gateau`).
- `ingredient: true` = physical ingredient (shopping list); `false` = dish type / cuisine / method / source / difficulty. Default `true` when uncertain.

**Spelling rule:** ASCII canonical only — `oeufs` not `œufs`, `creme` not `crème`, `huitre` not `huître`, `gateau` not `gâteau`.

**One form per concept:** never both singular and plural for the same idea (`oeufs` only; `oignon` xor `oignons`; etc.). Match accent/ligature variants and singular/plural as the same tag.

**Workflow when touching tags in a recipe/component:**
1. Read `_data/recipe_tags.yml`. For each tag being written: normalize (trim, lowercase, fold accents, match sing/plur), find the matching `id`, use that exact `id` in the file.
2. If no match: add a new entry `{ id: new_tag, ingredient: true|false }` to the registry, then use that `id` in the file. No near-duplicates.
3. When editing, replace any variant tag in the file with the canonical `id` from the registry.

**Cold pass** (on explicit user request: "normalise tous les tags", "fais un cold run"):
- Walk every `.md` under `_recipes/` and `_components/`, canonicalize tag lists against `_data/recipe_tags.yml`, add new entries for genuinely new tags, rewrite `tags:` blocks with canonical `id`s, write back the registry preserving existing `ingredient` values.

## Components (sub-recipes)

If the recipe references a sub-recipe (sauce, bouillon, etc.): create `_components/<snake_case>.md` with the same frontmatter/body format. List in the main recipe via `components:` using **exact titles** (e.g. `- Dashi`, `- Sauce aromatique pour Karaage`). Component filenames are snake_case from the title.

## French spelling

Correct only French spelling (e.g. "Céléri" → "Céleri", "souce" → "sauce"). Never change quantities, cooking steps, or intent.

## Canonical example (preferred — Markdown body directions)

```yaml
---
layout: recipe
title: "Velouté d'asperges"
image: veloute_asperges.png

tags:
- repas
- soupe
- asperges
- creme
- chaud

ingredients:
- 600 g d'asperges vertes
- 1 oignon moyen
---
```

Pour 4 personnes. Temps de préparation : 15 min. Temps de cuisson : 20 min.

## Préparation

- Éplucher les asperges et les laver.
- Couper les pointes en lamelles.
- Faire bouillir 1 litre d'eau salée, ajouter les asperges et laisser cuire 15 à 20 minutes.
- Mixer, ajouter un peu de crème si besoin, saler et poivrer.
