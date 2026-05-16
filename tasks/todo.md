# TODO — "Recettes utilisant ce composant"

Single vertical slice. See `tasks/plan.md` for full context.

- [x] **T1** — Add Liquid block in `_layouts/recipe.html` (insert ~L530, between "Recherche similaires" and the `{% if page.directions.size > 0 %}` description block) that:
  - Gates on `{% if page.collection == "components" %}` (fallback: `page.url contains "/components/"`).
  - Iterates `site.recipes`, keeps those where `r.components contains page.title`.
  - If non-empty, sorts by title and renders `<h2>Recettes utilisant ce composant</h2>` + card grid matching the Suggestions visual (`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`, `aspect-video` canvas with `images/cards/<slug>.webp` background, title `<h1>` below, hover scale/rotate).
  - If empty, renders nothing.
- [ ] **Checkpoint** — run `bundle exec jekyll build`, then `jekyll serve`; verify:
  - [ ] `/components/sauce_orange/` shows the new section with the parent recipe card.
  - [ ] A component page with no parent shows no section (heading string absent in HTML).
  - [ ] Any recipe page is visually unchanged.
  - [ ] No new build warnings or Liquid errors.
- [ ] Present diff to user for review. Do not commit.
