# SPEC — `implement-recipe-from-image` skill

## 1. Objective

A project-local Claude Code skill that, given a local photo of a recipe (cookbook page, handwritten card, screenshot, etc.), automates the full pipeline:

1. Sends the photo to a remote ComfyUI instance which both **OCRs the recipe text** (via a vision LM) and **regenerates a clean food photograph** of the dish.
2. Hands the OCR'd text to the existing `format-pasted-recipe` rules so a new `_recipes/<slug>.md` is created.
3. Saves the regenerated image as `images/<slug>.png`, matching the recipe's `image:` field.
4. Stops short of `git add` / `git commit`. The user reviews and commits manually.

**Audience:** the repo maintainer (single user, French recipes).

## 2. Commands / triggers

Skill activates on any of:

- `implemente this recipe from image <path>`
- `implement this recipe from image <path>`
- `implémente cette recette depuis l'image <chemin>`
- `implémente cette recette à partir de l'image <chemin>`

`<path>` is an absolute or `~`-expanded path to a local image file (`.jpg`, `.jpeg`, `.png`, `.webp`).

## 3. Project structure

```
.claude/skills/implement-recipe-from-image/
├── SKILL.md          # trigger phrases + usage contract
├── SPEC.md           # this file
├── config.json       # host, node IDs, workflow path
└── run.py            # Python entrypoint
```

`config.json`:

```json
{
  "host": "desktop-tvtdome:8188",
  "workflow_userdata_path": "workflows/SDXL_recettes_cuisine.json",
  "loader_ocr_id": "1933",
  "loader_restore_id": "2001",
  "text_output_id": "2003",
  "preview_image_id": "465",
  "preview_image_type": "temp"
}
```

## 4. Runtime flow (`run.py`)

1. Resolve & validate `<path>`; reject non-image or missing file.
2. **Detect `_text` sibling.** If a file named `<stem>_text.<jpg|jpeg|png|webp>` exists in the same directory as `<path>`, treat it as the OCR input. Otherwise the same image goes to both loaders.
3. `POST http://<host>/upload/image` (multipart) → `{name, subfolder, type}`. Upload both files when a sibling exists.
4. `GET http://<host>/userdata/<workflow_userdata_path>` → workflow dict (path is percent-encoded as a single segment).
5. Patch `workflow[loader_ocr_id].inputs.image` ← OCR upload name; `workflow[loader_restore_id].inputs.image` ← original upload name.
6. `POST /prompt` with `{prompt, client_id}` → `prompt_id`.
7. Subscribe to `ws://<host>/ws?clientId=<id>`; wait for `executing` with `node: null` and matching `prompt_id` (= completion). Fallback: poll `/history/{prompt_id}`.
8. From `history[prompt_id].outputs`:
   - `outputs[text_output_id]` → extracted recipe text (string).
   - `outputs[preview_image_id].images[0]` → `{filename, subfolder, type}`.
9. `GET /view?...&type=<preview_image_type>` → image bytes; stash in a temp file.
10. Invoke the agent's `format-pasted-recipe` workflow on the OCR text, producing `_recipes/<slug>.md`. Capture the slug.
11. If `images/<slug>.png` or `_recipes/<slug>.md` already exists → **stop and ask the user before overwriting**.
12. Move temp image to `images/<slug>.png` (re-encode to PNG if source is JPEG).
13. Print a summary: slug, paths, "review and commit when ready".

## 5. Code style

- Python 3.11+, stdlib + `requests` and `websocket-client` (pin lightly).
- Single file, ≤300 lines. Small named functions: `upload_image`, `fetch_workflow`, `queue_prompt`, `wait_for_completion`, `fetch_outputs`, `save_image`.
- Type hints on all public functions. No classes unless they pay rent.
- Fail loudly on any non-2xx HTTP response. No silent retries on failure (one retry on websocket disconnect is OK).
- No comments narrating what the code does; reserve comments for non-obvious *why*.

## 6. Testing strategy

- **`--dry-run` flag:** upload skipped, workflow fetched and patched, patched JSON pretty-printed to stdout, no `/prompt` POST.
- **Manual integration:** run against the real ComfyUI on `desktop-tvtdome:8188` with a known input image; verify `_recipes/<slug>.md` and `images/<slug>.png` land correctly and no commit happens.
- No unit-test suite — too much HTTP scaffolding for a single-user tool. Smoke test in CI is out of scope (the ComfyUI host isn't reachable from CI).

## 7. Boundaries

**Always:**

- Fetch the workflow fresh from `/userdata` each run (never cache locally).
- Use the canonical title → slug rules from `format-pasted-recipe.md` for filenames.
- Print the final paths so the user can review before committing.

**Ask first:**

- If `_recipes/<slug>.md` exists.
- If `images/<slug>.png` exists.
- If ComfyUI host is unreachable, surface the error and stop — don't fall back silently.
- If the `text_output_id` returns empty or whitespace.

**Never:**

- Run `git add`, `git commit`, or `git push`.
- Modify the workflow JSON on the ComfyUI server.
- Touch recipes or images outside the freshly-determined `<slug>`.
- Skip the canonical tag-registry rules from `format-pasted-recipe` and `home-categories`.
- Use placeholder values for unknown node IDs — fail with a clear message instead.
