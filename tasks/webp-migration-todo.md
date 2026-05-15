# Tasks — Full WebP migration

Companion to `tasks/webp-migration-plan.md` and `SPEC.md`. Each task is one focused session, ≤ 5 files touched. Order is dependency-ordered; do not skip ahead.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Phase A — Pipeline scripts

### [x] A1. Add `scripts/generate_full_images.py`

- **Acceptance**
  - Reads `images/*.webp` (and `images/*.png|jpg|jpeg|avif` during migration window), writes `images/full/<stem>.webp` at 2400 px wide, q88, `method=6`.
  - Idempotent (`needs_rebuild` mtime check, mirrors `generate_hero_images.py`).
  - Skips `cards/`, `hero/`, `full/`, and any subdirectory.
- **Verify**
  - `uv run python scripts/generate_full_images.py` — second run touches 0 files.
  - `ls images/full/` non-empty; spot-check one with `file` and `identify` (or Pillow `Image.open(...).size`).
- **Files**: `scripts/generate_full_images.py` (new).

### [x] A2. Update `scripts/generate_hero_images.py` to accept WebP source

- **Acceptance**
  - Source extension whitelist still `{.jpg, .jpeg, .png, .webp, .avif}` (already correct — verify).
  - When source is `.webp`, encode with `method=6` and preserve alpha if present.
  - No behavioural change for existing PNG/JPG sources.
- **Verify**
  - Re-encode an existing recipe's hero (touch its source mtime, re-run); diff is byte-different but visually equivalent.
- **Files**: `scripts/generate_hero_images.py`.

### [x] A3. Update `scripts/generate_card_thumbnails.py` to output WebP

- **Acceptance**
  - Output path becomes `images/cards/<stem>.webp` regardless of input extension.
  - Width cap 480, quality 82, `method=6`.
  - Old `images/cards/<stem>.png` left in place (cleanup in Phase C); script just stops producing new PNGs.
- **Verify**
  - For one PNG source, run script; `images/cards/<stem>.webp` appears, `images/cards/<stem>.png` unchanged.
- **Files**: `scripts/generate_card_thumbnails.py`.

### [x] A4. Add `scripts/migrate_to_webp.py`

- **Acceptance**
  - Walks `images/` (top level **and** one level of subdirs, excluding `cards/`, `hero/`, `full/`).
  - For each `.png|.jpg|.jpeg|.avif`: encode → `<stem>.webp` at q90, `method=6`. Skip if WebP already exists and is newer.
  - **Safety**: deletes the source only when (a) WebP exists, (b) size > 0, (c) `Image.open(webp).verify()` passes. Otherwise leaves source untouched and prints a warning.
  - `--dry-run` flag lists planned actions without writing or deleting.
  - `--no-delete` flag encodes only; sources stay.
- **Verify**
  - `--dry-run` on full tree prints expected set.
  - `--no-delete` then check `ls images/*.webp` — every source has a WebP twin.
- **Files**: `scripts/migrate_to_webp.py` (new).

### [x] A5. Add `scripts/check_images.py`

- **Acceptance**
  - Enumerates `_recipes/*.md` + `_components/*.md`; for each, extracts the frontmatter `image:` value (whether `<slug>` or `<slug>.<ext>`).
  - For each slug, asserts: `images/<slug>.webp`, `images/cards/<slug>.webp`, `images/hero/<slug>.webp`, `images/full/<slug>.webp` exist.
  - Greps `_recipes/`, `_components/`, `_layouts/`, `_includes/`, `assets/js/`, `index.html`, `recherche.html` for `\.(png|jpe?g|avif)` substrings; reports any hits.
  - Exits 0 on full pass, 1 with a summary on any miss.
- **Verify**
  - Run pre-migration: it should fail (lots of missing WebP derivatives). That's expected; this is a stub validator until Phase C completes.
- **Files**: `scripts/check_images.py` (new).

### [x] A6. Add `scripts/generate_inline_small.py`

- **Acceptance**
  - Walks `images/<slug>/` subdirs (excluding `cards/hero/full/`).
  - For each `<step>.full.webp`, emits `<step>.webp` at 1000 px wide, q82, `method=6`.
  - Idempotent (mtime check).
- **Verify**
  - Run after migration on `images/pates_sauce_tomate/`; each `.full.webp` has a `.webp` sibling at ≤ 1000 px width.
- **Files**: `scripts/generate_inline_small.py` (new).

### [x] A7. Update `scripts/migrate_to_webp.py` for inline-variant layout

