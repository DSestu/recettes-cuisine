# SPEC — Page Transitions Redesign

Replaces the current card→hero shared-element morph with a deliberate, choreographed transition system. **Desktop only**; mobile spec will follow.

## 1. Objective

Make navigation feel intentional and theatrical: distinct, recognizable motions per route pair, easing out (decelerating) so the destination "settles" instead of arriving abruptly. Each transition tells the user *where* they came from and *where* they're going.

## 2. Page taxonomy

Three logical pages:

- **Home** — `/` (recipe grid)
- **Search** — `/recherche.html` (advanced D3 search)
- **Recipe** — any `/_recipes/*` page

## 3. Transition matrix

| From → To | Effect |
|---|---|
| Home → Recipe | **Closing curtains**: hero image slides in from left edge; recipe content column slides in from right edge. Home stays in place underneath. |
| Search → Recipe | Same as Home → Recipe. |
| Recipe → Home | **Opening curtains** (reverse): hero slides out to the left, recipe column slides out to the right, revealing Home underneath. Home stays in place (no slide-in). |
| Recipe → Search | Same opening-curtains effect, revealing Search. Search stays in place. |
| Recipe → Recipe | **Scanner crossfade** on the hero image (top→bottom soft gradient wipe) + **global crossfade** on the right content column. Both run simultaneously. No curtains. |
| Home → Search | **Single big curtain**: Home slides off to the left, revealing Search underneath. |
| Search → Home | Reverse: Home slides in from the left, covering Search. |
| Direct load → any | Plain global fade-in (no curtain). |

## 4. Motion design

- **Easing**: ease-out (decelerating). Suggested curve `cubic-bezier(0.22, 1, 0.36, 1)`. Not linear.
- **Default duration**: 500ms for curtain motions, 400ms for crossfades. Tunable via CSS custom properties. Scanner duration to be iterated on after first pass.
- **Scanner gradient**: soft band (not a hard wipe) moving top→bottom across the hero. Implementation hint: `mask-image` linear-gradient whose `mask-position` animates. Soft transition zone ~15–25% of the hero height.
- **Curtains are not overlays**: the *actual* hero image and the *actual* right column slide as content blocks. No solid-color panel.
- **Underneath page stays put**: Home does not animate on Home→Recipe (only the incoming Recipe slides over it). Home does not animate on Recipe→Home either (only the outgoing Recipe slides off). Same for Search.
- **Reduced-motion**: `prefers-reduced-motion: reduce` → all effects collapse to a 1ms swap.

## 5. Technical approach

Built on the existing cross-document **View Transitions API** (`@view-transition { navigation: auto }`). No new library.

- Shared regions tagged with stable `view-transition-name`:
  - `vt-hero` on the hero image element (recipe pages).
  - `vt-content` on the recipe right column wrapper.
  - `vt-page` on `<body>` or main wrapper of Home/Search for the single-curtain effect.
- Per-route-pair CSS keyframes target `::view-transition-old(...)` and `::view-transition-new(...)` of each named group.
- Direction (which choreography to play) is determined by the **destination** page kind on the new document + the **origin** page kind, stored via a small `sessionStorage` hint set on the outgoing page before navigation (referrer is unreliable cross-doc).
- Page-kind encoded as `data-page-kind` attribute on `<html>` (`home` | `search` | `recipe`).
- On `pageswap` (outgoing), write `sessionStorage.fromKind = currentKind`. On `pagereveal` (incoming, before transition starts), read it and set `data-from-kind` on `<html>`.
- CSS keys off both: `html[data-page-kind="recipe"][data-from-kind="home"] ::view-transition-new(vt-hero) { … }`.
- If `data-from-kind` is missing (direct load, no sessionStorage): fall back to `default-fade` rule.

## 6. Files in scope

- `assets/css/transitions.css` — rewrite. All keyframes, per-route-pair selectors, custom properties for durations/easing.
- `assets/js/transitions.js` — keep the URL preload helper; replace morph plumbing with the page-kind handshake (`sessionStorage` + `<html data-from-kind>` via `pageswap`/`pagereveal`).
- `_includes/head.html` — add `data-page-kind` to `<html>` (Liquid switch on `page.layout` / `page.url`).
- `_layouts/recipe.html` — remove `view-transition-name: vt-<slug>` from the hero; replace with `view-transition-name: vt-hero`; add `view-transition-name: vt-content` to the right column wrapper.
- `assets/js/home.js`, `assets/js/search-page.js` — stop stamping per-recipe `viewTransitionName` on cards (morph is gone). Cards remain untagged.

## 7. Out of scope

- Mobile / small-screen behavior (separate spec).
- Browsers without View Transitions support — fall through to default browser nav.
- Image asset pipeline, prefetch/preload, Tailwind build.
- Card→hero shared-element morph (fully removed).

## 8. Acceptance criteria

1. Home → Recipe: hero slides in from left, content from right, both decelerating; Home visible underneath until covered.
2. Recipe → Home (browser back or link): hero slides off left, content slides off right; Home appears revealed (not animated).
3. Recipe → Recipe: hero crossfades top-down with visible scanner band while right column crossfades globally; both finish together.
4. Home → Search: Home slides left off-screen, Search revealed underneath (not animated).
5. Search → Home: Home slides in from left, covering Search (Search not animated).
6. Search → Recipe: same as Home → Recipe.
7. Recipe → Search: same opening-curtains reveal as Recipe → Home.
8. Direct load (no `sessionStorage.fromKind`): plain fade-in, no curtain.
9. `prefers-reduced-motion: reduce`: all effects 1ms.
10. No regression in image load perf (heroes stay WebP, preloaded on hover).

## 9. Boundaries

**Always:**
- Use ease-out curve `cubic-bezier(0.22, 1, 0.36, 1)` (or equivalent) on every animation.
- Honor `prefers-reduced-motion`.
- Keep the View Transitions API as the substrate (no Swup, no manual JS animation).
- Degrade to instant native nav if JS or VT is unavailable.

**Ask first:**
- Changing durations beyond proposed defaults.
- Adding a transition for a route pair not in §3.
- Mobile / small-screen behavior.

**Never:**
- Re-introduce the card→hero morph.
- Animate the underlying page when it's supposed to stay put.
- Use linear easing.
- Block navigation waiting on JS.

## 10. Verification

- Manual walk-through of all 10 acceptance scenarios in Chrome desktop.
- DevTools → Animations panel to confirm curves and durations.
- Toggle `prefers-reduced-motion` and re-verify scenarios collapse to instant.
- Hard-reload between scenarios to confirm direct-load fallback.
