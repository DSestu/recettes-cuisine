# Todo — "En ce moment" & "Ça arrive / Dernière chance"

Feature spec: `SPEC.md`. Detailed plan: `tasks/plan.md`.

## Phase 1 — Data

- [ ] **T1** — Quinzaine math + `bucketsFor(seasonality, nowAbsIdx)` in `assets/js/calendrier.js`. Reuse `TOKEN_RE`, `MONTHS`, `parseSeason`. Handle Dec→Jan wrap. Expose dev hook on `window.__calendrier.__buckets`.

## Phase 2 — Walking skeleton

- [ ] **T2** — Add `<section id="calendrier-now">` above `#calendrier-controls-mount` in `calendrier.html`; empty bucket titles; inline `<style>`. Add `renderNowSection` stub called from `DOMContentLoaded` after `loadData`.

## Phase 3 — First shippable slice (→ CP-A)

- [ ] **T3** — Render chips from `bucketsFor` output. `<a>` chips, category dot, name, proximity tag. `peak` filled, `start`/`end` outlined+hatched. Sort by `distance` then locale id. Empty-bucket placeholder.
- [ ] **CP-A** — Screenshot at today's date. Confirm bucket membership against `seasonality.json` spot-check.

## Phase 4 — Interactivity (→ CP-B)

- [ ] **T4** — `buildNowUrl(id)` → `/recherche/?mode=tag&tags=<id>&inf=0&mt=0` with baseurl. Set `href` on chips.
- [ ] **T5** — Category filter toolbar. Union of categories across three buckets in `CATEGORY_ORDER`. Persist hidden set to `localStorage["calendrier.now.categoryFilters"]`. Re-render on toggle.
- [ ] **T6** — Collapse toggle with `aria-expanded`, `aria-controls`. `max-height` animation, 220 ms. Respect `prefers-reduced-motion`. Persist `localStorage["calendrier.now.collapsed"]`.
- [ ] **CP-B** — Demo click / filter / collapse. Reload → state restored. Reduced-motion emulation → instant.

## Phase 5 — Testing affordance

- [ ] **T7** — `?now=YYYY-MM-DD` override in `computeNowQuinzaine`. Console info when active. Invalid dates ignored.

## Phase 6 — Polish (→ CP-C)

- [ ] **T8** — Mobile stacking, keyboard order + focus rings, warm French empty-copy, section `aria-label`, remove one decorative element.
- [ ] **CP-C** — Full manual pass: desktop, mobile, keyboard-only, reduced-motion, Dec→Jan wrap via `?now=2026-12-20` and `?now=2026-01-05`.

## Definition of done

- All chips at today's date match expectation.
- Chip click reaches `/recherche/` with correct tag + zero tolerance.
- Filter and collapse state persist across reload; no URL pollution.
- Reduced-motion respected.
- No console errors or warnings.
- Existing calendar behavior unchanged (regression check).
