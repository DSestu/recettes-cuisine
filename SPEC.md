# Spec: Full WebP migration (drop PNG/JPG originals)

## Objective

The recipe site currently keeps three parallel image variants per recipe — the original `images/<slug>.{png,jpg,…}` (full-res, also used by the zoom overlay), the 480 px card thumbnail under `images/cards/`, and the 1600 px WebP hero under `images/hero/`. The PNG/JPG originals dominate page weight (multi-MB) and are no longer necessary for any rendered surface.

Migrate the entire site to a WebP-only image system. After migration:

- No PNG/JPG/JPEG/AVIF lives under `images/` at any depth.
- Every rendered surface — home cards, recipe hero, zoom overlay, inline body images — resolves to a `.webp` file.
- The frontmatter `image:` field carries a **bare slug** (no extension); the layout appends `.webp`.
- Pre-commit hooks regenerate all WebP derivatives idempotently.
- The ComfyUI pipeline (`implement-recipe-from-image`) and its autoloaded rule produce WebP, not PNG.

Target user: solo maintainer (you). Success = pages feel snappier on mobile, the repo stops accumulating heavy PNGs, and the toolchain has one source format.

## Tech Stack

- Jekyll (static site, GitHub Pages).
- Python (Pillow) for image processing in `scripts/`.
- `uv` for Python invocation.
- `pre-commit` framework for hooks.
- No new dependencies expected.

## Image variant matrix (post-migration)

| Variant | Path | Size | Quality | Consumer |
|---|---|---|---|---|
| Card | `images/cards/<slug>.webp` | 480 px wide | q82 | Home page card backgrounds, search results |
| Hero | `images/hero/<slug>.webp` | 1600 px wide | q80 | Recipe page inline hero |
| Full | `images/full/<slug>.webp` | 2400 px wide | q88 | Zoom overlay only |
| Source | `images/<slug>.webp` | original res | q90 | Build input for the three derivatives above; NOT referenced directly by any page |

Rationale for keeping a single source `.webp` at the top of `images/`: pre-commit needs a stable input to regenerate derivatives when a recipe's image changes, and `image: <slug>` in frontmatter needs to resolve to *something* unambiguously.

## Commands

```bash
# One-shot migration (run once on a clean working tree)
uv run python scripts/migrate_to_webp.py            # see Tasks for what this does

# Re-derive variants (idempotent, called by pre-commit)
uv run python scripts/generate_card_thumbnails.py   # cards/<slug>.webp from images/<slug>.webp
uv run python scripts/generate_hero_images.py       # hero/<slug>.webp from images/<slug>.webp
uv run python scripts/generate_full_images.py       # full/<slug>.webp from images/<slug>.webp  (new)

# Verify
uv run python scripts/check_images.py               # NEW: completeness + dead-link check

# Build / dev
bundle exec jekyll serve                            # local dev
docker compose up                                   # alternate local dev

# Hooks
pre-commit install
pre-commit run --all-files
```

## Project Structure (changes only)

```
images/
  <slug>.webp                   # source — committed, single per recipe
  cards/<slug>.webp             # derivative (480 w)
  hero/<slug>.webp              # derivative (1600 w)
  full/<slug>.webp              # derivative (2400 w) — NEW
scripts/
  generate_card_thumbnails.py   # updated: output .webp, accept .webp source only
  generate_hero_images.py       # updated: accept .webp source only
  generate_full_images.py       # NEW
  migrate_to_webp.py            # NEW: one-shot, idempotent migration
  check_images.py               # NEW: post-migration verification
_recipes/*.md                   # frontmatter `image: <slug>` (bare); body links `../images/<slug>.webp`
_components/*.md                # same convention
_layouts/recipe.html            # drop `replace: '.png' → '.webp'` chain; assume `.webp` everywhere
assets/js/*.js                  # card URL builders point at `images/cards/<slug>.webp`
.pre-commit-config.yaml         # `generate-full-images` added; file regexes updated for `.webp`
.claude/skills/implement-recipe-from-image/   # SKILL.md and run.py updated to produce .webp
.claude/rules/implement-recipe-from-image.md  # updated mode descriptions
.claude/rules/format-pasted-recipe.md         # updated frontmatter example
```

## Code Style

Python image scripts mirror the existing pattern in `scripts/generate_hero_images.py`:

```python
HERO_MAX_WIDTH = 1600
WEBP_QUALITY = 80
IMAGES_DIR = "images"
HERO_DIR = "images/hero"
SOURCE_EXT = ".webp"          # post-migration: only .webp inputs
EXCLUDE_SUBDIRS = {"cards", "hero", "full"}


def needs_rebuild(src: Path, dst: Path) -> bool:
    if not dst.exists():
        return True
    return src.stat().st_mtime > dst.stat().st_mtime


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    src_dir = repo_root / IMAGES_DIR
    out_dir = repo_root / HERO_DIR
    out_dir.mkdir(parents=True, exist_ok=True)

    for path in src_dir.iterdir():
        if path.is_dir() or path.name in EXCLUDE_SUBDIRS:
            continue
        if path.suffix.lower() != SOURCE_EXT:
            continue
        ...
```

Jekyll layout assumes a single canonical filename:

