# Plan — Full WebP migration

Companion to `SPEC.md`. This document is the implementation plan; the per-task checklist with verification commands lives in `tasks/webp-migration-todo.md`.

## Scope recap

Drop PNG / JPG / JPEG / AVIF from `images/`. Move every rendered surface to `.webp` across four variants:

| Variant | Path | Width | Quality |
|---|---|---|---|
| Card | `images/cards/<slug>.webp` | 480 | q82 |
| Hero | `images/hero/<slug>.webp` | 1600 | q80 |
| Full | `images/full/<slug>.webp` | 2400 | q88 |
| Source | `images/<slug>.webp` | original | q90 |

Frontmatter `image:` becomes a bare slug. Inline body images point at `../images/<...>.webp`. Layout, JS, pre-commit hooks, and the `implement-recipe-from-image` skill all updated.

Confirmed defaults: q90 source, lossy-only, 2400 px full, JS builds `<slug>.webp`, `to_implement/` untouched.

Inventory at plan time: 45 PNG · 31 JPG · 5 JPEG · 1 AVIF · 8 WebP under `images/` (90 sources). 78 recipes, ~10 components. One image subfolder already in use (`images/pates_sauce_tomate/`).

## Dependency graph

```
       ┌──────────────────────────┐
       │ A. Pipeline scripts      │  ← P1 in SPEC
       │   migrate_to_webp.py     │
       │   generate_full_images.py│
       │   generate_card_thumbs.py│ (updated)
       │   generate_hero_images.py│ (updated)
       │   check_images.py        │
       └──────────────────────────┘
                  │
                  ▼ produces inputs to ↓
       ┌──────────────────────────┐
       │ B. Pilot recipe E2E      │  ← vertical slice
       │   one recipe: source +   │
       │   3 derivatives + layout │
       │   reads bare-slug.webp   │
       └──────────────────────────┘
                  │ proves the path
                  ▼
       ┌──────────────────────────┐
       │ C. Bulk source migration │  ← P2
       │   all 90 sources → webp  │
       │   originals deleted only │
       │   after webp+derivs OK   │
       └──────────────────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │ D. Mass markdown rewrite │  ← P3
       │   _recipes/, _components/│
       │   frontmatter + body     │
       └──────────────────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │ E. Layout & JS cleanup   │  ← P4
       │   drop replace chain;    │
       │   wire `full/` for zoom; │
       │   JS card URLs           │
       └──────────────────────────┘
                  │
                  ▼
       ┌──────────────────────────┐
       │ F. Tooling lockdown      │  ← P5
       │   pre-commit, skill,     │
       │   rules, webp-only       │
       └──────────────────────────┘
```

Edges are hard. Each phase ends with a verification checkpoint that must pass before the next phase starts.

## Vertical slice — Phase B in detail

Phase B (Pilot) is the only true vertical slice. It takes **one** recipe through the entire post-migration path while the rest of the site is still on `.png`. Candidate: `pates_sauce_tomate` (already has PNG hero, WebP hero, PNG card, an inline-image subfolder; touches every surface).

Steps inside the pilot:

1. Encode `images/pates_sauce_tomate.png` → `images/pates_sauce_tomate.webp` (q90).
2. Encode each `images/pates_sauce_tomate/*.png` → `.webp` (q90).
3. Generate `images/cards/pates_sauce_tomate.webp` (480 w q82), `images/hero/pates_sauce_tomate.webp` (1600 w q80, overwrite), `images/full/pates_sauce_tomate.webp` (2400 w q88, new).
4. Edit `_recipes/pates_sauce_tomate.md`: frontmatter `image: pates_sauce_tomate` (bare); body `../images/pates_sauce_tomate/<file>.webp`.
5. Patch `_layouts/recipe.html` to append `.webp` to bare-slug frontmatter (keep the `replace` chain for now so other recipes still render).
6. Patch the zoom overlay to load `images/full/<slug>.webp` instead of the source.
7. Patch `assets/js/home.js`, `assets/js/search-page.js` to build `images/cards/<slug>.webp`.
8. Spin up jekyll, DevTools Network: home card, recipe hero, zoom, inline — all WebP.
9. Delete the pilot's PNG source and PNG card; refresh; still works.

