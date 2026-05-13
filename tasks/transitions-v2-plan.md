# Plan — Page Transitions Redesign (SPEC.md)

Replaces the previous card→hero morph with a route-pair-aware choreography on top of the existing cross-document View Transitions API.

## Architecture summary

- **Substrate:** existing `@view-transition { navigation: auto }` in `_includes/head.html`. No new library.
- **Shared-region names** (no per-recipe slugs — names are stable per *region*):
  - `vt-hero` on the recipe hero `<img>` (left column).
  - `vt-content` on the recipe right column (`<article class="post-content">`).
  - `vt-home` on the homepage main wrapper.
  - Search has no named region — its DOM stays still (root crossfade only) when home/recipe is the animated counterpart.
- **Direction signalling:**
  - `<html data-page-kind="home|search|recipe">` set by Liquid based on `page.url` / `page.layout` in `_includes/head.html` (or `default.html`).
  - On the outgoing page (`pageswap` if supported, else `pagehide`), `assets/js/transitions.js` writes `sessionStorage.fromKind = currentKind`.
  - On the incoming page, an inline script in `<head>` reads `sessionStorage.fromKind` synchronously *before* the View Transition starts its DOM-update phase, sets `<html data-from-kind="...">`, then clears the storage entry.
  - CSS keys off both attributes for per-pair animations.
- **Default fallback:** if `data-from-kind` is absent (direct load), only a root crossfade runs. Named groups whose counterpart doesn't exist on the other page get a default fade.

## Dependency graph

```
S1 (handshake infra) ──┬─► S2 (region naming) ──┬─► S3 home↔recipe curtains
                       │                         ├─► S4 recipe↔recipe scanner
                       │                         ├─► S5 home↔search single curtain
                       │                         └─► S6 search↔recipe (alias S3)
                       └─► S7 reduced-motion + direct-load
```

S1 + S2 are scaffolding and must land first. S3–S6 are independent route-pair slices. S7 is cross-cutting polish.

## Vertical slices

### S1 — Handshake infrastructure
- Add `data-page-kind` to `<html>` via Liquid in `_includes/head.html` (read from `page.url` / `page.layout`).
- Add a short inline `<script>` in `<head>` (before any deferred scripts) that reads `sessionStorage.fromKind`, sets `<html data-from-kind="...">`, removes the storage entry.
- In `transitions.js`, register `pageswap` and `pagehide` listeners that write `sessionStorage.fromKind` from the current `<html data-page-kind>`.
- Keep the hover-preload helper unchanged.

**Acceptance:**
- `<html data-page-kind>` is correct on Home (`home`), Search (`search`), Recipe (`recipe`).
- After a navigation, the destination page has `<html data-from-kind="...">` set to the origin's kind before any CSS transition begins.
- After a hard reload (no prior session), `data-from-kind` is absent.

**Verify:** Manual DOM inspection in DevTools; navigate all route pairs.

### S2 — Region naming
- Recipe layout: replace `view-transition-name: vt-<slug>` on hero `<img>` with `vt-hero`. Add `view-transition-name: vt-content` on `article.post-content`.
- Home: add a wrapper element (or use existing top-level home wrapper) with `view-transition-name: vt-home`. Liquid-condition to apply only on home page.
- Remove per-card `viewTransitionName` stamping from `home.js`, `search-page.js`. Remove the `window.recipeViewTransitionName` helper from `transitions.js`.

**Acceptance:**
- Recipe hero has `vt-hero`; right column has `vt-content`.
- Home root wrapper has `vt-home`; no card has any `view-transition-name`.
- No console warnings about duplicate names.

**Verify:** Inspect DOM on each page; navigate Home → Recipe — old morph no longer plays.

