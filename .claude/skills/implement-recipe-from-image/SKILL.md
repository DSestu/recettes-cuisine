---
name: implement-recipe-from-image
description: Take a local photo of a recipe (cookbook page, handwritten card, screenshot…), run it through the remote ComfyUI workflow that OCRs the recipe text and regenerates a clean food photograph, then create `_recipes/<slug>.md` and save the image as `images/<slug>.png` using the canonical project rules. Never commits.
---

# implement-recipe-from-image

## When this skill triggers

Any of the following phrases, with a path to a local image at the end:

- `implemente this recipe from image <path>`
- `implement this recipe from image <path>`
- `implémente cette recette depuis l'image <chemin>`
- `implémente cette recette à partir de l'image <chemin>`

`<path>` is an absolute or `~`-expanded path to `.jpg / .jpeg / .png / .webp`.

**Two-image mode (auto-detected).** If a sibling file named `<stem>_text.<ext>` exists in the same directory as `<path>` (any image extension), `run.py` will route the `_text` variant to the OCR loader (node 1933) and the original to the restoration loader (node 2001). Useful when the readable recipe text and the dish reference are two different photos. No flag needed — it's purely based on the filename.

## What you do (agent contract)

1. **Run the pipeline.** Execute:

   ```bash
   uv run python .claude/skills/implement-recipe-from-image/run.py --image <path>
   ```

   - All progress logs go to stderr; ignore them.
   - The **last line of stdout** is a single-line JSON:

     ```json
     {"ocr_text": "...full extracted recipe text...", "image_temp_path": "/abs/path/.tmp/comfyui/<prompt_id>.png", "prompt_id": "..."}
     ```

   - If the script exits non-zero, surface the stderr message to the user and stop. Common causes: ComfyUI host unreachable, workflow not in API format (missing node IDs), vision LM returned empty text.

2. **Apply the autoloaded project rules to the OCR text.** Use `format-pasted-recipe.md`, `home-categories.md`, and `update-recipe-prompt-gallery.md` exactly as you would for a pasted recipe:
   - Determine the canonical French title and derive the snake_case ASCII slug.
   - Normalise tags against `_data/recipe_tags.yml` (add new canonical entries if needed).
   - If any homepage category clearly fits a new canonical tag, append it (never reorder categories, never touch `others`).
   - Create the prompt-gallery file under `prompts/_recipes/<slug>.md`.

3. **Overwrite check.** Before writing anything, check:
   - `_recipes/<slug>.md` — exists?
   - `images/<slug>.png` — exists?
   - `images/cards/<slug>.png` — exists?
   - `prompts/_recipes/<slug>.md` — exists?

   If any exists, **stop and ask the user** before continuing. Show which files would be overwritten. (The thumbnail under `images/cards/` will be regenerated automatically in step 6 — only flag it if its mere presence indicates a slug clash.)

4. **Write the recipe.** Create `_recipes/<slug>.md` with the standard frontmatter (`layout: recipe`, quoted `title`, `image: <slug>.png`, `tags:`, `ingredients:`) and Markdown-body directions under `## Préparation` (preferred format).

5. **Place the image.** Move (don't copy) the file at `image_temp_path` to `images/<slug>.png`. If the source is JPEG, prefer re-encoding to PNG to match the `.png` extension; otherwise a simple rename is fine.

6. **Generate the card thumbnail.** Run:

   ```bash
   uv run python scripts/generate_card_thumbnails.py
   ```

   This mirrors what the `generate-card-thumbnails` pre-commit hook does. The script is idempotent and writes `images/cards/<slug>.<ext>` at max 480 px width. Doing it here means the user's `git commit` won't be interrupted later by the hook discovering a missing thumbnail.

7. **Summarise.** Print the slug, the four created/updated paths (recipe, image, thumbnail, prompt), and remind the user to review and commit manually.

## Hard boundaries

- **Never run `git add`, `git commit`, or `git push`.** The user reviews and commits.
- **Never overwrite** `_recipes/<slug>.md`, `images/<slug>.png`, or `prompts/_recipes/<slug>.md` without explicit confirmation.
- **Never modify** the workflow JSON on the ComfyUI server. Don't cache it locally either; `run.py` fetches it fresh each time.
- **Never invent** node IDs or paths if `run.py` fails — surface the error.
- **Never skip** the canonical tag-registry / homepage-category rules; always go through `format-pasted-recipe.md` and `home-categories.md`.

## Configuration

`config.json` holds: ComfyUI host, workflow path on `/userdata/`, four node IDs (two `LoadImage`, one text-output, one `PreviewImage`). Edit there if any of those change — do not hardcode in `run.py`.

## Troubleshooting

- **`ComfyUI unreachable`** — check Tailscale / that `desktop-tvtdome:8188` is up.
- **`workflow is missing required node IDs`** — the file at `/userdata/workflows/SDXL_recettes_cuisine.json` is probably saved in UI-format, not API-format. Re-export with Dev Mode → Export (API).
- **`vision LM returned no text`** — the photo is unreadable or the text-output node id is wrong. Try a sharper photo first; if it persists, run `--print-workflow` and check which node is feeding the text output.
- **Empty `images/<slug>.png` after move** — preview images live in ComfyUI's `temp/` folder and may be cleaned aggressively. `run.py` fetches them immediately; if you delay the agent step too long, the bytes may already be on disk in `.tmp/comfyui/` — that's the actual source of truth.
