# SPEC — Variations of `implement-recipe-from-image`

## 1. Objective

Split the existing `implement-recipe-from-image` skill into a family of skills that share the same remote ComfyUI plumbing (`run.py`) but expose three additional modes alongside the current full pipeline. All modes feed the canonical recipe-creation flow (frontmatter + body via `format-pasted-recipe.md`, tag registry, homepage categories, prompt-gallery, card thumbnail).

Modes:

| Mode | Skill name | Input | Produces | Recipe md? | Image? |
|------|------------|-------|----------|------------|--------|
| `full` *(existing)* | `implement-recipe-from-image` | photo of recipe | OCR text + dish image | yes | yes |
| `ocr` | `implement-recipe-from-image-ocr-only` | photo of recipe | OCR text only | yes (no `image:` line) | no |
| `image` | `regenerate-recipe-image` | existing slug | dish image only | no (recipe already exists) | yes (overwrites) |
| `prompt` | `generate-recipe-image-from-prompt` | existing slug | dish image only, from `prompts/_recipes/<slug>.md` | no | yes (overwrites) |

## 2. Commands

All modes go through a single entrypoint:

```bash
uv run python .claude/skills/implement-recipe-from-image/run.py --mode {full,ocr,image,prompt} [options]
```

Mode-specific options:

- `--mode full --image <path>` — current behavior. Stdout JSON: `{"ocr_text", "image_temp_path", "prompt_id"}`.
- `--mode ocr --image <path>` — OCR only; no image generation. Stdout JSON: `{"ocr_text", "prompt_id"}`.
- `--mode image --slug <slug>` — read `_recipes/<slug>.md` body + ingredients, feed the ComfyUI image branch (no OCR). Stdout JSON: `{"image_temp_path", "prompt_id"}`.
- `--mode prompt --slug <slug>` — read `prompts/_recipes/<slug>.md`, feed it verbatim into the image branch. Stdout JSON: `{"image_temp_path", "prompt_id"}`.

**Each mode calls a different workflow** on the ComfyUI server. `config.json` is restructured so workflow path + node IDs live under per-mode keys:

```json
{
  "host": "desktop-tvtdome:8188",
  "modes": {
    "full":   { "workflow": "workflows/SDXL_recettes_cuisine_api.json",        "loader_ocr_id": "1933", "loader_restore_id": "2001", "text_output_id": "2003", "preview_image_id": "465" },
    "ocr":    { "workflow": "workflows/SDXL_recettes_cuisine_ocr_api.json",    "loader_ocr_id": "1933", "text_output_id": "2003" },
    "image":  { "workflow": "workflows/SDXL_recettes_cuisine_image_api.json",  "prompt_text_id": "<tbd>", "preview_image_id": "<tbd>" },
    "prompt": { "workflow": "workflows/SDXL_recettes_cuisine_prompt_api.json", "prompt_text_id": "<tbd>", "preview_image_id": "<tbd>" }
  },
  "preview_image_type": "temp"
}
```

The exact workflow filenames and node IDs are confirmed during the workflow-inspection task (one inspection per new workflow). The user is responsible for placing the three new workflow files on the server under `/userdata/workflows/`; the skill never modifies them.

## 3. Project structure

```
.claude/skills/
├── implement-recipe-from-image/
│   ├── SKILL.md                # full mode — updated to mention sibling skills
│   ├── run.py                  # gains --mode flag, dispatches internally
│   └── config.json             # may gain extra node IDs for prompt injection
├── implement-recipe-from-image-ocr-only/
│   └── SKILL.md                # delegates to run.py --mode ocr
├── regenerate-recipe-image/
│   └── SKILL.md                # delegates to run.py --mode image
└── generate-recipe-image-from-prompt/
    └── SKILL.md                # delegates to run.py --mode prompt
```

Each sibling SKILL.md is short and links back to the canonical agent-contract steps in `implement-recipe-from-image/SKILL.md`, overriding only the steps that differ (no image write for `ocr`; no recipe-md write for `image`/`prompt`).

## 4. Code style

- Python: keep `run.py` single-file, stdlib + `requests`/`websocket-client` (already used). No new heavy deps.
- Dispatch via a small `if args.mode == ...` block calling extracted functions: `run_full()`, `run_ocr()`, `run_image()`, `run_prompt()`. Shared helpers (`submit_workflow`, `wait_for_completion`, `fetch_temp_image`) stay shared.
- Stdout contract: still **last line of stdout = single-line JSON**. Stderr for everything else.
- Failure surface: non-zero exit + stderr message. No partial files on failure.

## 5. Testing strategy

Manual smoke tests (no automated tests in repo for this skill):

1. `--mode full --image <known good photo>` still produces a recipe + image (regression check).
2. `--mode ocr --image <photo>` returns OCR JSON, no `image_temp_path`, no image file fetched.
3. `--mode image --slug crumble_pommes` (use an existing slug) returns a new `image_temp_path` derived from the recipe body, agent overwrites `images/<slug>.png` after confirmation.
4. `--mode prompt --slug crumble_pommes` reads `prompts/_recipes/crumble_pommes.md` and produces a new image.
5. Overwrite check: agent must stop and ask before clobbering `_recipes/<slug>.md` (ocr/full) or `images/<slug>.png` (image/prompt).

## 6. Boundaries

**Always do:**
- Reuse existing `format-pasted-recipe.md` / `home-categories.md` / `update-recipe-prompt-gallery.md` rules for any recipe-md write.
- Run `scripts/generate_card_thumbnails.py` after any image write to `images/<slug>.png`.
- Keep stdout = single-line JSON; logs to stderr.

**Ask first:**
- Before overwriting `_recipes/<slug>.md`, `images/<slug>.png`, `images/cards/<slug>.png`, or `prompts/_recipes/<slug>.md` in any mode.
- Before adding new node IDs / workflow paths to `config.json`.
- If a required workflow file is missing on the server, stop and ask — never auto-create or copy it.

**Never:**
- Run `git add`, `git commit`, `git push`.
- Modify the workflow JSON on the ComfyUI server.
- Hardcode node IDs in `run.py` — they live in `config.json`.
- Skip overwrite checks even in `image`/`prompt` modes — those overwrite by design but still need explicit confirmation.
- Invent file paths or node IDs when `run.py` fails — surface the stderr.
