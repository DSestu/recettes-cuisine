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

- **Frontmatter (YAML):** `layout: recipe`, `title: "Titre"` (quoted, proper accents), `image: slug` (**bare slug, no extension** — the site is WebP-only and the layout appends `.webp`). Then `tags:`, `ingredients:` as lists. Optional `components:` (component titles).
- **Directions live in two possible places** — Markdown body is preferred; legacy YAML list in frontmatter is still supported.
- **After `---`:** Optional short description ("Pour X personnes", "Temps de préparation : …"). When using Markdown directions, add a level-2 heading (`## Préparation`) and write full Markdown (paragraphs, bullets, images, tables, sublists).

## Directions: Markdown (preferred) vs list (legacy)

**Preferred — Markdown body.** Omit `directions:` from frontmatter. Body: optional description, then `## Préparation`, then steps as bullet points (`-`, NOT numbered). No blank lines between adjacent bullets. Full Markdown allowed: `:`, **bold**, *italic*, `code`, links, inline images, tables, sublists.

**Legacy — YAML list.** `directions:` in frontmatter as a list. Each item is one step, **no `:` in steps**, keep simple. Use only when no images/tables/sublists are needed.

Components support both forms; prefer body Markdown when content is rich.

**Images in body Markdown:**
- Plain: `![alt](../images/<recipe_slug>/<step>.webp)` — centered, bordered, small (1000 px); the lens-button zoom swaps the URL to `<step>.full.webp` (2400 px) for the fullscreen overlay. Encode each inline image as `<step>.full.webp` once (q88, 2400 w) and let `scripts/generate_inline_small.py` build the small variant.
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

## Condiment detection (ask before split)

Before scaffolding, scan the source (OCR text, pasted text, etc.) for sub-preparations that look like a reusable condiment and ask the user whether to split each one into a `_components/` file.

**Trigger heuristics** — flag a sub-preparation when **any** of these holds:

- **Keyword in a subsection title or paragraph start** (FR/EN): `sauce`, `marinade`, `vinaigrette`, `coulis`, `pesto`, `chutney`, `mayonnaise`, `aïoli`, `beurre composé`, `glaçage`, `glaze`, `pickles`, `gomasio`, `tare`, `dashi`, `bouillon`, `fond`, `crème anglaise`, `crème pâtissière`, `caramel`, `sirop`.
- **Structural** — the sub-preparation has its own ingredient list and its own steps, distinct from the main dish flow.
- **Reusability** — the preparation could plausibly be used in another dish (soy-mirin sauce: yes; gratin-specific roux: no).

**Exclusions** (do not flag): one-off seasoning blends tied to this dish only, finishing touches without a proper name, mixes that read as a single step rather than a sub-recipe.

**Ask-before-split protocol:**

1. List **all** candidates in one numbered question to the user — no ping-pong. For each: name, why it triggered (keyword / structure / reusability), and the proposed split filename. Example: *« J'ai détecté : (1) "Sauce aromatique pour karaage" — sous-section avec ingrédients propres, réutilisable → `_components/sauce_aromatique_karaage.md` ; (2) "Marinade" — listée à part → `_components/marinade_karaage.md`. Splitter lesquelles ? »*
2. **If split** → create `_components/<snake>.md` with its own ingredients/steps, add tag `condiment` (plus any other applicable tags), reference from the parent via `components: - <Exact Title>`, and replace the inline block in the parent with a short prose pointer (« Préparer la *Sauce aromatique pour karaage* — voir composant »). Also create `prompts/_components/<snake>.md` per `update-recipe-prompt-gallery.md`.
3. **If kept inline** → leave as-is in the parent recipe, do not add `condiment` anywhere.
4. **If user is ambiguous or silent** → keep inline; never split without explicit confirmation.

**Image policy for split condiments:** if the source has a dedicated photo for the condiment, scaffold it like any recipe (`image: <slug>` bare, WebP derivatives). Otherwise, after writing `prompts/_components/<snake>.md` per `update-recipe-prompt-gallery.md`, generate a fresh image via the ComfyUI prompt workflow without asking the user (`uv run python .claude/skills/implement-recipe-from-image/run.py --mode prompt --slug <snake>` — the skill resolves prompts from both `prompts/_recipes/` and `prompts/_components/`). Then re-encode the resulting `.tmp/comfyui/<id>.png` to `images/<snake>.webp` (Pillow, q90, `method=6`), regenerate the card/hero/full derivatives, and set `image: <snake>` in the component frontmatter. No confirmation needed for image generation when the split component lacks a source photo.

## French spelling

Correct only French spelling (e.g. "Céléri" → "Céleri", "souce" → "sauce"). Never change quantities, cooking steps, or intent.

## Canonical example (preferred — Markdown body directions)

```yaml
---
layout: recipe
title: "Velouté d'asperges"
image: veloute_asperges

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
