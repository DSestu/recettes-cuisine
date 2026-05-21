# React Migration — Task List

## Phase 1: Foundation
- [ ] T1: Scaffold `app/` (Vite + React + TS + Tailwind, base='/recettes-cuisine/', strict TS)
- [ ] T2: TypeScript types + data loaders (all 85 recipes + 22 components parsed)

### Checkpoint 1
- [ ] `npm run build` exits 0, `npx tsc --noEmit` exits 0, all recipes parse

## Phase 2: Shell & Navigation
- [ ] T3: App shell + Nav component (HashRouter stubs, mobile bottom bar, desktop sidebar)
- [ ] T4: Framer Motion page transitions (home↔recipe, fade for others)

### Checkpoint 2
- [ ] Navigate between 3 stub pages with transitions, nav correct on mobile + desktop

## Phase 3: Home Page
- [ ] T5: RecipeCard component (thumbnail, title, tags, hover, view-transition-name)
- [ ] T6: HomePage (categories, CategorySection, ColsSelector, others section)
- [ ] T7: HomeSearch hook (fuzzy match, subsequence, result count, Cmd+F)

### Checkpoint 3
- [ ] All 85 recipes in correct categories, search filters correctly, Lighthouse ≥ current

## Phase 4: Recipe Detail Page
- [ ] T8: RecipePage (two-panel layout, hero, ingredients, Markdown + YAML directions)
- [ ] T9: ComponentComposition (inline sub-recipe rendering)
- [ ] T10: QR modal + image zoom lightbox

### Checkpoint 4
- [ ] All 85 recipes render, mobile scroll correct, home→recipe→home transition works

## Phase 5: Search Page
- [ ] T11: Search algorithm hooks (port from search-page.js, Vitest unit tests)
- [ ] T12: D3ForceGraph React component (D3 owns ref subtree)
- [ ] T13: SearchPage UI (tag filter, tolerance, ingredient mode, results + reco grids)

### Checkpoint 5
- [ ] Search results match current site, all Vitest tests pass

## Phase 6: PWA, Meta, Deployment
- [ ] T14: PWA (service worker + manifest in public/)
- [ ] T15: Per-recipe OG/Twitter meta tags (useDocumentMeta hook)
- [ ] T16: GitHub Actions deploy workflow (push main → gh-pages)

### Checkpoint 6 — PARITY CONFIRMED
- [ ] Live on GitHub Pages, all 85 recipes accessible, PWA installable
- [ ] Human sign-off → Jekyll cleanup commit

## Phase 7: Phase 2 Preparation
- [ ] T17: Zustand stores — cart, owned, favorites (persist middleware, Vitest tests)