- **Acceptance**
  - Top-level non-WebP source → `<stem>.webp` at q90 (unchanged).
  - Subfolder non-WebP source → `<stem>.full.webp` at q88, capped 2400 px.
  - Constants split: `TOP_LEVEL_QUALITY`, `INLINE_FULL_QUALITY`, `INLINE_FULL_MAX_WIDTH`.
- **Verify**
  - Dry-run on `images/pates_sauce_tomate/` lists targets as `*.full.webp`.
- **Files**: `scripts/migrate_to_webp.py`.

### [x] A8. Extend `scripts/check_images.py` to verify inline pairs

- **Acceptance**
  - For every `images/<slug>/<step>.full.webp`, asserts a sibling `<step>.webp` exists (and vice-versa).
  - Reports `missing inline pair files: N` line and a section listing missing files.
  - Exits 1 on any inline mismatch.
- **Files**: `scripts/check_images.py`.

### Checkpoint A → B

- All five scripts have `--help`; running each is idempotent.
- No site behaviour change yet.

---

## Phase B — Pilot one recipe end-to-end (`pates_sauce_tomate`)

### [x] B1. Encode pilot's source + subfolder (with inline variants)

- **Acceptance**
  - `images/pates_sauce_tomate.webp` exists at q90 (top-level source).
  - For each of the 8 step photos in `images/pates_sauce_tomate/`:
    - `<step>.full.webp` at 2400 w q88 (source-of-truth).
    - `<step>.webp` at 1000 w q82 (derived; generated by `generate_inline_small.py`).
  - PNG originals not yet deleted.
- **Verify**
  - `file` reports WebP on every new file.
  - Inline small images are ≤ 1000 px wide; `.full.webp` are ≤ 2400 px wide.
- **Files**: 1 top-level + 8×2 inline files; runs `migrate_to_webp.py --no-delete` then `generate_inline_small.py`.

### [x] B2. Generate pilot's 3 derivatives

- **Acceptance**
  - `images/cards/pates_sauce_tomate.webp`, `images/hero/pates_sauce_tomate.webp` (overwrite existing), `images/full/pates_sauce_tomate.webp`.
- **Verify**
  - All three exist, sized to spec (480 / 1600 / 2400 px wide).
- **Files**: derivatives only; run `generate_card_thumbnails.py`, `generate_hero_images.py`, `generate_full_images.py`.

### [x] B3. Rewrite pilot's markdown

- **Acceptance**
  - `_recipes/pates_sauce_tomate.md`: frontmatter `image: pates_sauce_tomate` (bare).
  - Body links: `../images/pates_sauce_tomate/<name>.webp` (8 occurrences).
- **Verify**
  - `git diff _recipes/pates_sauce_tomate.md` shows only those changes.
- **Files**: `_recipes/pates_sauce_tomate.md`.

### [x] B4. Patch layout to handle bare-slug frontmatter

- **Acceptance**
  - `_layouts/recipe.html`: when `page.image` has no extension, append `.webp`. When it does, run through the existing `replace` chain (backwards compat for unmigrated recipes).
  - Main image zoom overlay reads `images/full/<slug>.webp` instead of the source.
  - **Inline image zoom**: existing lens/zoom handler that currently opens the body `<img src>` is updated to swap `.webp` → `.full.webp` in the URL before showing the overlay.
- **Verify**
  - `bundle exec jekyll serve`; DevTools Network on pilot — hero, inline (small), main zoom (`full/<slug>.webp`), inline zoom (`<slug>/<step>.full.webp`) all `.webp`. Other recipes still render.
- **Files**: `_layouts/recipe.html`, possibly one `assets/js/*.js` file if the lens logic lives there.

### [x] B5. Patch JS for card URLs (pilot test)

- **Acceptance**
  - `assets/js/home.js`, `assets/js/search-page.js`: build `images/cards/<slug>.webp` from the bare slug; if the frontmatter still has `.ext`, strip it.
- **Verify**
  - Home page card for the pilot loads `cards/pates_sauce_tomate.webp`. Cards for other (still-PNG) recipes also load `.webp` because Phase A3 wrote those — but their frontmatter still says `.png`. Confirm the JS strips the extension before appending `.webp`.
- **Files**: `assets/js/home.js`, `assets/js/search-page.js`.

### [x] B6. Delete pilot's PNG sources

- **Acceptance**
  - `images/pates_sauce_tomate.png` and `images/pates_sauce_tomate/*.png` deleted.
  - `images/cards/pates_sauce_tomate.png` deleted (Phase A3 wrote the WebP twin).
- **Verify**
  - Pilot recipe page reloads cleanly; no 404 in Network tab.
- **Files**: 9 PNG deletions.

### Checkpoint B → C

