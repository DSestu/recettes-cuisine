---
name: implement-recipe-from-image
description: Drive the remote ComfyUI workflows for recipe work: split a raw cookbook-page photo into per-recipe text/dish crops (auto-detection, no manual screenshots), OCR a recipe photo, restore a degraded dish photo (single image or every image in a folder), and/or generate a fresh dish image from a prompt-gallery file. Always invokes `split.py`/`run.py`; never commits.
---

# implement-recipe-from-image

## Raw page photos: the split stage (run FIRST when there is no `_text` sibling)

The trigger phrases below stay unchanged. What decides the path is mechanical:

- `--image` has a `<stem>_text.<ext>` sibling → **pre-cropped pair**, go straight to the modes table below (legacy manual-screenshot flow, unchanged).
- No `_text` sibling → the image is a **raw book-page photo**. Run the split stage first:

```bash
uv run python .claude/skills/implement-recipe-from-image/split.py --image <raw_photo> [--dry-run]
```

`split.py` detects every recipe on the page (Qwen3-VL grounding via the `SDXL_recettes_cuisine_split` workflow), auto-corrects page orientation (90°-rotated phone shots are common), and cuts **full-resolution** crops named to the existing convention: `<stem>_rN.png` (dish, squared) + `<stem>_rN_text.png` (text). Last stdout line is JSON:

- `recipes[]` — one entry per detected recipe: `title`, `photo` (null if the recipe has no dish photo), `text`, `index`.
- `overlay` — annotated debug image (bounding boxes drawn on the oriented page).
- `review_flag` — true when orientation arbitration was close (top-2 healths within 15%). **Show the overlay to the user before continuing when this is set.**
- Zero recipes (chapter dividers, non-recipe pages) → report and stop; nothing to implement.

Then loop over `recipes[]`:

- `photo` present → `run.py --mode full --image <photo>` (the `_text` sibling is auto-detected), then the normal full post-pipeline below.
- `photo` null → `run.py --mode ocr --image <text>` for the text, scaffold the recipe, create the prompt gallery, then `--mode prompt --slug <slug>` for the image (standard generation).

### Archive contract (after each recipe succeeds and the slug is known)

Everything is renamed to the slug and kept under `to_implement/processed/` (tracked in git — this is the audit trail; the raw source is removed so only processed material remains):

| Artifact | Destination |
|---|---|
| Source page photo | `to_implement/processed/originals/<slug>.<ext>` (multi-recipe page: one **copy per slug**, then delete the raw source) |
| Debug overlay | `to_implement/processed/debug/<slug>_boxes.jpg` |
| Dish crop (exact restore input) | `to_implement/processed/crops/<slug>.png` |
| Text crop (exact OCR input) | `to_implement/processed/crops/<slug>_text.png` |

These four debug artifacts are mandatory — they exist so the user can audit any recipe and redo it from the archived crops (which still follow the `_text` convention, so `run.py` accepts them directly).

Tuning constants (padding, aspect guard, orientation thresholds) live at the top of `split.py` with benchmark provenance. The detection prompt lives inside the workflow JSON on the server — never hardcode it here. Use `Qwen3-VL-4B-Instruct-FP8` in that workflow; FP16 variants are ~13× slower on this machine (measured).

## Modes (which to use when)

`run.py` exposes four `--mode` values. The user's wording maps to a mode — pick the one that fits and call `run.py` accordingly. Never hardcode behaviour: always go through `run.py`, which fetches the workflow live from the ComfyUI server defined in `config.json`.

| User intent (FR/EN) | Mode | Inputs | Outputs | Typical follow-up |
|---|---|---|---|---|
| "implement this recipe from image", "implémente cette recette depuis l'image" | `full` | `--image <path>` (auto-detects `<stem>_text.<ext>` sibling) | `ocr_text` + restored dish image | Create `_recipes/<slug>.md`, place image, generate thumbnail, write prompt gallery |
| "OCR this image", "extrais le texte de cette image" | `ocr` | `--image <path>` (same `_text` sibling rule) | `ocr_text` only | Hand the text back to the user; no recipe scaffolding |
| "restore this photo", "restaure cette photo", "régénère l'image de la recette `<slug>`" | `image` | `--slug <slug>` (resolves `images/<slug>.{png,jpg,jpeg,webp}`) | restored image | Replace `images/<slug>.png` after user review |
| "generate the image from the prompt", "génère l'image depuis le prompt" | `prompt` | `--slug <slug>` (reads `prompts/_recipes/<slug>.md`) | generated image | Replace `images/<slug>.png` |

