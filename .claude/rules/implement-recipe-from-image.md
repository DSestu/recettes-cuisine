# Recipe image / OCR workflows via ComfyUI (autoloaded)

**When this applies:** The user asks anything that involves the ComfyUI pipeline for recipes — OCRing a recipe photo, restoring a dish photo, generating a dish image from a prompt, or iterating restoration over a folder of photos.

**Mechanism:** Always go through the `implement-recipe-from-image` skill (`/implement-recipe-from-image` or `.claude/skills/implement-recipe-from-image/run.py`). It exposes four `--mode` values backed by separate workflows on the ComfyUI server. Never call the server directly; never hardcode node IDs — `config.json` owns them.

## Mode picker

| User intent (FR/EN, paraphrases included) | Mode | Inputs | Outputs |
|---|---|---|---|
| "implement this recipe from image", "implémente cette recette depuis l'image / à partir de l'image", "create a recipe from this photo" | `full` | `--image <path>` (auto-detects `<stem>_text.<ext>` sibling for two-image mode) | OCR text + restored dish image |
| "OCR cette image", "extrais le texte", "lis cette recette", "just give me the text" | `ocr` | `--image <path>` (same `_text` sibling rule) | OCR text only |
| "restaure cette photo", "restore this photo", "régénère l'image de la recette `<slug>`", "améliore la photo de `<slug>`", "redo the image for `<slug>`" | `image` | `--slug <slug>` (resolves `images/<slug>.{png,jpg,jpeg,webp}`) | Restored image |
| "génère l'image depuis le prompt", "regenerate from the prompt gallery", "text-to-image for `<slug>`" | `prompt` | `--slug <slug>` (reads `prompts/_recipes/<slug>.md`) | Generated image |

If the request is ambiguous, ask before running — don't guess between `full` and `ocr`, or between `image` and `prompt`.

## Folder-of-photos restoration

When the user asks to restore **every photo in a directory** (e.g. raw step photos that don't correspond to a recipe slug):

1. The intent is `image` mode applied iteratively.
2. The current `image` mode only takes `--slug`. Do not extend the skill unprompted. Either loop using a temporary slug per file (move to `images/<temp>.<ext>`, run, move back), or ask the user to confirm extending the skill with `--image <path>` support.
3. Keep originals in a `raw/` subfolder. Write restored outputs to a sibling `restored/` subfolder. Never overwrite originals.

## Invocation

```bash
uv run python .claude/skills/implement-recipe-from-image/run.py --mode <full|ocr|image|prompt> [--image <path>] [--slug <slug>]
```

Stdout's last line is JSON. Stderr is progress logging — ignore unless the script exits non-zero.

## Recipe scaffolding (only for `full`)

After `--mode full`, follow `format-pasted-recipe.md` (including its **Condiment detection (ask before split)** protocol — scan the OCR text for reusable sauces/marinades/etc., list candidates in a single grouped question, only split into `_components/` on explicit confirmation), `home-categories.md`, and `update-recipe-prompt-gallery.md`: derive slug, normalise tags, write `_recipes/<slug>.md` (frontmatter `image: <slug>` — **bare slug, no extension** — and `date: <today>`), re-encode the ComfyUI PNG to `images/<slug>.webp` (Pillow, q90, `method=6`), run pre-commit (or `scripts/generate_card_thumbnails.py`, `generate_hero_images.py`, `generate_full_images.py`) to regenerate the three WebP derivatives, create `prompts/_recipes/<slug>.md`. Stop and ask before overwriting any of these files. Never commit.

`ocr` mode prints text — no scaffolding unless asked. `image` / `prompt` modes produce a PNG in `.tmp/comfyui/`; to land it, re-encode to `images/<slug>.webp` (q90) — only on explicit user confirmation (overwrites the source). The site is WebP-only; pre-commit rejects any `.png/.jpg/.jpeg/.avif` under `images/`.