- DevTools on pilot: only `.webp` requests for hero, inline images, zoom, card.
- Other recipes still render unchanged.
- Pilot's PNG source files removed from tree.

---

## Phase C — Bulk source migration

### [x] C1. Dry-run migration

- **Acceptance**
  - `uv run python scripts/migrate_to_webp.py --dry-run` lists ~82 expected encodes (90 sources − 8 already WebP, minus the pilot).
- **Verify**
  - Output matches `git ls-files images/ | grep -E '\.(png|jpg|jpeg|avif)$'`.
- **Files**: none.

### [x] C2. Run migration (encode only, no deletion)

- **Acceptance**
  - `uv run python scripts/migrate_to_webp.py --no-delete` produces a `.webp` next to every PNG/JPG source.
  - Pre-existing WebP sources untouched.
- **Verify**
  - For each non-WebP source: `images/<stem>.webp` exists.
- **Files**: ~82 new WebP files.

### [x] C3. Generate full set of derivatives

- **Acceptance**
  - `generate_card_thumbnails.py`, `generate_hero_images.py`, `generate_full_images.py` each run idempotently.
  - Every recipe / component has `cards/<slug>.webp`, `hero/<slug>.webp`, `full/<slug>.webp`.
- **Verify**
  - `scripts/check_images.py` (derivative-only mode; ignore frontmatter check for now) returns 0.
- **Files**: derivatives only.

### [x] C4. Visual QA on 5 sample recipes

- **Acceptance**
  - Render 5 representative recipes locally (one dessert, one soup, one meat, one sauce, one oldest); each looks visually equivalent to the PNG version (side-by-side).
- **Verify**
  - Spot-check passes; if a recipe shows q90 artefacts, override its source to q95 and re-run derivatives.
