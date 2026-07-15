# Plan — "En ce moment" & "Ça arrive / Dernière chance"

Source spec: `SPEC.md`. Target files: `calendrier.html`, `assets/js/calendrier.js`.

## Dependency graph

```
[T1] quinzaine math + bucket computation  (pure functions)
        │
        ▼
[T2] section skeleton in HTML + JS mount point
        │
        ▼
[T3] render buckets + chips from T1 output   ← first vertical slice ships here (CP-A)
        │
        ├──▶ [T4] chip click → /recherche/?tags=…&tol=0
        ├──▶ [T5] category filter toolbar (localStorage)
        └──▶ [T6] collapse toggle (localStorage, prefers-reduced-motion)  ← CP-B
                    │
                    ▼
              [T7] dev-only ?now=YYYY-MM-DD override
                    │
                    ▼
              [T8] polish: mobile, a11y, empty-bucket copy               ← CP-C
```

Every task after T2 is a complete vertical slice: DOM + JS + CSS + manual verification. No horizontal layers.

## Slicing rationale

- **T1** is isolated pure logic, testable in the browser console before any UI exists — cheapest failure surface.
- **T2 → T3** is the walking skeleton: mount → data → render. Unblocks visual iteration.
- **T4–T6** are independent add-ons after T3; sequenced for review sanity, not technical dependency.
- **T7** is a testing affordance for T1's wrap-around correctness, added once the visible surface is real.
- **T8** is the "remove one accessory" pass — nothing structural.

## Checkpoints

- **CP-A** after **T3** — static screenshot on `/calendrier/` at today's date; confirm bucket membership matches expectation before adding interactivity.
- **CP-B** after **T6** — interaction demo (click, filter, collapse) + reload persistence.
- **CP-C** after **T8** — full desktop + mobile pass, keyboard nav, reduced-motion, Dec→Jan wrap via `?now=`.

Human review at each checkpoint before proceeding.

---

## T1 — Quinzaine math and bucket computation

**Scope:** Pure helpers inside the existing IIFE in `assets/js/calendrier.js`:

- `computeNowQuinzaine(dateOverride?)` — returns `{ monthIdx, half, absIdx }` where `absIdx = monthIdx*2 + (half-1)`. Extends the existing `currentQuinzaineIdx()`.
- `bucketsFor(seasonality, nowAbsIdx)` — returns `{ incoming, current, leaving }`; each item `{ id, category, intensity, distance }` where `distance` is quinzaines to the state boundary (0 for current, 1 or 2 for incoming/leaving). Rules from `SPEC.md §3`. Wrap Dec→Jan via `(absIdx + k) % 24`.

**Acceptance:**
- At 2026-07-15 (`absIdx = 13`, `jul-2`), `current` includes `abricot`, `anchois`, `ail nouveau`; `incoming` includes ingredients with first `start` at `aug-1` or `aug-2`; `leaving` includes any `end` at `jul-2`, `aug-1`, `aug-2`.
- `computeNowQuinzaine(new Date("2026-12-20"))` → `absIdx = 23`; `incoming` correctly finds January `start` tokens.
- Reuses `TOKEN_RE`, `MONTHS`, `parseSeason` — no duplicates.

**Verify:** in browser console, `window.__calendrier.__buckets(new Date("2026-07-15"))` returns the expected shape. Dev-only export.

---

## T2 — Section skeleton + mount

**Scope:**
- `calendrier.html`: insert `<section id="calendrier-now">` immediately above `#calendrier-controls-mount`, with the three empty `.now-bucket` children as defined in `SPEC.md §4`.
- `assets/js/calendrier.js`: `renderNowSection(seasonality, mountEl)` stub that clears the mount and inserts placeholder headings. Wire into the existing `DOMContentLoaded` handler right after `loadData` resolves, before `renderGantt`.
- Inline `<style>` in `calendrier.html` (matches the sticky-header pattern already there) for section container, three-column grid, bucket headings only.

**Acceptance:** Section renders with three empty bucket titles above the calendar. No interactivity. Existing calendar unchanged.

**Verify:** `bundle exec jekyll serve`, load `/calendrier/`, visual confirmation.

---