### S3 — Home ↔ Recipe curtains
CSS:
- `html[data-page-kind="recipe"][data-from-kind="home"]`: `::view-transition-new(vt-hero)` animates `translateX(-100%) → 0`; `::view-transition-new(vt-content)` animates `translateX(100%) → 0`. `::view-transition-old(vt-home)` no-op (stays still). 500ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
- `html[data-page-kind="home"][data-from-kind="recipe"]`: `::view-transition-old(vt-hero)` animates `0 → translateX(-100%)`; `::view-transition-old(vt-content)` animates `0 → translateX(100%)`. `::view-transition-new(vt-home)` no-op.

**Acceptance:** SPEC AC #1, #2.

**Verify:** Click recipe from home; back. DevTools Animations panel confirms curve.

### S4 — Recipe ↔ Recipe scanner
CSS for `html[data-page-kind="recipe"][data-from-kind="recipe"]`:
- `::view-transition-new(vt-hero)` animates a `mask-image: linear-gradient(to bottom, black, black, transparent, transparent)` whose stops shift top→bottom; soft band ~20% of height.
- `::view-transition-old(vt-hero)` does the inverse mask (or simply fades) so the bottom half of the old shows while the top of the new is already in.
- `::view-transition-old(vt-content)` + `::view-transition-new(vt-content)` → opacity crossfade 400ms.
- Same easing, simultaneous start.

**Acceptance:** SPEC AC #3.

**Verify:** Click a recipe link from inside another recipe; observe scanner and crossfade.

### S5 — Home ↔ Search single curtain
CSS:
- `html[data-page-kind="search"][data-from-kind="home"]`: `::view-transition-old(vt-home)` animates `translateX(0) → translateX(-100%)`. Search stays still.
- `html[data-page-kind="home"][data-from-kind="search"]`: `::view-transition-new(vt-home)` animates `translateX(-100%) → 0`. Search stays still.

**Acceptance:** SPEC AC #4, #5.

**Verify:** Toggle between Home and Search.

### S6 — Search ↔ Recipe
Add `[data-from-kind="search"]` to S3's selector lists. No new keyframes.

**Acceptance:** SPEC AC #6, #7.

**Verify:** Search → recipe → back.

### S7 — Reduced motion + direct-load fallback
- `@media (prefers-reduced-motion: reduce)` rule overrides all named-group animations to 1ms.
- When `<html>` has no `data-from-kind`: only a default root crossfade rule applies; explicit suppression of named-group animations.

**Acceptance:** SPEC AC #8, #9.

**Verify:** Toggle reduced-motion in DevTools; hard-reload directly into a recipe URL.

## Checkpoints

- **CP-α (after S1+S2):** attributes correct; old morph gone; plain fade between pages.
- **CP-β (after S3):** marquee home↔recipe curtains feel right. User validates.
- **CP-γ (after S4):** scanner + crossfade for recipe↔recipe.
- **CP-δ (after S5+S6):** matrix fully covered.
- **CP-ε (after S7):** polish complete.

## Risks

- **`pagereveal`/`pageswap` browser support:** Chrome 125+; Safari/Firefox lag. We use `pagehide` (universal) as the write side, and a synchronous inline script on the destination as the read side — both work without those events.
- **Inline-script timing:** The script must run *before* the browser snapshots old/new for the transition. Placing it at the very top of `<head>` (before stylesheets) guarantees it runs synchronously on parse.
- **`vt-home` collisions:** apply only on home page (Liquid-conditional) to avoid `<body>` carrying the name everywhere.
- **Scanner via mask on pseudo-element:** untested combination. If `mask-image` doesn't animate on `::view-transition-*`, fall back to two stacked elements (mask new, inverse-mask old) or accept a global crossfade with a gradient overlay element.
- **`object-fit: cover`** on hero `<img>` interacts with VT: snapshot is of the rendered box, so cover should be preserved.

## Out of scope

- Mobile-specific transitions.
- Non-VT browsers (degrade to instant nav).
- Card→hero morph (removed).
- Image pipeline, Tailwind build, prefetch tuning.
