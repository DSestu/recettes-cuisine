# SPEC — Desktop "recipes per row" selector

## 1. Objective

Let desktop users choose how many recipe cards appear per row on the homepage (`index.html`) and the advanced search page (`recherche.html`). Mobile layout stays untouched.

## 2. User-facing behaviour

- A **segmented button group** at the top of each page lets the user pick **2 / 3 / 4 / 5** columns. Default: **4**.
- The control is **visible only on desktop** (Tailwind `hidden md:flex`). Mobile layout (`grid-cols-2`) is never affected.
- The choice is reflected in the **URL query parameter `?cols=N`** (N ∈ {2,3,4,5}). Reloads and shared links restore the chosen layout.
- Switching values updates the grid live without a reload and rewrites the URL via `history.replaceState`.
- Invalid / missing `cols` value falls back to the default (4). Values outside {2,3,4,5} are ignored.

## 3. Scope of grids affected

- **`index.html`**: every category grid built in `assets/js/home.js` (currently `grid-cols-2 md:grid-cols-3 gap-4 md:gap-6` at lines 70 and 93).
- **`recherche.html`**: `#results-grid` (line 835) and `#reco-grid` (line 843), both currently `grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`.

Mobile classes (`grid-cols-2`, gaps) remain unchanged on all grids.

## 4. UI design — segmented control

- Container: `hidden md:flex items-center gap-2` placed near the top of each page (homepage: in the toolbar row already at `index.html:72`; search page: in the "Résultats" header row near `recherche.html:828`).
- Small grid icon + sr-only label ("Colonnes").
- Buttons: pill-shaped segmented group styled with the existing primary palette:
  - Inactive: `px-3 py-1 text-sm rounded-md text-red-900/70 hover:bg-primary/10`
  - Active: `bg-primary text-white shadow-sm`
  - Group wrapper: `inline-flex rounded-lg border border-primary/30 bg-white/70 backdrop-blur p-0.5`
- Each button has `aria-pressed`, `data-cols="N"`, and `aria-label="Afficher N colonnes"`.

## 5. Implementation approach

Tailwind classes are statically extracted at build time, so string-interpolated `md:grid-cols-${n}` won't work. Two options:

- **A. Safelist** the five exact class names and swap them via JS.
- **B. CSS custom property** `--cols` on each affected grid: a small rule `@media (min-width: 768px) { [data-cols-grid] { grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)) } }`. Tailwind classes stay; only the variable changes.

Default to **B** (one source of truth, no safelist drift). Tag each affected grid with `data-cols-grid` and let the controller write `style.setProperty('--cols', N)`.

## 6. Shared module

- Add `assets/js/cols-selector.js` exposing `initColsSelector({ mountId, gridSelector, defaultCols })`. Both pages call it on `DOMContentLoaded`.
- Resolution order: URL `?cols=` → default (4).
- On change: update each grid's `--cols`, refresh active button state, `history.replaceState` with the new `?cols=`.
- On the homepage, grids are created dynamically by `home.js` after the categories render — the selector must (a) initialise existing grids and (b) re-apply on a `MutationObserver` or be called by `home.js` after grids are appended. Simplest: have `home.js` add `data-cols-grid` directly when building each grid, then call `initColsSelector` after that loop.

## 7. Boundaries

- **Always:** keep mobile layout exactly as today; keep user-visible text in French; follow existing Tailwind / palette conventions; minimal changes (no refactor of `home.js` or `search-page.js` beyond what's needed).
- **Ask first:** before introducing localStorage, changing card aspect ratios / gaps, or touching the `md` breakpoint.
- **Never:** modify recipe content, change default category ordering, alter search/filter logic, or add new dependencies.

## 8. Acceptance criteria

- [ ] Visiting `/` with no query param renders 4 columns on desktop (≥768px) and 2 on mobile.
- [ ] Clicking 2 / 3 / 5 updates both the visible layout and the URL (`?cols=N`) without reload.
- [ ] Reloading `?cols=5` restores 5 columns immediately (no flash of 4-column).
- [ ] `/recherche/?cols=2` renders both `#results-grid` and `#reco-grid` at 2 columns on desktop.
- [ ] Resizing below 768px always falls back to the existing 2-column mobile layout regardless of `?cols`.
- [ ] The segmented control is invisible below 768px.
- [ ] No regression in tag filters, search input, category sections, or D3 graph.

## 9. Testing

- Manual: run the project's Jekyll build, exercise each option on both pages at desktop and mobile viewports.
- A11y spot-check: `aria-pressed` reflects active option; control reachable by keyboard.