```liquid
{% assign hero_file = page.image | append: '.webp' %}
<img src="{{ site.baseurl }}/images/hero/{{ hero_file }}" ...>
```

Frontmatter:

```yaml
---
layout: recipe
title: "Pâtes sauce tomate"
image: pates_sauce_tomate    # bare slug, no extension
tags: [...]
ingredients: [...]
---
```

Inline body images (preferred Markdown form):

```markdown
![Sauce finale](../images/pates_sauce_tomate/sauce_finale.webp)
```

## Testing Strategy

No formal test framework in the repo. Verification is manual + scripted:

1. **Idempotency check** — run each `generate_*.py` twice in a row; second run must touch zero files.
2. **Completeness check** — `scripts/check_images.py` (new) enumerates `_recipes/*.md` + `_components/*.md`, resolves each `image:` slug, and asserts `images/<slug>.webp`, `images/cards/<slug>.webp`, `images/hero/<slug>.webp`, `images/full/<slug>.webp` all exist. Exits non-zero on any miss. Wired into pre-commit.
3. **Dead-link check** — same helper greps `_recipes/` and `_components/` for `](.*\.(png|jpe?g|avif))` and fails if any non-WebP path remains.
4. **Local render** — `bundle exec jekyll serve`, manually browse home page (cards), one recipe page (hero + inline + zoom), one component page.
5. **Page weight** — eyeball Network panel on a recipe page; pre/post page weight should drop substantially.

## Boundaries

**Always do**
- Treat `images/<slug>.webp` as the single source for a recipe. Edit it (or replace it), then let pre-commit regenerate the three derivatives.
- Keep WebP encoding parameters (quality, max width) in module constants at the top of each script — no magic numbers.
- Use `Pillow.Image.save(..., method=6)` for the migration encode (slow but best size); use the default `method` in incremental pre-commit derivation (fast).
- After moving/renaming any image, run `scripts/check_images.py`; ship only when it passes.
- Update every skill / rule file that mentions `.png` paths so future automation produces WebP from the start.

**Ask first**
- Changing variant sizes (480 / 1600 / 2400) or quality (q82 / q80 / q88) — these are tuned numbers.
- Adding a fourth variant (e.g. AVIF, or a 960 px tier for tablets) — adds build cost and complexity.
- Deleting `images/<slug>.webp` (source) without a replacement.
- Touching files unrelated to image plumbing during the migration (no opportunistic refactors).

**Never do**
- Commit a `.png`, `.jpg`, `.jpeg`, or `.avif` anywhere under `images/`. Pre-commit rejects them.
- Reference an image with an extension in frontmatter (post-migration). Bare slug only.
- Keep the original PNG "just in case" alongside the WebP. The migration is one-way.
- Run `git add -A` or `git commit` as part of the migration script — the user reviews and commits.
- Modify the ComfyUI workflow on the server. Mode outputs come back as PNG today; the local pipeline re-encodes to WebP before placing the file.

## Success Criteria

- [ ] `git ls-files images/` returns zero `.png` / `.jpg` / `.jpeg` / `.avif` paths.
- [ ] Every recipe + component has all four WebP files (source + 3 derivatives). `scripts/check_images.py` exits 0.
- [ ] Every `_recipes/*.md` and `_components/*.md` has `image: <bare-slug>` (no extension) and no body link to a non-WebP path.
- [ ] `_layouts/recipe.html` no longer contains the `replace: '.png' → '.webp'` chain; it appends `.webp` from a bare slug.
- [ ] Home page card backgrounds, recipe page hero, recipe page zoom overlay, and inline body images all load `.webp` (verified via DevTools Network on at least three recipes).
- [ ] Pre-commit hooks pass on a clean tree; running them twice is a no-op the second time.
- [ ] `implement-recipe-from-image` skill (SKILL.md, run.py, autoloaded rule) writes `.webp` end to end. The card/hero/full derivatives are regenerated by the existing hooks; the skill no longer touches `.png`.
- [ ] No regression in the home page, recipe pages, or component pages (manual smoke).

## Open Questions

1. **Source-image quality** — keep WebP at q90 for the source (good fidelity, ~30 % smaller than PNG)? Or q95 if you may re-derive from it later without quality accumulation? Default: **q90**.
2. **Lossless WebP for the source** — for screenshots / line art (rare here) lossless WebP is smaller than lossy. Worth detecting? Default: **no**, treat everything as lossy.
3. **Zoom overlay (`full` variant) target width** — 2400 px is my proposal. Originals appear ~4000 px+. 2400 covers retina displays at full screen; 3200 would be safer for larger displays. Default: **2400**.
4. **Cards rewrite in JS** — confirm the home page JS (`assets/js/home.js`, `assets/js/search-page.js`) should build `<slug>.webp` from the bare slug to match the layout. Default: **yes**.
5. **`to_implement/` directory** — out of scope (it's not under `images/`). Leave PNG sources there alone. OK?

---

Pause here for review. On greenlight, I move to:

- **Phase 2 (Plan)** — component dependencies (scripts → layout → JS → skills), ordering, parallelisable vs. sequential, risks.
- **Phase 3 (Tasks)** — discrete checklist with acceptance + verification per task.
- **Phase 4 (Implement)** — task-by-task, no commits.
