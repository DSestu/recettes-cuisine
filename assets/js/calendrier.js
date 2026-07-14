(function () {
  "use strict";

  const statusEl = () => document.getElementById("calendrier-status");
  const rootEl = () => document.getElementById("calendrier-root");

  async function loadData(root) {
    const [indexRes, seasonRes] = await Promise.all([
      fetch(root.dataset.urlIndex),
      fetch(root.dataset.urlSeasonality),
    ]);
    if (!indexRes.ok) throw new Error(`ingredient_index.json → ${indexRes.status}`);
    if (!seasonRes.ok) throw new Error(`seasonality.json → ${seasonRes.status}`);
    return {
      index: await indexRes.json(),
      seasonality: await seasonRes.json(),
    };
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const status = statusEl();
    const root = rootEl();
    if (!status || !root) return;

    try {
      const { index, seasonality } = await loadData(root);
      const nIngredients = Object.keys(seasonality).length;
      const nRecipes = Object.keys(index.recipes).length;
      const withRecipes = Object.values(index.ingredients)
        .filter((v) => v.recipes.length > 0).length;

      console.log(`[calendrier] ingredients=${nIngredients} recipes=${nRecipes} with_recipes=${withRecipes}`);
      status.textContent = `${nIngredients} ingrédients, ${nRecipes} recettes indexées (${withRecipes} ingrédients avec au moins une recette).`;

      // TODO T4: render Gantt into #calendrier-root.
      window.__calendrier = { index, seasonality };
    } catch (err) {
      console.error("[calendrier] load failed", err);
      status.textContent = `Erreur de chargement : ${err.message}`;
      status.classList.add("text-red-700");
    }
  });
})();