### Folder-of-photos restoration (iterative `image` mode)

When the user asks to restore **every photo in a directory** (e.g. raw cooking-step photos that aren't linked to a slug), loop `--mode image` over the files. The current `image` mode only accepts `--slug`; for ad-hoc folders, work around it by either:

1. Temporarily moving each photo to `images/<temp_slug>.<ext>`, running `--mode image --slug <temp_slug>`, then moving the result back next to the original (rename to `<original>_restored.<ext>`), and reverting the temp file. Verbose but uses the skill unchanged.
2. Or, if the user explicitly asks to extend the skill, add an `--image <path>` alternative to `--mode image` (skip `_resolve_recipe_image`). Do this only on explicit instruction.

In either case: keep originals in a `raw/` subfolder, write restored versions to a sibling `restored/` subfolder. Don't overwrite originals.

## Trigger phrases (for routing intent → mode)

Don't gate on exact wording — these are hints, not contracts.

- **`full`** — "implémente cette recette depuis l'image", "implement this recipe from image", "implémente cette recette à partir de l'image", "create a recipe from this photo".
- **`ocr`** — "OCR cette image", "extrais le texte", "lis cette recette", "just give me the text".
- **`image`** — "restaure cette photo", "restore this photo", "régénère l'image de la recette X", "améliore la photo de X", "redo the image for X".
- **`prompt`** — "génère l'image depuis le prompt", "regenerate from the prompt gallery", "text-to-image for X".

## Two-image OCR (`full` and `ocr`)

If a sibling named `<stem>_text.<ext>` exists next to `--image`, `run.py` routes the `_text` variant to the OCR loader and the original to the restoration loader. This is auto-detected via `find_text_sibling`; no flag.

## Invocation

```bash
uv run python .claude/skills/implement-recipe-from-image/run.py --mode <full|ocr|image|prompt> [--image <path>] [--slug <slug>]
```

- `--config <path>` overrides `config.json`.
- `--dry-run` patches the workflow but doesn't queue — useful for verifying node IDs.
- `--print-workflow --mode <m>` dumps the workflow JSON for inspection.
- `--ping` checks the server.
- `--upload <path>` uploads only, prints the server-side filename.

All progress logs go to stderr. The last line of stdout is JSON. Shape depends on mode:

- `full` → `{"ocr_text": "...", "image_temp_path": "/abs/.tmp/comfyui/<id>.png", "ocr_prompt_id": "...", "image_prompt_id": "...", "prompt_id": "..."}` (`full` runs the OCR and restoration workflows as two separate prompts; `prompt_id` aliases `image_prompt_id` for back-compat)
- `ocr` → `{"ocr_text": "...", "prompt_id": "..."}`
- `image` / `prompt` → `{"image_temp_path": "...", "prompt_id": "..."}`

Note: `image_temp_path` always points at a ComfyUI PNG. The skill agent **must re-encode it to WebP** (Pillow, q90, `method=6`) before moving it to `images/<slug>.webp`. The site is WebP-only — committing a `.png` under `images/` is rejected by pre-commit.

If `run.py` exits non-zero, surface stderr and stop. Common causes: ComfyUI unreachable, workflow not in API format, missing node IDs, vision LM returned empty text.

## Post-pipeline contract for `full`

Only `full` produces a complete recipe. After `run.py` succeeds:

1. **Apply autoloaded rules** to the OCR text: `format-pasted-recipe.md`, `home-categories.md`, `update-recipe-prompt-gallery.md`. Determine canonical French title → snake_case ASCII slug. Normalise tags against `_data/recipe_tags.yml`. Append new canonical tags to a clearly matching homepage category (never reorder, never touch `others`). Create `prompts/_recipes/<slug>.md`.
2. **Overwrite check** — stop and ask if any of these exist: `_recipes/<slug>.md`, `images/<slug>.webp`, `prompts/_recipes/<slug>.md`. (The `images/cards/<slug>.webp`, `images/hero/<slug>.webp`, and `images/full/<slug>.webp` derivatives are regenerated automatically by pre-commit hooks; only flag a clash as a slug clash.)
3. **Write the recipe** at `_recipes/<slug>.md` with frontmatter (`layout: recipe`, quoted `title`, `image: <slug>` — **bare slug, no extension**, `date: <today's date, YYYY-MM-DD>`, `tags:`, `ingredients:`) and Markdown body under `## Préparation`.
4. **Re-encode + place the image**: open `image_temp_path` (the ComfyUI PNG) with Pillow, save as WebP at `images/<slug>.webp` (q90, `method=6`). Do NOT keep the PNG.
5. **Derivatives**: `pre-commit run --files images/<slug>.webp` (or run `scripts/generate_card_thumbnails.py`, `scripts/generate_hero_images.py`, `scripts/generate_full_images.py`). These produce `images/{cards,hero,full}/<slug>.webp`.
6. **Summarise**: slug + paths (recipe, source webp, 3 derivatives, prompt). Remind the user to review and commit.

## Post-pipeline contract for `ocr`

Print the extracted text. Do not scaffold a recipe unless the user asks.

## Post-pipeline contract for `image` / `prompt`

The restored/generated image is at `image_temp_path` (PNG, in `.tmp/comfyui/`). To replace the existing recipe image, re-encode to WebP at `images/<slug>.webp` (q90, `method=6`) — only if the user has confirmed (overwrites the existing source). Derivatives auto-regenerate via pre-commit. For folder-of-photos iteration, write to a `restored/` sibling — re-encode each to WebP; never touch the original.

## Hard boundaries

- **Never run `git add`, `git commit`, or `git push`.** The user reviews and commits.
- **Never overwrite** `_recipes/<slug>.md`, `images/<slug>.png`, or `prompts/_recipes/<slug>.md` without explicit confirmation.
- **Never modify** the workflow JSON on the ComfyUI server. Don't cache it locally either; `run.py` fetches it fresh each time.
- **Never invent** node IDs or paths if `run.py` fails — surface the error.
- **Never skip** the canonical tag-registry / homepage-category rules for `full`; always go through `format-pasted-recipe.md` and `home-categories.md`.

## Configuration

`config.json` holds: ComfyUI host and a `modes` map. The `split` entry carries the split workflow's userdata path plus its `loader_id` and `text_output_id`. The `ocr`, `image`, and `prompt` modes each have their own `workflow` path on `/userdata/` and the node IDs it needs (loader IDs, text-output ID, preview-image ID, prompt-text ID + field). The `full` mode is different: instead of a single combined workflow it carries two sub-objects, `full.ocr` and `full.restore`, each shaped like the standalone `ocr` and `image` entries (their own `workflow` + node IDs). `run_full` runs those two workflows as separate prompts and merges the results. Edit these if any of them change — do not hardcode in `run.py`.

## Troubleshooting

- **`ComfyUI unreachable`** — check Tailscale / that the host in `config.json` is up.
- **`workflow is missing required node IDs`** — the file on the server is probably saved in UI format. Re-export with Dev Mode → Export (API), save to the same userdata path (or update `config.json`).
- **`vision LM returned no text`** — the photo is unreadable or the text-output node id is wrong. Try a sharper photo first; if it persists, run `--print-workflow --mode <m>` and check which node is feeding the text output.
- **Empty `images/<slug>.png` after move** — preview images live in ComfyUI's `temp/` folder and may be cleaned aggressively. `run.py` fetches them immediately; if you delay too long the bytes are already in `.tmp/comfyui/` — that's the actual source of truth.
- **`config has no entry for modes.<m>`** — `config.json` predates the multi-mode refactor. Migrate it to the `modes: { full: {...}, ocr: {...}, image: {...}, prompt: {...} }` shape.
