# SPEC — recettes-cuisine

Retrospective specification of the current site. Describes what exists today,
not a forward plan. Source of truth for behavior is the code; this document
explains intent and constraints.

## 1. Objective

A personal French-language recipe website published at
https://dsestu.github.io/recettes-cuisine, customized from Chowdown. Goals:

- Author recipes as plain Markdown files, version-controlled in git.
- Browse and search recipes from any device, including offline (PWA).
- Discover recipes via a rich tag taxonomy: by category, by tag co-occurrence
  (force-directed graph), and by "what's in my fridge" ingredient matching with
  tolerance.

Target users: anyone visiting the public site. Primary author: the repo owner.

## 2. Commands

Local development:

- `jekyll serve` — build and serve on http://127.0.0.1:4000 with live reload.
- `docker compose up` — containerized alternative; host port 80 → container 4000.
- `uv sync` — install Python build dependencies (Pillow, PyYAML).
- `pre-commit install` — register the thumbnail-generation hook.

Build-time scripts (invoked by hook or manually):

- `uv run python scripts/generate_card_thumbnails.py` — regenerate
  `images/cards/*` (max width 480px, JPEG q=82). Idempotent.
- `uv run python scripts/migrate_directions_to_body.py [--dry-run] [--all | FILES]`
  — migrate legacy `directions:` YAML lists to body `## Préparation` sections.

Deployment: push to `main` on GitHub; GitHub Pages builds Jekyll automatically.

## 3. Project Structure

```
_recipes/                Jekyll collection: ~59 recipe Markdown files
_components/             Jekyll collection: ~14 sub-recipes / bases
_layouts/                default.html, recipe.html, page.html, post.html
_includes/               head.html, header.html, footer.html, nutritional-information.html
_data/
  recipe_tags.yml        Canonical tag registry (~537 entries, ingredient flag)
  nutrients.yml          Nutrition field schema (schema.org NutritionInformation)
_posts/                  Legacy blog posts (2018)
assets/js/               home.js, nav.js, qr.js, search-page.js
js/                      Third-party libs + Jekyll-generated index.json
plugins/                 simple-jekyll-search.min.js
images/                  Source images
images/cards/            Generated 480px thumbnails (committed)
scripts/                 Python build utilities
prompts/                 AI image-generation prompts (parallel to _recipes / _components)
home_categories.md       Homepage category groupings by tag IDs
index.html               Homepage
recherche.html           Advanced search (3-panel D3 UI)
search.html              Lightweight search alternative
search.json              Jekyll-generated recipe index for client-side search
_config.yml              Jekyll config (baseurl, i18n strings, exclusions)
manifest.json            PWA manifest
serviceworker.js         Offline cache (cache-first, fetch fallback)
docker-compose.yml       Local dev container
pyproject.toml           uv-managed Python deps
.pre-commit-config.yaml  Thumbnail-generation hook trigger
```

## 4. Code Style

**Recipe authoring (Markdown + YAML):**

- Required frontmatter: `layout: recipe`, `title`, `image` (filename only),
  `tags` (list), `ingredients` (list).
- Optional: `imagecredit`, `directions` (legacy YAML list, prefer body),
  `components` (list of exact recipe titles), `nutrition` (per `_data/nutrients.yml`).
- Directions live in body Markdown under `## Préparation` for new recipes;
  legacy YAML lists are still supported.
- All tags must exist in `_data/recipe_tags.yml`. Canonical form only — no
  accented or plural duplicates (`oeufs` not `œufs`, `creme` not `crème`).
  New tags require adding an entry with the `ingredient: true/false` flag.

**Frontend:**

- Vanilla JS in `assets/js/`. No bundler, no transpile step.
- jQuery 2.1.4, Hammer.js, D3, lunr.js, QRCode.js are loaded via `_includes/head.html`.
- Tailwind utility classes mixed with custom inline CSS in layouts.
- All user-visible strings are French.

**Python:**

- 3.x, dependencies declared in `pyproject.toml`, run via `uv run`.
- Scripts are idempotent and accept `--dry-run` / file-list arguments where applicable.

**Conventions:**

- Image references in frontmatter and body use bare filenames; layouts prepend
  `{{ site.baseurl }}/images/` (hero) or `/images/cards/` (thumbnails).
- URLs and routes are determined by Jekyll defaults (`permalink` rules in `_config.yml`).
- Pre-commit hook regenerates thumbnails — never hand-edit `images/cards/`.

## 5. Testing Strategy

No automated test suite. Verification is manual and visual:

- Run `jekyll serve` locally; smoke-test homepage, a recipe page, simple search,
  advanced search (`/recherche/`).
- On `recherche.html`, verify URL state round-trips (`tags`, `what_i_have`,
  `mode`, `tolerance`).
- After adding a recipe: confirm card appears on homepage in the right category,
  is searchable, and renders correctly on mobile + desktop.
- After modifying images: confirm pre-commit hook regenerated the corresponding
  `images/cards/` entry and the commit includes both.
- Service worker: clear cache on schema changes to avoid stale offline content.

## 6. Boundaries

**Always:**

- Use canonical tags from `_data/recipe_tags.yml`. Add new entries there rather
  than coining variants in recipes.
- Keep recipe content in plain Markdown so it remains readable in git.
- Run the pre-commit hook (or accept its edits) before pushing image changes.
- Preserve French as the user-facing language.

**Ask first:**

- Introducing a build step (bundler, transpiler, CSS pipeline) — would break the
  "edit a file, push, done" GitHub Pages workflow.
- Changing the frontmatter schema or tag registry format — affects every recipe.
- Restructuring URLs / permalinks — breaks shared links and search index.
- Adding new third-party JS dependencies on every page.
- Large refactors of `recherche.html` or `_layouts/recipe.html` (both are big
  files with subtle interactions between inline CSS, inline JS, and the D3 graph).

**Never:**

- Hand-edit `images/cards/` — always go through the thumbnail script.
- Commit large unoptimized images to `images/` without letting the hook process them.
- Skip the canonical-tag rule (no `œufs` / `oeuf` / `oeufs` mixed forms).
- Move the site off GitHub Pages without an explicit decision (deployment
  simplicity is a feature).
- Bypass the pre-commit hook with `--no-verify` to ship image changes.