After step 9 the path is proven. Bulk migration (Phase C+) is mechanical.

The other phases are inherently horizontal (single layout file, single hook config, single skill). They don't subdivide into recipe-shaped vertical slices.

## Parallelism

- Phase A scripts are independent files — could be drafted in any order, but they're small and sequential authoring is fine.
- Phases B and a draft of E could be prepared in parallel (no file overlap), but E only goes live after D lands.
- Phases C and D could be interleaved per-recipe in principle. Default: keep them as two distinct passes — easier diffs, easier rollback.

## Risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Source deleted before WebP verified on disk. | High | `migrate_to_webp.py` only deletes after `webp.exists() and webp.stat().st_size > 0 and Image.open(webp).verify()`. Run on a branch. |
| Visual regression at q90 on one recipe. | Low | Spot-check 5 recipes covering different content (dessert, soup, meat, sauce, oldest image). Per-file q override is trivial since each source is independent. |
| Mid-migration site break (D landed, E not). | Medium | The `replace: '.png' → '.webp'` chain in the current layout is left in place until Phase E. After D, bare-slug values pass through the chain unchanged and get `.webp` appended — verify in P3 checkpoint. |
| Hidden non-WebP references (e.g. in `_includes/`, `_data/`, `assets/`, JSON, sitemap). | Medium | `check_images.py` greps the whole repo (not just `_recipes/`) for `\.(png\|jpe?g\|avif)` paths and reports. |
| Cards script regex blocks WebP commits. | Low | Update `.pre-commit-config.yaml` regexes to allow WebP inputs and reject PNG/JPG outputs. |
| ComfyUI workflow returns PNG; skill writes PNG. | Medium | `run.py` step that moves the temp file becomes "re-encode to WebP q90 then place". Pillow already a dep. |
| `0_TBD.jpg` / `0_TBD.webp` placeholder — special-cased? | Low | Treat `0_TBD` like any other slug; it's a placeholder image, not a recipe. |
| Subfolder images (`images/pates_sauce_tomate/*.png`) — current scripts only scan top-level. | Medium | Subfolders are inline-only assets; they need encoding to `.webp` but no card/hero/full derivatives. Add a separate top-level encode loop in `migrate_to_webp.py` (or skip them and only convert via a markdown-rewrite preflight). |

## Checkpoints between phases

- **A → B**: each new/updated script has a `--help`; running them on a sample image is a no-op the second time.
- **B → C**: pilot recipe renders cleanly with only `.webp` in DevTools Network; pilot's `.png` files removed from the working tree.
- **C → D**: every recipe + component slug has all 4 WebP variants on disk; zero `.png/.jpg/.jpeg/.avif` under `git ls-files images/`.
- **D → E**: `check_images.py` exits 0; `git grep -E '\.(png|jpe?g|avif)' _recipes/ _components/` returns nothing.
- **E → F**: home page + 3 recipe pages + 1 component page load only WebP in DevTools.
- **F (done)**: `pre-commit run --all-files` passes; second run is no-op; skill files have no `.png` mentions.

## Open plan-level questions

1. **One PR or six?** Default: one PR per phase, with Phase C (the destructive source-migration commit) standing alone so it's easy to revert. OK?
2. **Branch?** Default: `feat/webp-migration`, one branch, sequential commits.
3. **Pilot recipe** = `pates_sauce_tomate`. OK? Alternative candidates: any recipe with a PNG source + inline body images.
4. **Visual-QA sample** for Phase C — I'll pick 5 representatives (dessert / soup / meat / sauce / oldest image). Override if you want a specific set.