## T3 — Render buckets + chips (first shippable slice) — **CP-A**

**Scope:**
- `renderNowSection` consumes T1's `bucketsFor` output.
- Chip DOM: `<a>` (not `<button>`) so keyboard/right-click behave naturally, with category dot span, name, and proximity tag. Href stubbed to `#` for now.
- Chip visuals: filled background for `peak`, outlined + hatched dot for `start`/`end`. Reuse `CATEGORY_COLORS`.
- Sort each bucket by `distance` ascending, then by `id` (French locale).
- Empty bucket → short French placeholder ("Rien de nouveau cette quinzaine.").

**Acceptance:**
- All three buckets populated at today's date.
- `end` ingredients appear in both `current` and `leaving`.
- Chip visual reflects intensity.
- No JS console errors.

**Verify:** Spot-check "En ce moment" chips against `seasonality.json` for `jul-2`. Screenshot for review at CP-A.

---

## T4 — Chip navigation

**Scope:** Set `href` on each chip via `buildNowUrl(id)` mirroring `buildSearchUrl([id], false)` — `mode=tag&tags=<id>&inf=0&mt=0`. Zero tolerance == `inf=0&mt=0` matches the existing row-click contract.

**Acceptance:** Clicking any chip navigates to `/recherche/?mode=tag&tags=<id>&inf=0&mt=0` (with `baseurl` prefix); results page filters to that ingredient.

**Verify:** Manual click on one chip from each bucket.

---

## T5 — Category filter toolbar

**Scope:**
- Compact toolbar in section header: one toggle per category present in the *combined* set of chips (union across the three buckets). Iteration follows `CATEGORY_ORDER`.
- Button = category dot + label + count. `aria-pressed` reflects state. Default: all active.
- Toggling re-renders chips only (hide/show, no data recompute).
- Persist to `localStorage["calendrier.now.categoryFilters"]` as JSON array of hidden category ids. Restore on load.
- No URL change.

**Acceptance:** Hiding `viande` removes viande chips from all three buckets; calendar below untouched. Reload preserves hidden state.

**Verify:** Toggle each category, reload, DevTools → LocalStorage.

---

## T6 — Collapse toggle — **CP-B**

**Scope:**
- Button in section header, `aria-expanded` + `aria-controls`. Text: "Réduire" ↔ "Développer".
- Animate `max-height` on `.now-body`; 220 ms ease-out.
- `prefers-reduced-motion: reduce` → `transition: none`.
- Persist `localStorage["calendrier.now.collapsed"]` (`"1"` / `"0"`). Default expanded.
- Identical on desktop and mobile.

**Acceptance:** Toggle collapses/expands the body. Reload preserves state. Reduced-motion instant. Focus ring visible.

**Verify:** Toggle at both breakpoints; DevTools reduced-motion emulation; reload.

---

## T7 — Dev-only `?now=YYYY-MM-DD` override

**Scope:** In `computeNowQuinzaine`, honour `new URLSearchParams(location.search).get("now")` when present and parseable. `console.info` when active. Not documented in UI.

**Acceptance:** `?now=2026-12-20` shifts buckets to that date. `?now=2026-01-05` covers wrap. Invalid dates ignored → real "now".

**Verify:** Two manual URLs; confirm year boundary works.

---

## T8 — Polish & a11y — **CP-C**

**Scope:**
- Mobile (<768px): stacks vertically, chips wrap, no horizontal scroll.
- Keyboard: `Tab` reaches toolbar → collapse → chips in order. Focus rings visible.
- Empty-bucket copy: warm French ("Pas de nouveaux ingrédients cette quinzaine." / "Rien ne s'en va bientôt.").
- `aria-label` on section root ("Aperçu de la saison actuelle").
- Chanel pass: cut one decorative element that doesn't earn its keep.

**Acceptance:** Mobile screenshot clean. Keyboard walkthrough works. No console warnings.

**Verify:** Manual pass at both breakpoints + keyboard-only.

---

## Out of scope (explicit)

- Changes to `_data/` or `scripts/`.
- Changes to the `/recherche/` URL contract.
- Build-time snapshot of "now".
- Server-side rendering of the section.
- Analytics/telemetry.