- **Files**: none (or one recipe's source re-encoded).

### [x] C5. Delete PNG/JPG/JPEG/AVIF sources

- **Acceptance**
  - `git ls-files images/ | grep -E '\.(png|jpg|jpeg|avif)$'` returns nothing.
  - The pilot's already-deleted PNGs stay gone.
- **Verify**
  - Site still renders all recipes locally (the layout's `replace` chain still rewrites the `.png` in frontmatter → `.webp`, which now exists).
- **Files**: ~82 deletions.

### Checkpoint C → D

- Zero non-WebP files under `images/`.
- All recipes render locally with WebP loading via the legacy `replace`-chain path.

---

## Phase D — Mass markdown rewrite

### [x] D1. Rewrite frontmatter `image:` to bare slug

- **Acceptance**
  - Every `_recipes/*.md` and `_components/*.md`: `image: <slug>.<ext>` → `image: <slug>`.
  - Handles array form too (`image: [a.png, b.png]` → `image: [a, b]`).
- **Verify**
  - `git grep -E '^image:.*\.(png|jpe?g|avif|webp)' _recipes _components` returns nothing.
- **Files**: ~88 markdown files.

### [x] D2. Rewrite body image links

- **Acceptance**
  - Replace `](../images/<path>.png|.jpg|.jpeg|.avif)` → `](../images/<path>.webp)` in `_recipes/` and `_components/`.
  - Also handle `](images/...)` (rule says `images/...` but practice uses `../images/...`).
  - Skip code blocks (look for `]/` outside fenced blocks).
- **Verify**
  - `git grep -E '\]\(\.\.?/images/.*\.(png|jpe?g|avif)' _recipes _components` returns nothing.
- **Files**: ~88 markdown files (most unchanged because they have no inline images).

### Checkpoint D → E

- `scripts/check_images.py` exits 0 (frontmatter check now meaningful).
- `git grep -E '\.(png|jpe?g|avif)' _recipes _components` returns nothing.

---

## Phase E — Layout & JS cleanup

### [x] E1. Drop the layout's `replace` chain

- **Acceptance**
  - `_layouts/recipe.html`: `hero_file = page.image | append: '.webp'` (no replace chain).
  - Zoom overlay still points at `images/full/<slug>.webp`.
- **Verify**
  - jekyll serve; DevTools confirms hero `.webp` for every recipe.
- **Files**: `_layouts/recipe.html`.

### [x] E2. Audit and clean other layouts / includes

- **Acceptance**
  - `_layouts/default.html`, `index.html`, `recherche.html`, `home_categories.md`, `_includes/*.html`: any path/string referencing `.png/.jpg/.jpeg/.avif` removed or rewritten.
- **Verify**
  - `git grep -E '\.(png|jpe?g|avif)' _layouts _includes index.html recherche.html home_categories.md` returns nothing site-facing.
- **Files**: as needed.

### [x] E3. JS URL builders (final form)

- **Acceptance**
  - `assets/js/home.js`, `assets/js/search-page.js`, `assets/js/transitions.js`: card URLs built from bare slug + `.webp`. No `.png` mentions.
- **Verify**
  - Home, search results, transitions all render with `.webp`.
- **Files**: 3 JS files.

### Checkpoint E → F

- DevTools on home + 3 recipe pages + 1 component page: only `.webp` loads for site imagery.

---

## Phase F — Tooling lockdown

### [x] F1. Update `.pre-commit-config.yaml`

- **Acceptance**
  - Existing `generate-card-thumbnails` and `generate-hero-images` hooks updated to trigger on `images/*.webp` (and the script files themselves).
  - New `generate-full-images` hook added with the same triggers.
  - New `check-images` hook running `scripts/check_images.py`.
  - New `reject-non-webp` hook (or part of `check_images.py`) failing the commit if any `.png/.jpg/.jpeg/.avif` is staged under `images/`.
- **Verify**
  - `pre-commit run --all-files` passes; second run is no-op.
  - Staging a fake `images/foo.png` triggers the reject hook.
- **Files**: `.pre-commit-config.yaml`.

### [x] F2. Tighten generator scripts to WebP-only source

- **Acceptance**
  - `generate_card_thumbnails.py`, `generate_hero_images.py`, `generate_full_images.py`, `migrate_to_webp.py`: source whitelist becomes `{.webp}` (migrate becomes a no-op).
  - `migrate_to_webp.py` kept for emergencies; logs "nothing to do" on a clean tree.
- **Verify**
  - All four scripts idempotent on a clean tree.
- **Files**: 4 Python files.

### [x] F3. Update `implement-recipe-from-image` skill

- **Acceptance**
  - `.claude/skills/implement-recipe-from-image/SKILL.md`: every `.png` example/path becomes `.webp`. The post-pipeline "place the image" step explicitly re-encodes the ComfyUI temp PNG to WebP at q90 before moving it to `images/<slug>.webp`.
  - `.claude/skills/implement-recipe-from-image/run.py`: optionally adds a helper or call-out (depending on whether re-encoding lives in the skill or in the markdown). Keep `run.py` minimal — the skill agent does the encode after fetching the temp file.
  - `.claude/skills/implement-recipe-from-image/config.json`: no changes (workflow node IDs untouched).
- **Verify**
  - Read SKILL.md end-to-end: no `.png` left in user-facing examples; the "Place the image" step mentions WebP encoding.
- **Files**: `.claude/skills/implement-recipe-from-image/SKILL.md`, possibly `run.py`.

### [x] F4. Update autoloaded rules

- **Acceptance**
  - `.claude/rules/implement-recipe-from-image.md`: mode descriptions reference `.webp`. Folder-restoration guidance: outputs land as `.webp` in the `restored/` sibling.
  - `.claude/rules/format-pasted-recipe.md`: frontmatter `image:` example becomes bare slug (`image: veloute_asperges`, no extension). Body image example becomes `.webp`. Hero, card, full convention mentioned.
- **Verify**
  - `git grep '\.png' .claude/rules` returns nothing site-relevant.
- **Files**: 2 rules files.

### [x] F5. Final repo sweep

- **Acceptance**
  - `git grep -E '\.(png|jpe?g|avif)' -- :^to_implement :^.tmp :^node_modules` returns only references that genuinely belong (e.g. docs, ADRs about migration history, this plan).
- **Verify**
  - Manual review of remaining hits.
- **Files**: as needed.

### Done

- `pre-commit run --all-files` passes.
- `scripts/check_images.py` exits 0.
- DevTools on home + several recipe pages: only `.webp` requests for site imagery.
- `SPEC.md` success criteria all checked.

---

## File-touch budget per task

| Task | Files |
|---|---|
| A1 | 1 (new) |
| A2 | 1 |
| A3 | 1 |
| A4 | 1 (new) |
| A5 | 1 (new) |
| B1 | 9 image encodes |
| B2 | 3 derivatives |
| B3 | 1 |
| B4 | 1 |
| B5 | 2 |
| B6 | 9 deletions |
| C1 | 0 |
| C2 | ~82 new |
| C3 | derivatives |
| C4 | 0–1 |
| C5 | ~82 deletions |
| D1 | up to 88 (mostly tiny diffs) |
| D2 | small subset |
| E1 | 1 |
| E2 | a handful |
| E3 | 3 |
| F1 | 1 |
| F2 | 4 |
| F3 | 1–2 |
| F4 | 2 |
| F5 | as needed |

Every task is small enough to land in one focused session.
