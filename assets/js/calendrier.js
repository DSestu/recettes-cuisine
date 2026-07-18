(function () {
  "use strict";

  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const MONTH_LABELS_FR = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

  const CATEGORY_ORDER = [
    "legume", "fruit", "herbe", "champignon",
    "poisson", "coquillage", "viande", "fromage", "autre",
  ];
  const CATEGORY_LABELS = {
    fruit: "Fruits",
    legume: "Légumes",
    herbe: "Herbes",
    champignon: "Champignons",
    poisson: "Poissons",
    coquillage: "Coquillages",
    viande: "Viandes",
    fromage: "Fromages",
    autre: "Autres",
  };
  const CATEGORY_COLORS = {
    fruit: "#e11d48",
    legume: "#16a34a",
    herbe: "#65a30d",
    champignon: "#a16207",
    poisson: "#0284c7",
    coquillage: "#0891b2",
    viande: "#b91c1c",
    fromage: "#ca8a04",
    autre: "#78716c",
  };
  // `peak` = solid category color. `start` / `end` = diagonal hatch pattern.
  const HATCH_INTENSITIES = new Set(["start", "end"]);

  const TOKEN_RE = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-([12]):(start|peak|end)$/;

  // Wide-mode cell width — scaled per viewport. Desktop gets a much larger
  // cell for detailed inspection; mobile gets a modest widening to stay
  // scrollable without being unmanageable.
  const WIDE_CELL_W_BASE = 56;
  const WIDE_CELL_W_DESKTOP = WIDE_CELL_W_BASE * 2;   // 112 px per quinzaine
  const WIDE_CELL_W_MOBILE = WIDE_CELL_W_BASE * 0.5;  // 28 px per quinzaine

  const LAYOUT_URL_PARAM = "vue";

  function initialLayoutMode() {
    // URL wins so shared links land in the intended view.
    const fromUrl = new URLSearchParams(location.search).get(LAYOUT_URL_PARAM);
    if (fromUrl === "fit" || fromUrl === "wide") return fromUrl;
    // Viewport-based default takes priority over localStorage: layoutMode is
    // inherently device-dependent, and users should get the right default when
    // switching between desktop and mobile.
    return window.matchMedia && window.matchMedia("(max-width: 767px)").matches ? "wide" : "fit";
  }

  function writeLayoutModeToUrl(mode) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(LAYOUT_URL_PARAM, mode);
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    // Keep the sidebar/modal QR codes in sync with the current URL.
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  function initialCollapsedCategories() {
    try {
      const raw = localStorage.getItem("calendrier.collapsedCategories");
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    } catch (_) { /* ignore */ }
    return new Set();
  }

  function persistCollapsedCategories(set) {
    try {
      localStorage.setItem("calendrier.collapsedCategories", JSON.stringify([...set]));
    } catch (_) { /* ignore */ }
  }

  const EXPLORE_URL_PARAM = "explore";

  function initialShowExploratory() {
    const fromUrl = new URLSearchParams(location.search).get(EXPLORE_URL_PARAM);
    if (fromUrl === "1" || fromUrl === "0") return fromUrl === "1";
    try {
      const stored = localStorage.getItem("calendrier.showExploratory");
      if (stored === "1" || stored === "0") return stored === "1";
    } catch (_) { /* ignore */ }
    return false;
  }

  function writeExploreToUrl(on) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(EXPLORE_URL_PARAM, on ? "1" : "0");
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  const ING_URL_PARAM = "ing";
  function initialIngredientFilter() {
    try {
      const raw = new URLSearchParams(location.search).get(ING_URL_PARAM);
      return raw ? raw.trim().toLowerCase() : null;
    } catch (_) { return null; }
  }
  function writeIngredientFilterToUrl(id) {
    try {
      const url = new URL(window.location.href);
      if (id) url.searchParams.set(ING_URL_PARAM, id);
      else url.searchParams.delete(ING_URL_PARAM);
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  // Top-level page mode. `ingredients` = ingredient Gantt calendar (existing);
  // `recettes-de-saison` = ranked recipe list scored by seasonality (new).
  const AFFICHAGE_URL_PARAM = "affichage";
  const MODE_INGREDIENTS = "ingredients";
  const MODE_RECETTES = "recettes-de-saison";

  function initialAffichage() {
    const fromUrl = new URLSearchParams(location.search).get(AFFICHAGE_URL_PARAM);
    if (fromUrl === MODE_INGREDIENTS || fromUrl === MODE_RECETTES) return fromUrl;
    return MODE_INGREDIENTS;
  }

  function writeAffichageToUrl(mode) {
    try {
      const url = new URL(window.location.href);
      if (mode === MODE_INGREDIENTS) url.searchParams.delete(AFFICHAGE_URL_PARAM);
      else url.searchParams.set(AFFICHAGE_URL_PARAM, mode);
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  // Selected quinzaine for the "recettes de saison" mode. URL-persisted as
  // `?quinzaine=jul-2`; absent → current fortnight from new Date().
  const QUINZAINE_URL_PARAM = "quinzaine";
  const MONTH_LONG_FR = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];

  function parseQuinzaine(raw) {
    if (typeof raw !== "string") return null;
    const m = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-([12])$/.exec(raw.trim());
    if (!m) return null;
    return MONTHS.indexOf(m[1]) * 2 + (Number(m[2]) - 1);
  }

  function formatQuinzaine(idx) {
    const m = MONTHS[Math.floor(idx / 2)];
    return `${m}-${(idx % 2) + 1}`;
  }

  function formatQuinzaineLong(idx) {
    const half = idx % 2 === 0 ? "Première" : "Deuxième";
    const month = MONTH_LONG_FR[Math.floor(idx / 2)];
    return `${half} quinzaine de ${month}`;
  }

  function initialQuinzaine() {
    const raw = new URLSearchParams(location.search).get(QUINZAINE_URL_PARAM);
    const parsed = parseQuinzaine(raw);
    if (parsed !== null) return parsed;
    return null; // resolved to current at render time
  }

  function writeQuinzaineToUrl(idx, isDefault) {
    try {
      const url = new URL(window.location.href);
      if (isDefault) url.searchParams.delete(QUINZAINE_URL_PARAM);
      else url.searchParams.set(QUINZAINE_URL_PARAM, formatQuinzaine(idx));
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  // Temporal categories included in the seasonality scoring for the recipes
  // mode. URL-persisted as `?categories-saison=legumes,fruits,champignons,coquillages`
  // (French plural for legibility). Absent → default set (all except herbe /
  // viande / fromage); empty string → none.
  const CATS_SAISON_URL_PARAM = "categories-saison";
  const TEMPORAL_CATS_ORDER = [
    "legume", "fruit", "herbe", "champignon",
    "poisson", "coquillage", "viande", "fromage",
  ];
  // Categories active by default (no URL param). Herbes / Viandes / Fromages
  // start disabled — they rarely drive a dish's seasonality.
  const DEFAULT_CATS_SAISON_OFF = new Set(["herbe", "viande", "fromage"]);
  const defaultCategoriesSaison = () =>
    new Set(TEMPORAL_CATS_ORDER.filter((c) => !DEFAULT_CATS_SAISON_OFF.has(c)));
  const TEMPORAL_CAT_URL = {
    legume: "legumes",
    fruit: "fruits",
    herbe: "herbes",
    champignon: "champignons",
    poisson: "poissons",
    coquillage: "coquillages",
    viande: "viandes",
    fromage: "fromages",
  };
  const TEMPORAL_CAT_FROM_URL = Object.fromEntries(
    Object.entries(TEMPORAL_CAT_URL).map(([k, v]) => [v, k])
  );

  function initialCategoriesSaison() {
    const raw = new URLSearchParams(location.search).get(CATS_SAISON_URL_PARAM);
    if (raw === null) return defaultCategoriesSaison();
    // Empty string → deliberate empty state (all off).
    if (raw === "") return new Set();
    const out = new Set();
    for (const part of raw.split(",")) {
      const key = TEMPORAL_CAT_FROM_URL[part.trim()];
      if (key) out.add(key);
    }
    // No valid entries in a non-empty string → treat as malformed, fall back
    // to defaults so a shared bogus URL still loads a usable view.
    if (out.size === 0) return defaultCategoriesSaison();
    return out;
  }

  function writeCategoriesSaisonToUrl(set) {
    try {
      const url = new URL(window.location.href);
      const isDefault = set.size === TEMPORAL_CATS_ORDER.length &&
        TEMPORAL_CATS_ORDER.every((c) => set.has(c));
      if (isDefault) {
        url.searchParams.delete(CATS_SAISON_URL_PARAM);
      } else {
        const parts = TEMPORAL_CATS_ORDER
          .filter((c) => set.has(c))
          .map((c) => TEMPORAL_CAT_URL[c]);
        url.searchParams.set(CATS_SAISON_URL_PARAM, parts.join(","));
      }
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  // Whether _components/*.md entries are included alongside _recipes/*.md
  // in the ranked list. URL-persisted as `?inclure-composants=1`; absent or
  // `0` → off. Any other value treated as absent.
  const COMPOSANTS_URL_PARAM = "inclure-composants";

  function initialIncludeComponents() {
    const raw = new URLSearchParams(location.search).get(COMPOSANTS_URL_PARAM);
    return raw === "1";
  }

  function writeIncludeComponentsToUrl(on) {
    try {
      const url = new URL(window.location.href);
      if (on) url.searchParams.set(COMPOSANTS_URL_PARAM, "1");
      else url.searchParams.delete(COMPOSANTS_URL_PARAM);
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  const state = {
    showExploratory: initialShowExploratory(),
    layoutMode: initialLayoutMode(),
    collapsedCategories: initialCollapsedCategories(),
    filterIngredient: initialIngredientFilter(),
    affichage: initialAffichage(),
    quinzaineIdx: initialQuinzaine(), // null → current at render time
    activeSeasonCategories: initialCategoriesSaison(),
    includeComponents: initialIncludeComponents(),
  };

  // Toggle visibility of the two modes' DOM subtrees. Called on init and on
  // toggle click. Does not touch data loading or renderers.
  function renderMode() {
    // NB: #calendrier-controls-mount (the "Vue globale / Vue large" layout
    // toggle) stays visible in BOTH modes — the layout applies to whichever
    // calendar is shown. Only the ingredient-specific sections hide.
    const ingredientsSections = [
      document.getElementById("calendrier-now"),
      document.getElementById("calendrier-root"),
    ];
    const recipesSection = document.getElementById("calendrier-recipes");
    const showRecipes = state.affichage === MODE_RECETTES;
    for (const el of ingredientsSections) {
      if (!el) continue;
      el.hidden = showRecipes;
    }
    if (recipesSection) recipesSection.hidden = !showRecipes;

    const toggle = document.getElementById("calendrier-mode-toggle");
    if (toggle) {
      for (const btn of toggle.querySelectorAll(".cal-mode-btn")) {
        const active = btn.dataset.mode === state.affichage;
        btn.setAttribute("aria-selected", active ? "true" : "false");
      }
    }
  }

  // Re-hydrate all recipes-mode state from the current URL and re-render.
  // Called on back/forward navigation so the view always matches the URL.
  let rehydrateFromUrl = () => {};

  function setupModeToggle() {
    const toggle = document.getElementById("calendrier-mode-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".cal-mode-btn");
      if (!btn) return;
      const mode = btn.dataset.mode;
      if (mode !== MODE_INGREDIENTS && mode !== MODE_RECETTES) return;
      if (state.affichage === mode) return;
      state.affichage = mode;
      writeAffichageToUrl(mode);
      renderMode();
    });
    window.addEventListener("popstate", () => {
      const nextAffichage = initialAffichage();
      state.affichage = nextAffichage;
      state.quinzaineIdx = initialQuinzaine();
      state.activeSeasonCategories = initialCategoriesSaison();
      state.includeComponents = initialIncludeComponents();
      rehydrateFromUrl();
      renderMode();
    });
  }

  function currentQuinzaineIdx() {
    const now = new Date();
    return now.getMonth() * 2 + (now.getDate() <= 15 ? 0 : 1);
  }

  // Returns the fraction [0..1] of the day within its quinzaine.
  // Q1 spans days 1..15, Q2 spans days 16..last-of-month.
  function currentDayFractionInQuinzaine() {
    const now = new Date();
    const d = now.getDate();
    if (d <= 15) return (d - 1) / 15;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return (d - 16) / Math.max(1, lastDay - 15);
  }

  // Absolute quinzaine index [0..23] for a date. Q1 = days 1..15, Q2 = 16..end.
  // Dev override: `?now=YYYY-MM-DD` in the page URL shifts "now" for testing
  // seasonal transitions (e.g. Dec→Jan wrap). Not documented in the UI.
  let nowOverrideLogged = false;
  function computeNowQuinzaine(dateOverride) {
    let d = dateOverride instanceof Date && !isNaN(dateOverride) ? dateOverride : null;
    if (!d) {
      try {
        const raw = new URLSearchParams(location.search).get("now");
        if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
          const parsed = new Date(raw + "T12:00:00");
          if (!isNaN(parsed)) {
            d = parsed;
            if (!nowOverrideLogged) {
              console.info(`[calendrier] "now" overridden via ?now=${raw}`);
              nowOverrideLogged = true;
            }
          }
        }
      } catch (_) { /* ignore */ }
    }
    if (!d) d = new Date();
    const monthIdx = d.getMonth();
    const half = d.getDate() <= 15 ? 1 : 2;
    return { monthIdx, half, absIdx: monthIdx * 2 + (half - 1) };
  }

  // Groups ingredients into three buckets around `nowAbsIdx`:
  //   current  — has any token at nowAbsIdx (start/peak/end)
  //   incoming — no token at nowAbsIdx AND a `start` token at nowAbsIdx+1 or +2
  //   leaving  — an `end` token at nowAbsIdx, +1, or +2
  // `distance` is the number of quinzaines to the state boundary (0 for
  // current; 1 or 2 for incoming/leaving). Wrap Dec→Jan via mod 24.
  function bucketsFor(seasonality, nowAbsIdx) {
    const incoming = [];
    const current = [];
    const leaving = [];
    for (const [id, meta] of Object.entries(seasonality)) {
      const seasonMap = parseSeason(meta.season);
      const hereIntensity = seasonMap.get(nowAbsIdx);
      if (hereIntensity) {
        current.push({ id, category: meta.category, intensity: hereIntensity, distance: 0 });
      } else {
        for (const k of [1, 2]) {
          if (seasonMap.get((nowAbsIdx + k) % 24) === "start") {
            incoming.push({ id, category: meta.category, intensity: "start", distance: k });
            break;
          }
        }
      }
      for (const k of [0, 1, 2]) {
        if (seasonMap.get((nowAbsIdx + k) % 24) === "end") {
          leaving.push({ id, category: meta.category, intensity: "end", distance: k });
          break;
        }
      }
    }
    return { incoming, current, leaving };
  }

  function parseSeason(seasonStr) {
    const out = new Map();
    if (!seasonStr) return out;
    for (const tok of seasonStr.split(",")) {
      const t = tok.trim();
      if (!t) continue;
      const m = TOKEN_RE.exec(t);
      if (!m) continue;
      const monthIdx = MONTHS.indexOf(m[1]);
      const q = parseInt(m[2], 10) - 1;
      out.set(monthIdx * 2 + q, m[3]);
    }
    return out;
  }

  function displayName(id) {
    return id.charAt(0).toUpperCase() + id.slice(1);
  }

  // Build a `/recherche/` URL: tag-search mode with the given tag list and
  // either zero tolerance (single ingredient) or infinite (bulk / month).
  function buildSearchUrl(tags, infinite) {
    const root = document.getElementById("calendrier-root");
    const baseurl = root?.dataset.baseurl || "";
    const params = new URLSearchParams();
    params.set("mode", "tag");
    params.set("tags", tags.join(","));
    if (infinite) params.set("inf", "1");
    else { params.set("inf", "0"); params.set("mt", "0"); }
    return `${baseurl}/recherche/?${params.toString()}`;
  }


  // Wraps an ingredient name into up to two lines using <tspan>. Falls back to
  // ellipsis truncation on the last line if it still overflows (rare).
  function wrapIngredientName(textEl, name, maxWidth, lineH) {
    const node = textEl.node();
    const x = textEl.attr("x");

    function paint(line1, line2) {
      textEl.text(null);
      textEl.append("title").text(name);
      if (line2 == null) {
        textEl.append("tspan").attr("x", x).attr("dy", "0").text(line1);
      } else {
        textEl.append("tspan").attr("x", x).attr("dy", `-${lineH / 2}`).text(line1);
        textEl.append("tspan").attr("x", x).attr("dy", `${lineH}`).text(line2);
      }
    }

    // Fast path: single line fits.
    textEl.text(name);
    try {
      if (node.getComputedTextLength() <= maxWidth) {
        paint(name, null);
        return;
      }
    } catch (_) { paint(name, null); return; }

    // Try each word-break point; pick the first where both halves fit.
    const words = name.split(" ");
    if (words.length >= 2) {
      for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(" ");
        const b = words.slice(i).join(" ");
        textEl.text(a);
        const la = node.getComputedTextLength();
        textEl.text(b);
        const lb = node.getComputedTextLength();
        if (la <= maxWidth && lb <= maxWidth) {
          paint(a, b);
          return;
        }
      }
      // No clean split — halve the words and truncate the second half.
      const mid = Math.ceil(words.length / 2);
      const a = words.slice(0, mid).join(" ");
      let b = words.slice(mid).join(" ");
      textEl.text(b);
      while (b.length > 3 && node.getComputedTextLength() > maxWidth) {
        b = b.slice(0, -1);
        textEl.text(b + "…");
      }
      paint(a, textEl.text());
      return;
    }

    // Single word that overflows — ellipsis-truncate.
    let s = name;
    while (s.length > 3 && node.getComputedTextLength() > maxWidth) {
      s = s.slice(0, -1);
      textEl.text(s + "…");
    }
    paint(textEl.text(), null);
  }

  function buildRows(index, seasonality, forceAll) {
    const rows = [];
    for (const cat of CATEGORY_ORDER) {
      const ings = [];
      for (const [id, meta] of Object.entries(seasonality)) {
        if (meta.category !== cat) continue;
        const nRecipes = (index.ingredients[id]?.recipes || []).length;
        if (!forceAll && !state.showExploratory && nRecipes === 0) continue;
        ings.push({
          id,
          category: cat,
          seasonMap: parseSeason(meta.season),
          recipeCount: nRecipes,
        });
      }
      ings.sort((a, b) => a.id.localeCompare(b.id, "fr"));
      if (ings.length) rows.push({ category: cat, ingredients: ings });
    }
    return rows;
  }

  // When a single-ingredient filter is active, replace rows with a single flat
  // group containing only that ingredient (bypassing showExploratory so the
  // filter always wins).
  function applyIngredientFilter(rows, index, seasonality) {
    if (!state.filterIngredient) return rows;
    let found = null;
    for (const g of rows) {
      for (const ing of g.ingredients) {
        if (ing.id === state.filterIngredient) { found = { g, ing }; break; }
      }
      if (found) break;
    }
    if (!found) {
      const all = buildRows(index, seasonality, true);
      for (const g of all) {
        for (const ing of g.ingredients) {
          if (ing.id === state.filterIngredient) { found = { g, ing }; break; }
        }
        if (found) break;
      }
    }
    if (!found) return [];
    return [{ category: found.g.category, ingredients: [found.ing] }];
  }

  function renderGantt(container, rows) {
    // Preserve persistent overlays (ingredient filter) across re-renders.
    // Detach BEFORE the d3 wipe — `selectAll("*")` also picks up the filter's
    // internal children, and `.remove()` would strip them from the filter
    // subtree even though the filter itself is a detached reference.
    const persistentFilter = container.querySelector("#calendrier-ingredient-filter");
    if (persistentFilter && persistentFilter.parentNode) {
      persistentFilter.parentNode.removeChild(persistentFilter);
    }
    d3.select(container).selectAll("*").remove();
    const filterActive = !!state.filterIngredient && rows.length > 0;

    // Global max recipe count — used to scale the recipe data-bar width.
    let maxRecipes = 0;
    for (const g of rows) {
      for (const ing of g.ingredients) {
        if (ing.recipeCount > maxRecipes) maxRecipes = ing.recipeCount;
      }
    }
    if (maxRecipes < 1) maxRecipes = 1;

    const currentQ = currentQuinzaineIdx();
    // Rotate so the first column is the Q1 of the CURRENT month; the current
    // quinzaine is then at column 0 or 1, and the month header lines up cleanly.
    const displayStart = Math.floor(currentQ / 2) * 2;
    const displaySlots = Array.from({ length: 24 }, (_, i) => (displayStart + i) % 24);
    const currentDisplayCol = (currentQ - displayStart + 24) % 24;

    // Layout constants. On narrow viewports the data-bar AND the numeric
    // recipe count are dropped to reclaim horizontal space; font is smaller too.
    const isMobile = window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    const showRecipeBar = !isMobile;
    const showRecipeCount = !isMobile;
    const LABEL_PAD_R = 10;
    const BAR_W = showRecipeBar ? 60 : 0;
    const BAR_H = 9;
    const LABEL_W = isMobile ? 115 : 300;
    container.style.setProperty("--cal-label-w", LABEL_W + "px");
    const NAME_FONT = isMobile ? 12 : 14;
    const NAME_LINE_H = Math.round(NAME_FONT * 1.15);
    const BAR_X = LABEL_W - LABEL_PAD_R - BAR_W;
    const COUNT_X = showRecipeBar ? BAR_X - 6 : LABEL_W - LABEL_PAD_R;
    const NAME_MAX_X = showRecipeCount ? COUNT_X - 26 : LABEL_W - LABEL_PAD_R;
    const NAME_MAX_WIDTH = NAME_MAX_X - 14;
    const ROW_H = 34;
    const GROUP_HEADER_H = 38;
    // Hide the category header row when a single-ingredient filter is active.
    const HDR_H = filterActive ? 0 : GROUP_HEADER_H;
    const GROUP_GAP = 8;
    // Tall enough for rotated vertical month labels on narrow mobile screens.
    const MONTH_HEADER_H = isMobile && state.layoutMode === "fit" ? 60 : 40;
    const RIGHT_PAD = 14;

    const containerWidth = container.clientWidth || 900;
    let cellW, gridW, svgWidth;
    if (state.layoutMode === "wide") {
      cellW = isMobile ? WIDE_CELL_W_MOBILE : WIDE_CELL_W_DESKTOP;
      gridW = cellW * 24;
      svgWidth = LABEL_W + gridW + RIGHT_PAD;
    } else {
      // In fit mode we must not force a min grid width larger than the viewport
      // — that would cause the SVG to scale down uniformly (aspect ratio),
      // clipping rows below the scaled content on narrow screens.
      const minGrid = isMobile ? 24 * 14 : 24 * 22; // small floor to keep cells readable
      gridW = Math.max(minGrid, containerWidth - LABEL_W - RIGHT_PAD);
      cellW = gridW / 24;
      svgWidth = LABEL_W + gridW + RIGHT_PAD;
    }

    // Per-category layout with collapse state applied. Y coordinates are
    // relative to the BODY (excluding the month header row).
    function computeCatLayout() {
      const cats = [];
      let cy = 0;
      for (const g of rows) {
        // Category collapse is ignored while an ingredient filter is active —
        // the single-row view always shows the ingredient regardless.
        const collapsed = !filterActive && state.collapsedCategories.has(g.category);
        const fullContentH = g.ingredients.length * ROW_H;
        const contentH = collapsed ? 0 : fullContentH;
        cats.push({ ...g, y: cy, contentH, fullContentH, collapsed });
        cy += HDR_H + contentH + GROUP_GAP;
      }
      return { cats, bodyH: Math.max(1, cy - GROUP_GAP) };
    }
    let { cats: catLayout, bodyH } = computeCatLayout();

    // fullBodyH = height when ALL categories are expanded. The SVGs are
    // rendered at this size once and never resized; a wrapping `overflow:hidden`
    // container clips to the current bodyH. This way content never stretches.
    const fullBodyH = (() => {
      let cy = 0;
      for (const g of rows) {
        cy += HDR_H + g.ingredients.length * ROW_H + GROUP_GAP;
      }
      return Math.max(1, cy - GROUP_GAP);
    })();

    const rightWidth = svgWidth - LABEL_W; // = gridW + RIGHT_PAD

    // Split into two vertical bands. The outer container has NO overflow, so
    // `position: sticky; top: 0` on the top band binds to the WINDOW's scroll
    // and sticks to the viewport when the page scrolls down. Horizontal scroll
    // (wide mode) is confined to each band; a small JS sync keeps them aligned.
    const scrollWrap = d3.select(container).append("div")
      .style("display", "block")
      .style("width", "100%")
      .style("background", "#fff7ed")
      .style("position", "relative");

    // ---- Top band: month header (sticky top). ----
    const topWrap = scrollWrap.append("div")
      .style("position", "sticky")
      .style("top", "0")
      .style("z-index", "3")
      .style("background", "#fff7ed");
    if (state.layoutMode === "wide") {
      // Hidden scrollbar; we drive scrollLeft from JS to mirror the body's.
      topWrap.style("overflow-x", "hidden");
    }

    const topRow = topWrap.append("div")
      .style("display", "flex")
      .style("flex-direction", "row");
    if (state.layoutMode === "wide") {
      topRow.style("width", `${svgWidth}px`);
    } else {
      topRow.style("width", "100%");
    }

    // Sticky wrapper so the top-left cell (SVG + ingredient filter) stays
    // pinned to the left edge during horizontal scroll in wide mode.
    const topLeftHolder = topRow.append("div")
      .style("flex", `0 0 ${LABEL_W}px`)
      .style("position", "sticky")
      .style("left", "0")
      .style("z-index", "4")
      .style("background", "#fff7ed")
      .style("box-shadow", "2px 0 6px rgba(0,0,0,0.06)")
      .style("width", LABEL_W + "px")
      .style("height", MONTH_HEADER_H + "px");

    const topLeftSvg = topLeftHolder.append("svg")
      .attr("viewBox", `0 0 ${LABEL_W} ${MONTH_HEADER_H}`)
      .attr("width", LABEL_W).attr("height", MONTH_HEADER_H)
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block");
    topLeftSvg.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", LABEL_W).attr("height", MONTH_HEADER_H)
      .attr("fill", "#fff7ed");

    // Mount the persistent ingredient filter inside the sticky holder so it
    // stays anchored to the top-left corner during both vertical and
    // horizontal scrolls.
    if (persistentFilter) {
      topLeftHolder.node().appendChild(persistentFilter);
      persistentFilter.style.setProperty("--cal-label-w", LABEL_W + "px");
    }

    // Wrapper around topRightSvg so we can overlay HTML month labels on top
    // (needed for rotated text — SVG text distorts under preserveAspectRatio).
    const topRightHolder = topRow.append("div")
      .style("position", "relative")
      .style("height", MONTH_HEADER_H + "px");
    if (state.layoutMode === "wide") {
      topRightHolder
        .style("flex", `0 0 ${rightWidth}px`)
        .style("min-width", rightWidth + "px")
        .style("width", rightWidth + "px");
    } else {
      topRightHolder.style("flex", "1 1 auto");
    }

    const topRightSvg = topRightHolder.append("svg")
      .attr("viewBox", `0 0 ${rightWidth} ${MONTH_HEADER_H}`)
      .attr("height", MONTH_HEADER_H)
      .attr("preserveAspectRatio", "none")
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block")
      .style("width", "100%")
      .style("height", MONTH_HEADER_H + "px");

    // Month header cells + labels (top-right SVG).
    let col = 0;
    while (col < 24) {
      const monthIdx = Math.floor(displaySlots[col] / 2);
      let end = col;
      while (end < 24 && Math.floor(displaySlots[end] / 2) === monthIdx) end++;
      const w = (end - col) * cellW;
      topRightSvg.append("rect")
        .attr("x", col * cellW).attr("y", 0)
        .attr("width", w).attr("height", MONTH_HEADER_H)
        .attr("fill", monthIdx % 2 === 0 ? "#fff7ed" : "#ffedd5");
      // On mobile in "fit" mode, cells are too narrow for horizontal labels —
      // render labels as HTML overlays rotated with CSS. SVG text can't be
      // rotated cleanly here because preserveAspectRatio="none" stretches it.
      const rotateLabel = isMobile && state.layoutMode === "fit";
      const cx = col * cellW + w / 2;
      const label = MONTH_LABELS_FR[monthIdx];
      if (!rotateLabel) {
        topRightSvg.append("text")
          .attr("x", cx).attr("y", MONTH_HEADER_H / 2 + 6)
          .attr("text-anchor", "middle")
          .attr("fill", "#7c2d12")
          .attr("font-size", 15).attr("font-weight", 600)
          .text(label);
      } else {
        const leftPct = (cx / rightWidth) * 100;
        topRightHolder.append("div")
          .attr("class", "cal-month-label-rot")
          .style("position", "absolute")
          .style("left", leftPct + "%")
          .style("top", (MONTH_HEADER_H / 2) + "px")
          .style("transform", "translate(-50%, -50%) rotate(-90deg)")
          .style("transform-origin", "center center")
          .style("font-size", "12px")
          .style("font-weight", "600")
          .style("color", "#7c2d12")
          .style("white-space", "nowrap")
          .style("pointer-events", "none")
          .style("line-height", "1")
          .text(label);
      }
      col = end;
    }

    // ---- Body band: labels (sticky-left) + grid. ----
    // Two-layer wrapper: outer bodyWrap handles horizontal scroll + vertical
    // clipping (animated height); inner bodyRow holds the two SVGs at their
    // FULL height so accordion collapse just clips empty space at the bottom.
    // In wide mode a horizontal scrollbar appears at the bottom of bodyWrap
    // and eats into its height — reserve extra space so it doesn't overlap
    // the last calendar row.
    const scrollbarPad = state.layoutMode === "wide" ? 18 : 0;
    const bodyWrap = scrollWrap.append("div")
      .style("overflow-y", "hidden")
      .style("height", (bodyH + scrollbarPad) + "px")
      .style("transition", "height 320ms cubic-bezier(0.4, 0, 0.2, 1)");
    if (state.layoutMode === "wide") {
      bodyWrap
        .style("overflow-x", "auto")
        .style("-webkit-overflow-scrolling", "touch");
    }

    const bodyRow = bodyWrap.append("div")
      .style("display", "flex")
      .style("flex-direction", "row");
    if (state.layoutMode === "wide") {
      bodyRow.style("width", `${svgWidth}px`);
    } else {
      bodyRow.style("width", "100%");
    }

    // Horizontal-scroll sync: user scrolls bodyWrap, topWrap follows.
    if (state.layoutMode === "wide") {
      const bodyEl = bodyWrap.node();
      const topEl = topWrap.node();
      bodyEl.addEventListener("scroll", () => {
        if (topEl.scrollLeft !== bodyEl.scrollLeft) topEl.scrollLeft = bodyEl.scrollLeft;
      }, { passive: true });
    }

    const leftSvg = bodyRow.append("svg")
      .attr("viewBox", `0 0 ${LABEL_W} ${fullBodyH}`)
      .attr("width", LABEL_W).attr("height", fullBodyH)
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block")
      .style("flex", `0 0 ${LABEL_W}px`)
      .style("position", "sticky")
      .style("left", "0")
      .style("z-index", "2")
      .style("background", "#fff7ed")
      .style("box-shadow", "2px 0 6px rgba(0,0,0,0.06)");

    const rightSvg = bodyRow.append("svg")
      .attr("viewBox", `0 0 ${rightWidth} ${fullBodyH}`)
      .attr("height", fullBodyH)
      .attr("preserveAspectRatio", "none")
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block")
      .style("height", fullBodyH + "px");
    if (state.layoutMode === "wide") {
      rightSvg
        .attr("width", rightWidth)
        .style("flex", `0 0 ${rightWidth}px`)
        .style("min-width", rightWidth + "px");
    } else {
      rightSvg
        .attr("width", "100%")
        .style("flex", "1 1 auto");
    }

    // Hatch patterns (needed only in the body-right SVG where cells live).
    const defs = rightSvg.append("defs");
    for (const [cat, colr] of Object.entries(CATEGORY_COLORS)) {
      const p = defs.append("pattern")
        .attr("id", `calendrier-hatch-${cat}`)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 6).attr("height", 6)
        .attr("patternTransform", "rotate(45)");
      p.append("rect").attr("width", 6).attr("height", 6)
        .attr("fill", colr).attr("fill-opacity", 0.12);
      p.append("line")
        .attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 6)
        .attr("stroke", colr).attr("stroke-width", 2);
    }

    // Full-height decoratives use fullBodyH — the outer wrapper crops the
    // extra empty space during accordion collapse.
    rightSvg.append("rect")
      .attr("class", "cal-fullh-rect")
      .attr("x", currentDisplayCol * cellW).attr("y", 0)
      .attr("width", cellW).attr("height", fullBodyH)
      .attr("fill", "#f97316").attr("opacity", 0.10)
      .attr("pointer-events", "none");

    for (let c = 1; c < 24; c++) {
      const isBoundary = Math.floor(displaySlots[c] / 2) !== Math.floor(displaySlots[c - 1] / 2);
      if (!isBoundary) continue;
      rightSvg.append("line")
        .attr("class", "cal-fullh-line")
        .attr("x1", c * cellW).attr("x2", c * cellW)
        .attr("y1", 0).attr("y2", fullBodyH)
        .attr("stroke", "#fed7aa").attr("stroke-width", 1);
    }

    // clipPath defs per category / side — animate their rect height for accordion.
    // NB: rows are drawn inside a group translated by GROUP_HEADER_H, so the
    // clip rect must be anchored at y=GROUP_HEADER_H to actually overlap them.
    const clipDefs = leftSvg.append("defs");
    const clipDefsR = defs;
    for (const cat of catLayout) {
      clipDefs.append("clipPath").attr("id", `cal-clip-${cat.category}-l`)
        .append("rect")
        .attr("class", `cal-clip-rect-${cat.category}`)
        .attr("x", 0).attr("y", HDR_H).attr("width", LABEL_W).attr("height", cat.contentH);
      clipDefsR.append("clipPath").attr("id", `cal-clip-${cat.category}-r`)
        .append("rect")
        .attr("class", `cal-clip-rect-${cat.category}`)
        .attr("x", 0).attr("y", HDR_H).attr("width", rightWidth).attr("height", cat.contentH);
    }

    // --- Category groups: rendered inside <g transform="translate(0, y)">
    // so we can animate the transform + clip-path height on collapse/expand.
    for (const cat of catLayout) {
      const color = CATEGORY_COLORS[cat.category];

      // ----- LEFT side -----
      const leftCatG = leftSvg.append("g")
        .attr("class", `cal-cat cal-cat-${cat.category}`)
        .attr("data-cat", cat.category)
        .attr("transform", `translate(0, ${cat.y})`);

      if (!filterActive) {
        // Colored left "spine". Length encodes collapsed state: header-only
        // when collapsed, full category height when expanded.
        const barFullH = GROUP_HEADER_H + cat.contentH;
        leftCatG.append("rect")
          .attr("class", `cal-bar cal-bar-${cat.category}`)
          .attr("x", 0).attr("y", 0).attr("width", 4)
          .attr("height", cat.collapsed ? GROUP_HEADER_H : barFullH)
          .attr("fill", color)
          .attr("pointer-events", "none");

        // Header: clickable label row.
        const leftHdr = leftCatG.append("g")
          .attr("class", "cal-hdr")
          .attr("cursor", "pointer")
          .attr("role", "button")
          .attr("aria-label", `Replier ou déplier ${CATEGORY_LABELS[cat.category]}`)
          .style("user-select", "none")
          .on("click", () => toggleCategory(cat.category));
        leftHdr.append("rect")
          .attr("x", 4).attr("y", 0).attr("width", LABEL_W - 4).attr("height", GROUP_HEADER_H)
          .attr("fill", "#fff7ed");
        leftHdr.append("text")
          .attr("x", 14).attr("y", GROUP_HEADER_H / 2 + 6)
          .attr("fill", "#431407")
          .attr("font-size", isMobile ? 13 : 17).attr("font-weight", 700)
          .text(CATEGORY_LABELS[cat.category]);
      }

      // Rows wrapper — clipped so overflowing rows are hidden during animation.
      const leftRowsWrap = leftCatG.append("g")
        .attr("class", "cal-rows-wrap")
        .attr("clip-path", `url(#cal-clip-${cat.category}-l)`);
      const leftRows = leftRowsWrap.append("g")
        .attr("class", "cal-rows")
        .attr("transform", `translate(0, ${HDR_H})`);

      // ----- RIGHT side -----
      const rightCatG = rightSvg.append("g")
        .attr("class", `cal-cat cal-cat-${cat.category}`)
        .attr("data-cat", cat.category)
        .attr("transform", `translate(0, ${cat.y})`);

      // Header row on the right side is left transparent so the current
      // quinzaine highlight and month divider lines stay continuous across
      // category boundaries.

      const rightRowsWrap = rightCatG.append("g")
        .attr("class", "cal-rows-wrap")
        .attr("clip-path", `url(#cal-clip-${cat.category}-r)`);
      const rightRows = rightRowsWrap.append("g")
        .attr("class", "cal-rows")
        .attr("transform", `translate(0, ${HDR_H})`);

      // ----- Ingredient rows (yLocal starts at 0 inside cal-rows). -----
      let yLocal = 0;
      for (const ing of cat.ingredients) {
        const clickable = ing.recipeCount > 0;
        const labelG = leftRows.append("g")
          .attr("class", "calendrier-row")
          .attr("data-ingredient", ing.id)
          .attr("cursor", clickable ? "pointer" : "default")
          .attr("role", clickable ? "link" : null)
          .attr("aria-label", clickable ? `Recettes utilisant ${displayName(ing.id)}` : null);
        if (clickable) {
          labelG.on("click", () => {
            window.location.href = buildSearchUrl([ing.id], false);
          });
          // Transparent hit rect so clicks land anywhere along the row.
          labelG.append("rect")
            .attr("x", 0).attr("y", yLocal)
            .attr("width", LABEL_W).attr("height", ROW_H)
            .attr("fill", "transparent");
        }

        const nameText = labelG.append("text")
          .attr("x", 14).attr("y", yLocal + ROW_H / 2)
          .attr("fill", ing.recipeCount > 0 ? "#431407" : "#a8a29e")
          .attr("font-size", NAME_FONT)
          .attr("dominant-baseline", "middle");
        wrapIngredientName(nameText, displayName(ing.id), NAME_MAX_WIDTH, NAME_LINE_H);

        const barY = yLocal + (ROW_H - BAR_H) / 2;
        if (ing.recipeCount > 0) {
          if (showRecipeCount) {
            labelG.append("text")
              .attr("x", COUNT_X).attr("y", yLocal + ROW_H / 2 + 5)
              .attr("text-anchor", "end")
              .attr("fill", "#7c2d12")
              .attr("font-size", 13).attr("font-weight", 700)
              .text(ing.recipeCount);
          }
          if (showRecipeBar) {
            const fillW = Math.max(3, BAR_W * (ing.recipeCount / maxRecipes));
            labelG.append("rect")
              .attr("x", BAR_X).attr("y", barY)
              .attr("width", BAR_W).attr("height", BAR_H)
              .attr("rx", BAR_H / 2).attr("fill", "#fde7d0");
            labelG.append("rect")
              .attr("x", BAR_X).attr("y", barY)
              .attr("width", fillW).attr("height", BAR_H)
              .attr("rx", BAR_H / 2).attr("fill", color);
          }
        } else {
          if (showRecipeCount) {
            labelG.append("text")
              .attr("x", COUNT_X).attr("y", yLocal + ROW_H / 2 + 5)
              .attr("text-anchor", "end")
              .attr("fill", "#d6d3d1")
              .attr("font-size", 12).attr("font-style", "italic")
              .text("—");
          }
          if (showRecipeBar) {
            labelG.append("rect")
              .attr("x", BAR_X).attr("y", barY)
              .attr("width", BAR_W).attr("height", BAR_H)
              .attr("rx", BAR_H / 2).attr("fill", "#f5f5f4");
          }
        }

        for (let c = 0; c < 24; c++) {
          const intensity = ing.seasonMap.get(displaySlots[c]);
          if (!intensity) continue;
          const isHatch = HATCH_INTENSITIES.has(intensity);
          rightRows.append("rect")
            .attr("x", c * cellW + 0.5)
            .attr("y", yLocal + 3)
            .attr("width", cellW - 1)
            .attr("height", ROW_H - 6)
            .attr("fill", isHatch ? `url(#calendrier-hatch-${cat.category})` : color)
            .attr("stroke", isHatch ? color : "none")
            .attr("stroke-width", isHatch ? 0.6 : 0)
            .attr("stroke-opacity", isHatch ? 0.5 : 0)
            .attr("rx", 2);
        }
        yLocal += ROW_H;
      }
    }

    // Today marker — body-right SVG, drawn last so it sits on top of everything.
    const todayX = (currentDisplayCol + currentDayFractionInQuinzaine()) * cellW;
    const todayLayer = rightSvg.append("g")
      .attr("class", "cal-today-layer")
      .attr("pointer-events", "none")
      .attr("opacity", 0.7);
    todayLayer.append("line")
      .attr("class", "cal-today-line")
      .attr("x1", todayX).attr("x2", todayX)
      .attr("y1", 0).attr("y2", fullBodyH)
      .attr("stroke", "#dc2626").attr("stroke-width", 1.25);
    todayLayer.append("path")
      .attr("d", `M ${todayX - 4} 0 L ${todayX + 4} 0 L ${todayX} 5 Z`)
      .attr("fill", "#dc2626");
    todayLayer.append("title").text("Aujourd'hui");

    // ---- Toggle animation ----
    // Only three things animate: the wrapper's height (CSS), each category
    // group's y-translate (D3), and each category's clip-path rect height
    // (D3). The SVGs themselves stay at fullBodyH so nothing stretches.
    function toggleCategory(catId) {
      if (state.collapsedCategories.has(catId)) state.collapsedCategories.delete(catId);
      else state.collapsedCategories.add(catId);
      persistCollapsedCategories(state.collapsedCategories);
      writeCategoriesToUrl();
      refreshNow();

      const { cats: newCats, bodyH: newBodyH } = computeCatLayout();
      catLayout = newCats;
      bodyH = newBodyH;

      const D = 320;
      const ease = d3.easeCubicInOut;

      // Wrapper height (CSS transition already declared on bodyWrap).
      bodyWrap.style("height", (newBodyH + scrollbarPad) + "px");

      for (const cat of newCats) {
        leftSvg.selectAll(`.cal-cat-${cat.category}`)
          .transition().duration(D).ease(ease)
          .attr("transform", `translate(0, ${cat.y})`);
        rightSvg.selectAll(`.cal-cat-${cat.category}`)
          .transition().duration(D).ease(ease)
          .attr("transform", `translate(0, ${cat.y})`);
        d3.selectAll(`.cal-clip-rect-${cat.category}`)
          .transition().duration(D).ease(ease)
          .attr("height", cat.contentH);
        leftSvg.select(`.cal-bar-${cat.category}`)
          .transition().duration(D).ease(ease)
          .attr("height", GROUP_HEADER_H + (cat.collapsed ? 0 : cat.contentH));
      }
    }
  }

  const APERCU_URL_PARAM = "apercu";

  function loadNowCollapsed() {
    // URL is the sole source: fresh navigation defaults to expanded. State
    // only persists when the URL is preserved (shared link or same-tab back).
    return new URLSearchParams(location.search).get(APERCU_URL_PARAM) === "0";
  }
  function saveNowCollapsed(v) {
    try {
      const url = new URL(window.location.href);
      if (v) url.searchParams.set(APERCU_URL_PARAM, "0");
      else url.searchParams.delete(APERCU_URL_PARAM);
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  // Shared state: the now-section's category filter and the calendar's
  // category collapse are the same set (state.collapsedCategories).
  // - Filter click in the section  → re-render section + full calendar
  //   re-render (loses the calendar's smooth toggle animation).
  // - Chevron click in the calendar → keep its animation and just refresh
  //   the section chips + filter aria-pressed state via refreshNow().
  const nowState = {
    collapsed: loadNowCollapsed(),
  };
  let refreshNow = () => {};
  let syncFromNow = () => {};

  function setupNowCollapse(sectionEl) {
    if (!sectionEl) return;
    const btn = sectionEl.querySelector(".now-toggle");
    const body = sectionEl.querySelector(".now-collapsible");
    if (!btn || !body) return;
    const prefersReduced = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function apply(collapsed, animate) {
      sectionEl.dataset.collapsed = collapsed ? "true" : "false";
      btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      if (!animate || prefersReduced) {
        body.style.maxHeight = collapsed ? "0px" : "none";
        return;
      }
      // Animate max-height between 0 and the measured content height, then
      // release to `none` so later filter/collapse changes reflow naturally.
      if (collapsed) {
        // Lock the current rendered height in px, force reflow, then drop to 0
        // so the transition has two concrete endpoints to interpolate between.
        const target = body.scrollHeight;
        body.style.maxHeight = target + "px";
        void body.offsetHeight;
        requestAnimationFrame(() => { body.style.maxHeight = "0px"; });
      } else {
        body.style.maxHeight = "0px";
        void body.offsetHeight;
        const target = body.scrollHeight;
        requestAnimationFrame(() => { body.style.maxHeight = target + "px"; });
        const onEnd = (e) => {
          if (e.propertyName !== "max-height") return;
          body.style.maxHeight = "none";
          body.removeEventListener("transitionend", onEnd);
        };
        body.addEventListener("transitionend", onEnd);
      }
    }

    apply(nowState.collapsed, false);
    btn.addEventListener("click", () => {
      nowState.collapsed = !nowState.collapsed;
      saveNowCollapsed(nowState.collapsed);
      apply(nowState.collapsed, true);
    });
  }

  const EMPTY_COPY = {
    incoming: "Pas de nouveaux arrivages cette quinzaine.",
    current: "Rien en saison — c'est inhabituel.",
    leaving: "Rien ne s'en va bientôt.",
  };

  function proximityLabel(bucketKey, item) {
    if (bucketKey === "current") {
      if (item.intensity === "peak") return "";
      if (item.intensity === "start") return "début";
      return "bientôt fini";
    }
    if (bucketKey === "incoming") {
      return item.distance === 1 ? "dans 2 sem." : "dans 1 mois";
    }
    if (item.distance === 0) return "cette quinzaine";
    return item.distance === 1 ? "encore 2 sem." : "encore 1 mois";
  }

  function renderChip(bucketKey, item) {
    const a = document.createElement("a");
    a.className = "now-chip";
    a.href = buildSearchUrl([item.id], false);
    a.dataset.intensity = item.intensity;
    a.style.setProperty("--cat-color", CATEGORY_COLORS[item.category] || CATEGORY_COLORS.autre);
    const dot = document.createElement("span");
    dot.className = "now-chip-dot";
    dot.setAttribute("aria-hidden", "true");
    a.appendChild(dot);
    const name = document.createElement("span");
    name.className = "now-chip-name";
    name.textContent = displayName(item.id);
    a.appendChild(name);
    const tag = proximityLabel(bucketKey, item);
    if (tag) {
      const t = document.createElement("span");
      t.className = "now-chip-tag";
      t.textContent = tag;
      a.appendChild(t);
    }
    return a;
  }

  const CATS_URL_PARAM = "cats";

  function writeCategoriesToUrl() {
    try {
      const url = new URL(window.location.href);
      const active = CATEGORY_ORDER.filter((c) => !state.collapsedCategories.has(c));
      if (active.length === CATEGORY_ORDER.length) {
        url.searchParams.delete(CATS_URL_PARAM);
      } else {
        url.searchParams.set(CATS_URL_PARAM, active.join(","));
      }
      window.history.replaceState({}, "", url.toString());
    } catch (_) { /* noop */ }
    if (typeof window.updateQrCode === "function") {
      try { window.updateQrCode(); } catch (_) { /* noop */ }
    }
  }

  // Rules (see spec §5):
  //  - default (all visible active): click X → keep only X active
  //  - only X active and click X    → reset to all active
  //  - otherwise                    → toggle X (add if inactive, remove if active)
  function applyFilterClick(cat, visibleCats) {
    const activeVisible = visibleCats.filter((c) => !state.collapsedCategories.has(c));
    if (activeVisible.length === visibleCats.length) {
      for (const c of visibleCats) if (c !== cat) state.collapsedCategories.add(c);
    } else if (activeVisible.length === 1 && activeVisible[0] === cat) {
      for (const c of visibleCats) state.collapsedCategories.delete(c);
    } else if (state.collapsedCategories.has(cat)) {
      state.collapsedCategories.delete(cat);
    } else {
      state.collapsedCategories.add(cat);
    }
    persistCollapsedCategories(state.collapsedCategories);
    writeCategoriesToUrl();
  }

  function renderNowFilters(filtersEl, buckets) {
    filtersEl.innerHTML = "";
    const counts = new Map();
    for (const key of ["incoming", "current", "leaving"]) {
      for (const it of buckets[key]) counts.set(it.category, (counts.get(it.category) || 0) + 1);
    }
    const cats = CATEGORY_ORDER.filter((c) => counts.has(c));
    if (cats.length === 0) { filtersEl.hidden = true; return; }
    filtersEl.hidden = false;

    const activeVisible = cats.filter((c) => !state.collapsedCategories.has(c));
    const hasFilter = activeVisible.length !== cats.length;

    for (const cat of cats) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "now-filter-btn";
      btn.style.setProperty("--cat-color", CATEGORY_COLORS[cat] || CATEGORY_COLORS.autre);
      const active = !state.collapsedCategories.has(cat);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      const dot = document.createElement("span");
      dot.className = "now-filter-dot";
      dot.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.textContent = CATEGORY_LABELS[cat];
      const count = document.createElement("span");
      count.className = "now-filter-count";
      count.textContent = counts.get(cat);
      btn.append(dot, label, count);
      btn.addEventListener("click", () => {
        applyFilterClick(cat, cats);
        syncFromNow();
      });
      filtersEl.appendChild(btn);
    }

    if (hasFilter) {
      const reset = document.createElement("button");
      reset.type = "button";
      reset.className = "now-filter-reset";
      reset.setAttribute("aria-label", "Effacer les filtres");
      reset.title = "Effacer les filtres";
      reset.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6 6l12 12M18 6l-12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      reset.addEventListener("click", () => {
        for (const c of cats) state.collapsedCategories.delete(c);
        persistCollapsedCategories(state.collapsedCategories);
        writeCategoriesToUrl();
        syncFromNow();
      });
      filtersEl.appendChild(reset);
    }
  }

  function renderNowSection(seasonality, index, sectionEl) {
    if (!sectionEl) return;
    const now = computeNowQuinzaine();
    let buckets = bucketsFor(seasonality, now.absIdx);
    if (!state.showExploratory) {
      const hasRecipes = (id) => (index.ingredients[id]?.recipes || []).length > 0;
      buckets = {
        incoming: buckets.incoming.filter((it) => hasRecipes(it.id)),
        current: buckets.current.filter((it) => hasRecipes(it.id)),
        leaving: buckets.leaving.filter((it) => hasRecipes(it.id)),
      };
    }
    sectionEl.hidden = false;
    sectionEl.dataset.nowAbsIdx = String(now.absIdx);

    const filtersEl = sectionEl.querySelector(".now-filters");
    if (filtersEl) {
      renderNowFilters(filtersEl, buckets);
    }
    buckets = {
      incoming: buckets.incoming.filter((it) => !state.collapsedCategories.has(it.category)),
      current: buckets.current.filter((it) => !state.collapsedCategories.has(it.category)),
      leaving: buckets.leaving.filter((it) => !state.collapsedCategories.has(it.category)),
    };

    for (const key of ["incoming", "current", "leaving"]) {
      const c = sectionEl.querySelector(`[data-bucket-count="${key}"]`);
      if (c) c.textContent = buckets[key].length;
    }

    const catRank = new Map(CATEGORY_ORDER.map((c, i) => [c, i]));
    const sortItems = (arr) => arr.slice().sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      const ca = catRank.get(a.category) ?? 99;
      const cb = catRank.get(b.category) ?? 99;
      if (ca !== cb) return ca - cb;
      return a.id.localeCompare(b.id, "fr");
    });

    for (const key of ["incoming", "current", "leaving"]) {
      const bucketEl = sectionEl.querySelector(`.now-bucket[data-bucket="${key}"]`);
      if (!bucketEl) continue;
      bucketEl.querySelectorAll(".now-chips, .now-empty").forEach((n) => n.remove());
      const items = sortItems(buckets[key]);
      bucketEl.dataset.count = String(items.length);
      if (items.length === 0) {
        const p = document.createElement("p");
        p.className = "now-empty";
        p.textContent = EMPTY_COPY[key];
        bucketEl.appendChild(p);
        continue;
      }
      const list = document.createElement("div");
      list.className = "now-chips";
      for (const item of items) list.appendChild(renderChip(key, item));
      bucketEl.appendChild(list);
    }
  }

  function setupIngredientFilter(root, index, seasonality, onChange) {
    const wrap = root.querySelector("#calendrier-ingredient-filter");
    if (!wrap) return;
    const input = wrap.querySelector(".cal-ing-input");
    const pill = wrap.querySelector(".cal-ing-selected");
    const suggest = wrap.querySelector(".cal-ing-suggest");
    // Portal the dropdown to <body> so it escapes topWrap's overflow clipping.
    if (suggest.parentNode !== document.body) document.body.appendChild(suggest);
    const positionSuggest = () => {
      const r = wrap.getBoundingClientRect();
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const w = Math.max(r.width, Math.min(300, vw - 16));
      const left = Math.min(r.left, vw - w - 8);
      suggest.style.top = (r.bottom + 4) + "px";
      suggest.style.left = Math.max(8, left) + "px";
      suggest.style.width = w + "px";
    };
    const allIds = Object.keys(seasonality).sort((a, b) => a.localeCompare(b, "fr"));
    let activeIdx = -1;
    let matches = [];

    function foldFr(s) {
      return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const pillName = pill.querySelector(".cal-ing-selected-name");

    function render() {
      wrap.hidden = false;
      const active = state.filterIngredient;
      if (active) {
        input.hidden = true;
        input.style.display = "none";
        pill.hidden = false;
        pill.style.display = "";
        if (pillName) pillName.textContent = displayName(active);
        const cat = seasonality[active]?.category || "autre";
        pill.style.setProperty("--cat-color", CATEGORY_COLORS[cat] || CATEGORY_COLORS.autre);
        suggest.hidden = true;
      } else {
        input.hidden = false;
        input.style.display = "";
        pill.hidden = true;
        pill.style.display = "none";
      }
    }

    function computeMatches(q) {
      if (!q) return allIds.slice(0, 30);
      const fq = foldFr(q);
      const starts = [], contains = [];
      for (const id of allIds) {
        const f = foldFr(id);
        if (f === fq) { starts.unshift(id); continue; }
        if (f.startsWith(fq)) starts.push(id);
        else if (f.includes(fq)) contains.push(id);
      }
      return starts.concat(contains).slice(0, 30);
    }

    function paintDropdown() {
      suggest.innerHTML = "";
      if (matches.length === 0) {
        const p = document.createElement("div");
        p.className = "cal-ing-suggest-empty";
        p.textContent = "Aucun ingrédient trouvé.";
        suggest.appendChild(p);
        suggest.hidden = false;
        return;
      }
      matches.forEach((id, i) => {
        const item = document.createElement("div");
        item.className = "cal-ing-suggest-item";
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", i === activeIdx ? "true" : "false");
        const dot = document.createElement("span");
        dot.className = "cal-ing-suggest-dot";
        const cat = seasonality[id]?.category || "autre";
        dot.style.setProperty("--cat-color", CATEGORY_COLORS[cat] || CATEGORY_COLORS.autre);
        const name = document.createElement("span");
        name.textContent = displayName(id);
        const catLabel = document.createElement("span");
        catLabel.className = "cal-ing-suggest-cat";
        catLabel.textContent = CATEGORY_LABELS[cat] || cat;
        item.append(dot, name, catLabel);
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          pick(id);
        });
        suggest.appendChild(item);
      });
      positionSuggest();
      suggest.hidden = false;
    }

    function pick(id) {
      input.value = "";
      suggest.hidden = true;
      activeIdx = -1;
      matches = [];
      onChange(id);
      render();
    }

    function clear() {
      input.value = "";
      suggest.hidden = true;
      activeIdx = -1;
      matches = [];
      onChange(null);
      render();
    }

    input.addEventListener("input", () => {
      matches = computeMatches(input.value.trim());
      activeIdx = matches.length ? 0 : -1;
      paintDropdown();
    });
    input.addEventListener("focus", () => {
      matches = computeMatches(input.value.trim());
      activeIdx = matches.length ? 0 : -1;
      paintDropdown();
    });
    input.addEventListener("blur", () => {
      // Delay so mousedown on a suggestion can fire first.
      setTimeout(() => { suggest.hidden = true; }, 120);
    });
    input.addEventListener("keydown", (e) => {
      if (suggest.hidden) return;
      if (e.key === "ArrowDown") {
        activeIdx = Math.min(matches.length - 1, activeIdx + 1);
        paintDropdown();
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        activeIdx = Math.max(0, activeIdx - 1);
        paintDropdown();
        e.preventDefault();
      } else if (e.key === "Enter") {
        if (activeIdx >= 0 && matches[activeIdx]) {
          pick(matches[activeIdx]);
          e.preventDefault();
        }
      } else if (e.key === "Escape") {
        suggest.hidden = true;
      }
    });
    pill.addEventListener("click", clear);

    const reposition = () => { if (!suggest.hidden) positionSuggest(); };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    render();
  }

  async function loadData(root) {
    const [indexRes, seasonRes] = await Promise.all([
      fetch(root.dataset.urlIndex),
      fetch(root.dataset.urlSeasonality),
    ]);
    if (!indexRes.ok) throw new Error(`ingredient_index.json → ${indexRes.status}`);
    if (!seasonRes.ok) throw new Error(`seasonality.json → ${seasonRes.status}`);
    return { index: await indexRes.json(), seasonality: await seasonRes.json() };
  }

  async function loadRecipeSeasonality(recipesEl) {
    const url = recipesEl?.dataset.urlRecipeSeasonality;
    if (!url) throw new Error("missing data-url-recipe-seasonality");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`recipe-seasonality.json → ${res.status}`);
    return await res.json();
  }

  // --- Scoring engine (pure) --------------------------------------------
  // Fortnight index math: (month - 1) * 2 + (day <= 15 ? 0 : 1). Range 0..23.
  function currentFortnightIdx(date) {
    const d = date || new Date();
    return d.getMonth() * 2 + (d.getDate() <= 15 ? 0 : 1);
  }

  // Score a recipe at a given fortnight, restricted to `activeCategories`.
  // Returns null when the recipe has no *active* temporal ingredients — the
  // caller pins such recipes below the ranked list as "Sans contrainte".
  // Otherwise:
  //   score        – weighted-in / total          (0..1, tabular-friendly)
  //   weightedIn   – sum of phase weights this fortnight
  //   peakCount    – # ingredients at `peak`
  //   startCount   – # at `start`
  //   endCount     – # at `end`
  //   total        – # active temporal ingredients (denominator)
  //   outOfSeason  – ids of active temporal ingredients with weight 0 here
  const PHASE_WEIGHTS = { peak: 1.0, start: 0.5, end: 0.5 };

  function scoreRecipe(recipe, fortnightIdx, activeCategories) {
    const active = recipe.temporal_ingredients.filter(
      (t) => activeCategories.has(t.category)
    );
    if (active.length === 0) return null;
    const key = String(fortnightIdx);
    let weightedIn = 0;
    let peakCount = 0;
    let startCount = 0;
    let endCount = 0;
    const outOfSeason = [];
    for (const ing of active) {
      const phase = ing.phases[key];
      if (phase === "peak") { weightedIn += 1.0; peakCount += 1; }
      else if (phase === "start") { weightedIn += 0.5; startCount += 1; }
      else if (phase === "end") { weightedIn += 0.5; endCount += 1; }
      else { outOfSeason.push(ing.id); }
    }
    return {
      score: weightedIn / active.length,
      weightedIn,
      peakCount,
      startCount,
      endCount,
      total: active.length,
      outOfSeason,
    };
  }

  // Seasonality timeline metrics used to group + order recipes (cyclic, 24
  // fortnights). Groups: 1 = all active ingredients in season now, 2 = partial,
  // 3 = dormant (has active ingredients, none in season now), 4 = no active
  // ingredients at all. Distances are measured forward from `fortnightIdx`:
  //   endDistance          – recipe-level in-season run length from now (until
  //                          fully out of season); smaller = ends sooner.
  //   activateDistance     – fortnights until the recipe first has an in-season
  //                          ingredient again (group 3 only).
  //   endAfterActivation   – activateDistance + run length once active (group 3).
  function seasonTimeline(recipe, fortnightIdx, activeCategories) {
    const active = recipe.temporal_ingredients.filter(
      (t) => activeCategories.has(t.category)
    );
    const total = active.length;
    if (total === 0) return { group: 4 };

    const inSeasonAt = new Array(24);
    for (let f = 0; f < 24; f++) {
      const key = String(f);
      inSeasonAt[f] = active.some((ing) => ing.phases[key]);
    }
    const forwardRun = (start) => {
      let k = 0;
      while (k < 24 && inSeasonAt[(start + k) % 24]) k++;
      return k;
    };

    const inNow = active.filter((ing) => ing.phases[String(fortnightIdx)]).length;
    const group = inNow === total ? 1 : inNow > 0 ? 2 : 3;

    if (group === 3) {
      // NEVER = finite sentinel (> any real 0..24 distance) so the comparator's
      // subtraction stays a number even when a recipe never re-enters season
      // (Infinity − Infinity would be NaN and corrupt the sort).
      const NEVER = 99;
      let activateDistance = NEVER;
      for (let k = 1; k <= 24; k++) {
        if (inSeasonAt[(fortnightIdx + k) % 24]) { activateDistance = k; break; }
      }
      const endAfterActivation = activateDistance === NEVER
        ? NEVER
        : activateDistance + forwardRun((fortnightIdx + activateDistance) % 24);
      return { group, activateDistance, endAfterActivation };
    }
    return { group, endDistance: forwardRun(fortnightIdx) };
  }

  // --- Seasonality strip (signature) ------------------------------------
  // Smooth spline curve: Y = weighted score at each fortnight, X = 24 slots
  // spanning the full width so cell boundaries line up with the header's month
  // grid (every 2 x-steps = 1 month column). Fill is a horizontal gradient
  // whose stops track the per-fortnight colour along the parchment → mustard
  // → peak-green ramp.

  // Weighted score in [0..1] per fortnight, restricted to active categories.
  function scoreSeries(recipe, activeCategories) {
    const active = recipe.temporal_ingredients.filter(
      (t) => activeCategories.has(t.category)
    );
    const out = new Float32Array(24);
    if (!active.length) return out;
    for (let idx = 0; idx < 24; idx++) {
      const key = String(idx);
      let w = 0;
      for (const ing of active) {
        const p = ing.phases[key];
        if (p === "peak") w += 1.0;
        else if (p === "start" || p === "end") w += 0.5;
      }
      out[idx] = w / active.length;
    }
    return out;
  }

  // Ripening green ramp (G3): unripe lime → fresh green → deep teal-green.
  // Reads like a fruit's hue shifting as it matures.
  const STRIP_STOPS = [
    { at: 0.0, rgb: [212, 230, 138] }, // #D4E68A unripe lime
    { at: 0.5, rgb: [63, 154, 95] },   // #3F9A5F fresh green
    { at: 1.0, rgb: [15, 76, 58] },    // #0F4C3A deep teal-green
  ];
  // Hatch colour source is the horizontal score ramp itself (see the
  // `.cal-strip-hatch` CSS): each stripe takes the palette colour at its
  // horizontal position so the hatch reads as the same left→right shift as
  // the curve stroke above it.
  function scoreColor(score) {
    if (score <= 0) return "rgb(234, 221, 208)";
    if (score >= 1) return "rgb(47, 143, 63)";
    let lo = STRIP_STOPS[0], hi = STRIP_STOPS[STRIP_STOPS.length - 1];
    for (let i = 0; i < STRIP_STOPS.length - 1; i++) {
      if (score >= STRIP_STOPS[i].at && score <= STRIP_STOPS[i + 1].at) {
        lo = STRIP_STOPS[i]; hi = STRIP_STOPS[i + 1]; break;
      }
    }
    const t = (score - lo.at) / (hi.at - lo.at);
    const r = Math.round(lo.rgb[0] + (hi.rgb[0] - lo.rgb[0]) * t);
    const g = Math.round(lo.rgb[1] + (hi.rgb[1] - lo.rgb[1]) * t);
    const b = Math.round(lo.rgb[2] + (hi.rgb[2] - lo.rgb[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function renderStrip(container, series) {
    container.innerHTML = "";
    // viewBox uses 24-unit width so points align with the 12-month header grid
    // (each month = 2 units). Height 20 gives a comfortable curve amplitude.
    const W = 24;
    const H = 20;
    const top = 1.5;
    const bottom = H - 1;
    const uid = `s${Math.random().toString(36).slice(2, 9)}`;

    // Two stacked SVGs bracket the CSS hatch layer so the paint order is:
    //   svgBack (area fill)  ←  hatch (CSS)  ←  svgFront (curve strokes)
    const svgBack = d3.select(container).append("svg")
      .attr("class", "cal-strip-svg cal-strip-svg-back")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "none")
      .attr("aria-hidden", "true");
    // Placeholder for the hatch layer — inserted after svgBack, before svgFront.
    const svg = d3.select(container).append("svg")
      .attr("class", "cal-strip-svg cal-strip-svg-front")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "none")
      .attr("aria-hidden", "true");

    // Month-boundary lines and the current-fortnight highlight are drawn once
    // as a body-level backdrop (`.cal-recipes-grid-overlay`) behind all strips,
    // matching the ingredient Gantt — so the strip itself draws only its curve.

    // Gradient stops — one per fortnight, positioned at the midpoint of the cell
    // so the colour tracks the curve rather than the cell boundary.
    const stops = [];
    for (let i = 0; i < 24; i++) {
      const pct = ((i + 0.5) / 24) * 100;
      stops.push(`<stop offset="${pct.toFixed(3)}%" stop-color="${scoreColor(series[i])}"/>`);
    }
    svg.append("defs").html(
      `<linearGradient id="grad-${uid}" x1="0" x2="1" y1="0" y2="0">${stops.join("")}</linearGradient>`
    );

    // Build the spline. Points at cell midpoints (i + 0.5, y(score)).
    const xs = [];
    for (let i = 0; i < 24; i++) xs.push(i + 0.5);
    const yFor = (v) => bottom - v * (bottom - top);

    const line = d3.line()
      .x((_, i) => xs[i])
      .y((v) => yFor(v))
      .curve(d3.curveMonotoneX);
    const area = d3.area()
      .x((_, i) => xs[i])
      .y0(bottom)
      .y1((v) => yFor(v))
      .curve(d3.curveMonotoneX);

    // ── Back layer: colored area fill under the curve ─────────────────
    const areaPath = area(series);
    // Duplicate the gradient <defs> in svgBack so the area fill can reference it.
    svgBack.append("defs").html(
      `<linearGradient id="grad-back-${uid}" x1="0" x2="1" y1="0" y2="0">${stops.join("")}</linearGradient>`
    );
    svgBack.append("path")
      .attr("d", areaPath)
      .attr("fill", `url(#grad-back-${uid})`)
      .attr("opacity", 0.30);

    // ── Middle layer: diagonal hatch (CSS) clipped to the area shape ──
    // Rendered as an HTML/CSS layer outside the SVG so the diagonals stay at
    // true 45° on screen instead of distorting under preserveAspectRatio="none".
    const maskSvg =
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' ` +
      `preserveAspectRatio='none'>` +
      `<path d='${areaPath}' fill='white'/></svg>`;
    const maskUri = `url("data:image/svg+xml;utf8,${encodeURIComponent(maskSvg)}")`;

    // Same 24-stop score-driven gradient the SVG line stroke uses.
    const cssStops = [];
    for (let i = 0; i < 24; i++) {
      const pct = (((i + 0.5) / 24) * 100).toFixed(3);
      cssStops.push(`${scoreColor(series[i])} ${pct}%`);
    }
    const hatchGradient = `linear-gradient(to right, ${cssStops.join(", ")})`;

    const hatchLayer = document.createElement("div");
    hatchLayer.className = "cal-strip-hatch";
    hatchLayer.style.setProperty("--hatch-mask", maskUri);
    hatchLayer.style.background = hatchGradient;
    // Insert between svgBack and svg (the front layer) so paint order is
    // back → hatch → front.
    container.insertBefore(hatchLayer, svg.node());

    // Curve outline — thicker so it stays legible against the fill.
    svg.append("path")
      .attr("d", line(series))
      .attr("fill", "none")
      .attr("stroke", `url(#grad-${uid})`)
      .attr("stroke-width", 4)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("vector-effect", "non-scaling-stroke");

    // Full-peak emphasis: the base curve is overlaid with two extra strokes
    // whose visibility fades in progressively with the score. Both extra
    // strokes trace the ENTIRE spline (identical shape to the base) and use
    // a horizontal linear gradient as their mask — the gradient's opacity at
    // each fortnight midpoint is a nonlinear function of the score there:
    //   opacity(score) = clamp((score - 0.6) / 0.4, 0, 1) ^ 1.6
    // so nothing shows below 0.6, and the emphasis ramps in smoothly toward
    // peak. Between fortnights the linearGradient blends stops naturally,
    // giving a continuous fade rather than hard edges.
    if (series.some((v) => v >= 0.6)) {
      const emph = (score) => {
        const t = Math.max(0, (score - 0.6) / 0.4);
        return Math.min(1, t) ** 1.6;
      };
      const maskStops = [];
      for (let i = 0; i < 24; i++) {
        const pct = ((i + 0.5) / 24) * 100;
        const op = emph(series[i]).toFixed(3);
        maskStops.push(
          `<stop offset="${pct.toFixed(3)}%" stop-color="white" stop-opacity="${op}"/>`
        );
      }
      const maskId = `peak-mask-${uid}`;
      const maskGradId = `peak-mask-grad-${uid}`;
      const defs = svg.select("defs");
      defs.append("linearGradient")
        .attr("id", maskGradId)
        .attr("x1", "0").attr("x2", "1").attr("y1", "0").attr("y2", "0")
        .html(maskStops.join(""));
      defs.append("mask")
        .attr("id", maskId)
        .attr("maskUnits", "userSpaceOnUse")
        .attr("x", 0).attr("y", 0)
        .attr("width", W).attr("height", H)
        .html(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#${maskGradId})"/>`);

      // Halo — wide, translucent fresh green; visibility ramps with score.
      svg.append("path")
        .attr("d", line(series))
        .attr("fill", "none")
        .attr("stroke", "#3F9A5F")
        .attr("stroke-width", 10)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("opacity", 0.32)
        .attr("mask", `url(#${maskId})`)
        .attr("vector-effect", "non-scaling-stroke");
      // Emphasis — thicker deep teal-green stroke, same mask.
      svg.append("path")
        .attr("d", line(series))
        .attr("fill", "none")
        .attr("stroke", "#0F4C3A")
        .attr("stroke-width", 6.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("mask", `url(#${maskId})`)
        .attr("vector-effect", "non-scaling-stroke");
    }
  }

  // Per-ingredient row rendered like the ingredient calendar: 24 cells across,
  // solid category colour for `peak`, diagonal hatch for `start` / `end`, empty
  // otherwise. Month rules every 2 cells; current quinzaine highlighted.
  function renderIngredientStrip(container, ing, displaySlots, currentDisplayCol) {
    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "cal-strip-grid";
    const color = CATEGORY_COLORS[ing.category] || CATEGORY_COLORS.autre;
    for (let c = 0; c < 24; c++) {
      const cell = document.createElement("div");
      cell.className = "cal-strip-cell";
      if (c % 2 === 0 && c > 0) cell.classList.add("cal-strip-cell-month-start");
      // Map display cell `c` to its absolute fortnight via the rotation.
      const p = ing.phases[String(displaySlots[c])];
      if (p) {
        cell.classList.add(`cal-strip-cell-${p}`);
        cell.style.setProperty("--cell-color", color);
      }
      if (c === currentDisplayCol) cell.classList.add("cal-strip-cell-now");
      grid.appendChild(cell);
    }
    container.appendChild(grid);
  }

  // --- Renderer ---------------------------------------------------------
  // Red→green badge colour scaled by the weighted score (0..1). Two linear RGB
  // segments through the search-page palette (red #F53200 → orange #f97316 →
  // green #22c55e) so the midpoint stays a clean orange instead of muddy brown.
  function scoreBadgeColor(t) {
    const s = Math.max(0, Math.min(1, t));
    const RED = [245, 50, 0], ORANGE = [249, 115, 22], GREEN = [34, 197, 94];
    const [a, b, u] = s <= 0.5 ? [RED, ORANGE, s / 0.5] : [ORANGE, GREEN, (s - 0.5) / 0.5];
    const c = (i) => Math.round(a[i] + (b[i] - a[i]) * u);
    return `rgb(${c(0)}, ${c(1)}, ${c(2)})`;
  }

  function buildBaseurl() {
    const root = document.getElementById("calendrier-root");
    return root?.dataset.baseurl || "";
  }

  // Full-frame layout mirroring the ingredient calendar:
  //   ┌────────────── (sticky) month header ──────────────┐
  //   │ Jan │ Feb │ Mar │ … │ Dec │
  //   ├──────┬─────────────────────────────────────────────┤
  //   │ RcpA │  cells across 24 fortnights                 │
  //   │ RcpB │  …                                          │
  //   └──────┴─────────────────────────────────────────────┘
  function resolveFortnightIdx() {
    return state.quinzaineIdx !== null ? state.quinzaineIdx : currentFortnightIdx();
  }

  function renderQuinzainePicker(mount, data, mountRoot) {
    mount.innerHTML = "";
    const idx = resolveFortnightIdx();

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "cal-recipes-picker-nav";
    prev.setAttribute("aria-label", "Quinzaine précédente");
    prev.textContent = "‹";

    const label = document.createElement("div");
    label.className = "cal-recipes-picker-label";
    const long = document.createElement("span");
    long.className = "cal-recipes-picker-long";
    long.textContent = formatQuinzaineLong(idx);
    const short = document.createElement("span");
    short.className = "cal-recipes-picker-short";
    short.textContent = formatQuinzaine(idx);
    label.append(long, short);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "cal-recipes-picker-nav";
    next.setAttribute("aria-label", "Quinzaine suivante");
    next.textContent = "›";

    const step = (delta) => {
      const cur = resolveFortnightIdx();
      const nextIdx = ((cur + delta) % 24 + 24) % 24;
      state.quinzaineIdx = nextIdx;
      writeQuinzaineToUrl(nextIdx, false);
      renderRecipesList(data, mountRoot);
    };
    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));

    mount.append(prev, label, next);
  }

  function renderCategoryPills(mount, data, mountRoot) {
    mount.innerHTML = "";
    const heading = document.createElement("span");
    heading.className = "cal-recipes-pills-heading";
    heading.textContent = "Catégories comptées :";
    mount.appendChild(heading);

    for (const cat of TEMPORAL_CATS_ORDER) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "cal-recipes-pill";
      const active = state.activeSeasonCategories.has(cat);
      pill.dataset.category = cat;
      pill.setAttribute("aria-pressed", active ? "true" : "false");
      pill.style.setProperty("--cat-color", CATEGORY_COLORS[cat]);
      pill.textContent = CATEGORY_LABELS[cat];
      pill.addEventListener("click", () => {
        if (state.activeSeasonCategories.has(cat)) {
          state.activeSeasonCategories.delete(cat);
        } else {
          state.activeSeasonCategories.add(cat);
        }
        writeCategoriesSaisonToUrl(state.activeSeasonCategories);
        renderRecipesList(data, mountRoot);
      });
      mount.appendChild(pill);
    }
  }

  function renderRecipesList(data, mount) {
    if (!mount) return;
    const fortnightIdx = resolveFortnightIdx();
    const activeCategories = state.activeSeasonCategories;
    const baseurl = buildBaseurl();

    // Rotate the 24-fortnight axis so column 0 is the first fortnight of the
    // CURRENT month — mirrors the ingredient Gantt (renderGantt) so both grids
    // start on the same month. The axis origin tracks *today* (stable even when
    // the user moves the quinzaine picker); the highlight marker tracks the
    // resolved `fortnightIdx`.
    const todayQ = currentFortnightIdx();
    const displayStart = Math.floor(todayQ / 2) * 2;
    const displaySlots = Array.from({ length: 24 }, (_, i) => (displayStart + i) % 24);
    const currentDisplayCol = (fortnightIdx - displayStart + 24) % 24;

    const kindOk = (r) =>
      r.kind === "recipe" || (state.includeComponents && r.kind === "component");
    const entries = [];
    for (const recipe of data.recipes) {
      if (!kindOk(recipe)) continue;
      const s = scoreRecipe(recipe, fortnightIdx, activeCategories);
      const t = seasonTimeline(recipe, fortnightIdx, activeCategories);
      entries.push({ recipe, s, t });
    }
    // Group-based ordering: 1 Complete → 2 Partial → 3 Dormant → 4 No-constraint.
    // Within each group, "ends soonest first" (smaller endDistance). See
    // seasonTimeline for the metric definitions.
    entries.sort((a, b) => {
      if (a.t.group !== b.t.group) return a.t.group - b.t.group;
      const byTitle = a.recipe.title.localeCompare(b.recipe.title, "fr");
      switch (a.t.group) {
        case 1:
          return (a.t.endDistance - b.t.endDistance) || byTitle;
        case 2: {
          const propA = (a.s.total - a.s.outOfSeason.length) / a.s.total;
          const propB = (b.s.total - b.s.outOfSeason.length) / b.s.total;
          return (propB - propA) || (a.t.endDistance - b.t.endDistance) || byTitle;
        }
        case 3:
          return (a.t.activateDistance - b.t.activateDistance)
            || (a.t.endAfterActivation - b.t.endAfterActivation) || byTitle;
        default:
          return byTitle;
      }
    });

    mount.innerHTML = "";

    const picker = document.createElement("div");
    picker.className = "cal-recipes-picker";
    renderQuinzainePicker(picker, data, mount);
    mount.appendChild(picker);

    const pills = document.createElement("div");
    pills.className = "cal-recipes-pills";
    renderCategoryPills(pills, data, mount);
    // Components toggle sits at the end of the pill row.
    const compWrap = document.createElement("label");
    compWrap.className = "cal-recipes-comp-toggle";
    const compBox = document.createElement("input");
    compBox.type = "checkbox";
    compBox.checked = state.includeComponents;
    compBox.addEventListener("change", () => {
      state.includeComponents = compBox.checked;
      writeIncludeComponentsToUrl(compBox.checked);
      renderRecipesList(data, mount);
    });
    const compLabel = document.createElement("span");
    compLabel.textContent = "Inclure les composants";
    compWrap.append(compBox, compLabel);
    pills.appendChild(compWrap);
    mount.appendChild(pills);

    if (activeCategories.size === 0) {
      const empty = document.createElement("p");
      empty.className = "cal-recipes-empty";
      empty.textContent =
        "Sélectionnez au moins une catégorie pour classer les recettes.";
      mount.appendChild(empty);
      // Still show the "sans contrainte" list below — all entries fall into it.
      const allEntries = data.recipes.filter(
        (r) => r.kind === "recipe" || (state.includeComponents && r.kind === "component")
      );
      allEntries.sort((a, b) => a.title.localeCompare(b.title, "fr"));
      renderPinnedList(mount, allEntries, baseurl);
      return;
    }

    // Layout mode (shared with the ingredient Gantt): "wide" gives fixed wide
    // cells + horizontal scroll, "fit" fills the viewport fluidly. The strip
    // SVGs use preserveAspectRatio="none", so a wider container widens the curve
    // automatically — only the container widths change here.
    const isMobileLayout = window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    // On mobile the rows stack (title over a full-width strip via CSS), so wide
    // horizontal scroll is meaningless there — always render fit on phones.
    const isWide = state.layoutMode === "wide" && !isMobileLayout;
    const cellW = isMobileLayout ? WIDE_CELL_W_MOBILE : WIDE_CELL_W_DESKTOP;
    const gridW = cellW * 24;

    const frame = document.createElement("div");
    frame.className = "cal-recipes-frame";
    frame.classList.toggle("is-wide", isWide);
    frame.style.setProperty("--cal-grid-w", gridW + "px");
    mount.appendChild(frame);

    // ---- Sticky month header --------------------------------------------
    const header = document.createElement("div");
    header.className = "cal-recipes-header";
    header.appendChild(document.createElement("div")).className = "cal-recipes-header-left";
    const headerRight = document.createElement("div");
    headerRight.className = "cal-recipes-header-right";
    for (let d = 0; d < 12; d++) {
      // Absolute month at display column `d` (2 fortnights per month; rotation
      // is month-aligned so both fortnights of a column share one month).
      const monthIdx = Math.floor(displaySlots[d * 2] / 2);
      const cell = document.createElement("div");
      cell.className = "cal-recipes-month-cell";
      // Label wrapped in a span so the mobile rotation applies to the TEXT only —
      // rotating the whole cell would swing its box (and background band) wider
      // than the column, overlapping neighbours and hiding their text.
      const lbl = document.createElement("span");
      lbl.className = "cal-recipes-month-label";
      lbl.textContent = MONTH_LABELS_FR[monthIdx];
      cell.appendChild(lbl);
      // Alternating month band keyed to ABSOLUTE month parity, so January stays
      // cream and the tint matches the ingredient calendar regardless of rotation.
      if (monthIdx % 2 === 1) cell.classList.add("cal-recipes-month-cell-alt");
      headerRight.appendChild(cell);
    }
    header.appendChild(headerRight);
    frame.appendChild(header);

    // ---- Body: one row per recipe ---------------------------------------
    const body = document.createElement("div");
    body.className = "cal-recipes-body";

    // Continuous grid backdrop spanning every recipe row (and expanded detail),
    // mirroring the ingredient Gantt: month-boundary lines + a full-height
    // current-fortnight highlight column. Sits behind the transparent strips.
    const overlay = document.createElement("div");
    overlay.className = "cal-recipes-grid-overlay";
    for (let m = 1; m < 12; m++) {
      const line = document.createElement("div");
      line.className = "cal-recipes-grid-line";
      line.style.left = ((m / 12) * 100).toFixed(4) + "%";
      overlay.appendChild(line);
    }
    const nowCol = document.createElement("div");
    nowCol.className = "cal-recipes-grid-now";
    nowCol.style.left = ((currentDisplayCol / 24) * 100).toFixed(4) + "%";
    nowCol.style.width = (100 / 24).toFixed(4) + "%";
    overlay.appendChild(nowCol);
    body.appendChild(overlay);

    for (const { recipe, s } of entries) {
      const item = document.createElement("div");
      item.className = "cal-recipes-item";
      // Focusable so keyboard users trigger :focus-within on Tab.
      item.tabIndex = -1;
      // Card image exposed as a variable; consumed by the mobile CSS (scrim
      // background behind the title, and the slide-in photo banner on expand).
      item.style.setProperty("--recipe-img",
        `url("${baseurl}/images/cards/${recipe.image}.webp")`);

      const row = document.createElement("div");
      row.className = "cal-recipes-row";

      // Mobile-only photo banner that slides up from the top when the row is
      // expanded (see the .is-expanded CSS). Hidden on desktop. Tapping the image
      // collapses the row; the "Voir la recette" button is the ONLY way to open
      // the recipe.
      const photoWrap = document.createElement("div");
      photoWrap.className = "cal-recipes-photo-wrap";
      const photoBanner = document.createElement("div");
      photoBanner.className = "cal-recipes-photo";
      const photoImg = document.createElement("span");
      photoImg.className = "cal-recipes-photo-img";
      const photoLink = document.createElement("a");
      photoLink.className = "cal-recipes-photo-link";
      photoLink.href = `${baseurl}${recipe.url}`;
      photoLink.textContent = "Voir la recette ↗";
      photoBanner.append(photoImg, photoLink);
      photoWrap.appendChild(photoBanner);
      row.appendChild(photoWrap);
      // Tapping the banner image (anywhere but the button) collapses the row.
      photoBanner.addEventListener("click", (ev) => {
        if (ev.target.closest(".cal-recipes-photo-link")) return;
        item.classList.remove("is-expanded");
      });

      const left = document.createElement("a");
      left.className = "cal-recipes-row-left";
      left.href = `${baseurl}${recipe.url}`;

      // Thumbnail wrapped so the seasonality badge can anchor to its top-right.
      const thumbWrap = document.createElement("span");
      thumbWrap.className = "cal-recipes-thumb-wrap";
      const thumb = document.createElement("img");
      thumb.className = "cal-recipes-thumb";
      thumb.loading = "lazy";
      thumb.decoding = "async";
      thumb.alt = "";
      thumb.src = `${baseurl}/images/cards/${recipe.image}.webp`;
      thumbWrap.append(thumb);
      // Seasonality badge "x/y": x = ingredients in season (peak/start/end each
      // count as 1), y = total active. Colour scales with the weighted score.
      // No badge for no-constraint recipes (no active ingredients → s is null).
      if (s) {
        const inSeason = s.total - s.outOfSeason.length;
        const badge = document.createElement("span");
        badge.className = "cal-recipes-score-badge";
        badge.textContent = `${inSeason}/${s.total}`;
        badge.style.background = scoreBadgeColor(s.score);
        thumbWrap.append(badge);
      }

      const info = document.createElement("span");
      info.className = "cal-recipes-info";

      const title = document.createElement("span");
      title.className = "cal-recipes-title";
      title.textContent = recipe.title;
      if (recipe.kind === "component") {
        const badge = document.createElement("span");
        badge.className = "cal-recipes-badge";
        badge.textContent = "composant";
        title.appendChild(document.createTextNode(" "));
        title.appendChild(badge);
      }

      info.append(title);
      if (s && s.outOfSeason.length) {
        const oos = document.createElement("span");
        oos.className = "cal-recipes-oos";
        oos.textContent = `hors saison : ${s.outOfSeason.join(", ")}`;
        info.appendChild(oos);
      }
      left.append(thumbWrap, info);
      row.appendChild(left);

      const right = document.createElement("div");
      right.className = "cal-recipes-row-right";
      const strip = document.createElement("div");
      strip.className = "cal-strip";
      // Pre-rotate the series through displaySlots so renderStrip plots it in
      // display order without needing rotation-aware math internally.
      const rawSeries = scoreSeries(recipe, activeCategories);
      const rotatedSeries = Float32Array.from(displaySlots, (idx) => rawSeries[idx]);
      renderStrip(strip, rotatedSeries);
      right.appendChild(strip);
      row.appendChild(right);

      // Mobile: a tap on the title or strip toggles the expanded state (photo
      // banner + ingredient detail) instead of navigating. Desktop keeps the
      // link + hover accordion untouched. The photo banner link still navigates.
      const toggleExpand = (ev) => {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        ev.preventDefault();
        item.classList.toggle("is-expanded");
      };
      left.addEventListener("click", toggleExpand);
      right.addEventListener("click", toggleExpand);

      // Pre-rendered per-ingredient block; CSS-only accordion via
      // `.cal-recipes-item:hover / :focus-within` animates the wrapping grid
      // from `grid-template-rows: 0fr` to `1fr`.
      const detailWrap = document.createElement("div");
      detailWrap.className = "cal-recipes-detail-wrap";
      const detail = document.createElement("div");
      detail.className = "cal-recipes-detail";
      const active = recipe.temporal_ingredients.filter(
        (t) => activeCategories.has(t.category)
      );
      for (const ing of active) {
        const sub = document.createElement("div");
        sub.className = "cal-recipes-subrow";
        const label = document.createElement("div");
        label.className = "cal-recipes-subrow-left";
        const dot = document.createElement("span");
        dot.className = "cal-recipes-subrow-dot";
        dot.style.setProperty("--cat-color", CATEGORY_COLORS[ing.category] || CATEGORY_COLORS.autre);
        const name = document.createElement("span");
        name.className = "cal-recipes-subrow-name";
        name.textContent = ing.id;
        label.append(dot, name);
        const subRight = document.createElement("div");
        subRight.className = "cal-recipes-subrow-right";
        const subStrip = document.createElement("div");
        subStrip.className = "cal-strip cal-strip-mini";
        renderIngredientStrip(subStrip, ing, displaySlots, currentDisplayCol);
        subRight.appendChild(subStrip);
        sub.append(label, subRight);
        detail.appendChild(sub);
      }
      detailWrap.appendChild(detail);
      // Mobile: tapping the ingredient detail collapses the section too.
      detailWrap.addEventListener("click", () => {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        item.classList.remove("is-expanded");
      });

      item.append(row, detailWrap);
      body.appendChild(item);
    }

    // In wide mode the body is wider than the frame and scrolls horizontally;
    // the sticky month header (a frame-level sibling) is scrolled in sync by JS
    // — mirrors renderGantt's two-band scroll architecture. The wrapper is a
    // transparent passthrough in fit mode.
    const bodyScroll = document.createElement("div");
    bodyScroll.className = "cal-recipes-body-scroll";
    bodyScroll.appendChild(body);
    frame.appendChild(bodyScroll);

    if (isWide) {
      bodyScroll.addEventListener("scroll", () => {
        if (header.scrollLeft !== bodyScroll.scrollLeft) header.scrollLeft = bodyScroll.scrollLeft;
      }, { passive: true });
    }
  }

  function renderPinnedList(mount, recipes, baseurl) {
    if (!recipes.length) return;
    const heading = document.createElement("h3");
    heading.className = "cal-recipes-pinned-heading";
    heading.textContent = "Sans contrainte de saison";
    mount.appendChild(heading);

    const pinnedList = document.createElement("ul");
    pinnedList.className = "cal-recipes-pinned";
    for (const recipe of recipes) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "cal-recipes-pinned-link";
      a.href = `${baseurl}${recipe.url}`;
      a.textContent = recipe.title;
      if (recipe.kind === "component") {
        a.appendChild(document.createTextNode(" "));
        const badge = document.createElement("span");
        badge.className = "cal-recipes-badge";
        badge.textContent = "composant";
        a.appendChild(badge);
      }
      li.appendChild(a);
      pinnedList.appendChild(li);
    }
    mount.appendChild(pinnedList);
  }

  // Segmented toggle mirroring the home page's "recipes per row" selector
  // (see assets/js/cols-selector.js). Sliding indicator + labelled buttons.
  function buildSegmentedToggle(mount, options, ariaLabel, onPick, labelText) {
    const wrap = document.createElement("div");
    wrap.className =
      "inline-flex items-stretch rounded-lg border border-primary/40 bg-white/70 backdrop-blur shadow-sm overflow-hidden";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", ariaLabel);

    if (labelText) {
      const label = document.createElement("span");
      label.className =
        "flex items-center text-white font-bold text-sm px-3 py-1 whitespace-nowrap";
      label.style.backgroundColor = "rgba(245, 50, 0, 0.65)";
      label.textContent = labelText;
      wrap.appendChild(label);
    }

    const btnRow = document.createElement("div");
    btnRow.className = "relative flex items-center gap-1 px-1.5 py-0.5";
    wrap.appendChild(btnRow);

    const indicator = document.createElement("div");
    indicator.className =
      "absolute top-0 bottom-0 rounded-md shadow-sm pointer-events-none";
    indicator.style.backgroundColor = "rgba(245, 50, 0, 0.65)";
    indicator.style.left = "0px";
    indicator.style.width = "0px";
    indicator.style.opacity = "0";
    indicator.style.transition =
      "left 440ms cubic-bezier(0.22, 1, 0.36, 1), width 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease-out";
    btnRow.appendChild(indicator);

    const buttons = new Map();
    for (const opt of options) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.mode = opt.mode;
      btn.textContent = opt.label;
      btn.setAttribute("aria-label", opt.label);
      btn.className =
        "relative z-10 px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30";
      btn.style.minWidth = "5.5rem";
      btn.addEventListener("click", () => onPick(opt.mode));
      buttons.set(opt.mode, btn);
      btnRow.appendChild(btn);
    }

    function moveIndicator(activeBtn) {
      if (!activeBtn || !activeBtn.offsetParent) return;
      const rowRect = btnRow.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      indicator.style.left = (btnRect.left - rowRect.left) + "px";
      indicator.style.width = btnRect.width + "px";
      indicator.style.top = activeBtn.offsetTop + "px";
      indicator.style.height = activeBtn.offsetHeight + "px";
      indicator.style.opacity = "1";
    }

    function setActive(mode) {
      let activeBtn = null;
      for (const [val, btn] of buttons) {
        const active = val === mode;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
        if (active) {
          activeBtn = btn;
          btn.classList.add("text-white");
          btn.classList.remove("text-red-900/70", "hover:bg-primary/10");
        } else {
          btn.classList.remove("text-white");
          btn.classList.add("text-red-900/70", "hover:bg-primary/10");
        }
      }
      moveIndicator(activeBtn);
    }

    mount.innerHTML = "";
    mount.appendChild(wrap);
    return { setActive };
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const status = document.getElementById("calendrier-status");
    const root = document.getElementById("calendrier-root");
    if (!status || !root) return;

    setupModeToggle();
    renderMode();

    try {
      const { index, seasonality } = await loadData(root);
      // Apply category filter from URL param (`cats=fruit,legume,...`). Any
      // CATEGORY_ORDER value not present in the list is added to the collapsed
      // set. Absent param → leave state.collapsedCategories untouched (fall
      // back to localStorage-restored default).
      try {
        const raw = new URLSearchParams(location.search).get(CATS_URL_PARAM);
        if (raw !== null) {
          const activeSet = new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
          for (const c of CATEGORY_ORDER) {
            if (activeSet.has(c)) state.collapsedCategories.delete(c);
            else state.collapsedCategories.add(c);
          }
          persistCollapsedCategories(state.collapsedCategories);
        }
      } catch (_) { /* ignore */ }

      const nowSectionEl = document.getElementById("calendrier-now");
      renderNowSection(seasonality, index, nowSectionEl);
      setupNowCollapse(nowSectionEl);

      const recipesEl = document.getElementById("calendrier-recipes");
      if (recipesEl) {
        try {
          const recipeSeasonality = await loadRecipeSeasonality(recipesEl);
          renderRecipesList(recipeSeasonality, recipesEl);
          rehydrateFromUrl = () => renderRecipesList(recipeSeasonality, recipesEl);

          // Keyboard ←/→ steps the quinzaine picker while recipes mode is
          // active. Ignores presses whose target is a text field so users can
          // still type in the ingredient filter (or a future search).
          document.addEventListener("keydown", (ev) => {
            if (state.affichage !== MODE_RECETTES) return;
            if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
            const t = ev.target;
            if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
            const delta = ev.key === "ArrowLeft" ? -1 : 1;
            const cur = resolveFortnightIdx();
            const nextIdx = ((cur + delta) % 24 + 24) % 24;
            state.quinzaineIdx = nextIdx;
            writeQuinzaineToUrl(nextIdx, false);
            renderRecipesList(recipeSeasonality, recipesEl);
            ev.preventDefault();
          });
        } catch (err) {
          recipesEl.innerHTML = "";
          const p = document.createElement("p");
          p.className = "cal-recipes-placeholder";
          p.textContent = "Erreur de chargement des recettes.";
          recipesEl.appendChild(p);
          console.error(err);
        }
      }

      // renderNowSection un-hides the now-section unconditionally; re-apply
      // the mode toggle so recipes mode stays clean.
      renderMode();
      refreshNow = () => renderNowSection(seasonality, index, nowSectionEl);
      syncFromNow = () => { refreshNow(); renderGantt(root, rows); };
      const computeRows = () =>
        applyIngredientFilter(buildRows(index, seasonality), index, seasonality);
      let rows = computeRows();

      // Status element is now reserved for error messages only; no per-render text.
      function refreshStatus() { /* no-op */ }

      // NB: we don't write layoutMode/explore to the URL on bootstrap. Fresh
      // visits stay URL-empty and follow the viewport-based default; the URL
      // only gets a param when the user explicitly picks one.

      const controlsMount = document.getElementById("calendrier-controls-mount");
      let modeControl = null;
      let exploreControl = null;
      if (controlsMount) {
        controlsMount.innerHTML = "";
        controlsMount.style.display = "flex";
        controlsMount.style.flexWrap = "wrap";
        controlsMount.style.gap = "12px";
        controlsMount.style.alignItems = "center";

        const modeMount = document.createElement("div");
        controlsMount.appendChild(modeMount);
        // The "Avec recettes / Tous" toggle lives in the now-section header so
        // it visually applies to both the section and the calendar below.
        const exploreMount = document.getElementById("calendrier-now-controls")
          || (() => { const d = document.createElement("div"); controlsMount.appendChild(d); return d; })();

        modeControl = buildSegmentedToggle(
          modeMount,
          [
            { mode: "fit", label: "Vue globale" },
            { mode: "wide", label: "Vue large" },
          ],
          "Mode d'affichage du calendrier",
          (mode) => {
            if (state.layoutMode === mode) return;
            state.layoutMode = mode;
            try { localStorage.setItem("calendrier.layoutMode", mode); } catch (_) { /* ignore */ }
            writeLayoutModeToUrl(mode);
            modeControl.setActive(mode);
            renderGantt(root, rows);
            // Also re-render the recettes list so the layout applies there too
            // (no-op default when recipes aren't loaded).
            rehydrateFromUrl();
          }
        );
        exploreControl = buildSegmentedToggle(
          exploreMount,
          [
            { mode: "recipes", label: "Avec recettes" },
            { mode: "all", label: "Tous" },
          ],
          "Ingrédients à afficher",
          (mode) => {
            const wanted = mode === "all";
            if (state.showExploratory === wanted) return;
            state.showExploratory = wanted;
            try { localStorage.setItem("calendrier.showExploratory", wanted ? "1" : "0"); } catch (_) { /* ignore */ }
            writeExploreToUrl(wanted);
            exploreControl.setActive(wanted ? "all" : "recipes");
            rows = computeRows();
            refreshStatus();
            renderNowSection(seasonality, index, nowSectionEl);
            renderGantt(root, rows);
          },
          "Ingrédients"
        );
        requestAnimationFrame(() => {
          modeControl.setActive(state.layoutMode);
          exploreControl.setActive(state.showExploratory ? "all" : "recipes");
        });
      }

      setupIngredientFilter(root, index, seasonality, (id) => {
        state.filterIngredient = id;
        writeIngredientFilterToUrl(id);
        rows = computeRows();
        renderGantt(root, rows);
      });

      renderGantt(root, rows);
      window.__calendrier = {
        index, seasonality, get rows() { return rows; }, state,
        __buckets(date) { return bucketsFor(seasonality, computeNowQuinzaine(date).absIdx); },
      };

      let lastResizeWidth = window.innerWidth;
      window.addEventListener("resize", debounce(() => {
        // Skip re-render while the ingredient filter input is focused —
        // mobile keyboards fire resize on open/close and re-rendering would
        // detach the input and close the keyboard mid-typing.
        const filterInput = root.querySelector(".cal-ing-input");
        if (filterInput && document.activeElement === filterInput) return;
        // Ignore height-only resizes (mobile URL bar auto-hide/show) — width
        // is what actually affects layout. This prevents phantom re-renders
        // that were causing the page to periodically scroll to the top.
        const w = window.innerWidth;
        if (w === lastResizeWidth) return;
        lastResizeWidth = w;
        // In "wide" mode the SVG has a fixed pixel width so no re-render is
        // needed on resize; the scroll wrapper handles it.
        if (state.layoutMode === "fit") renderGantt(root, rows);
        if (modeControl) modeControl.setActive(state.layoutMode);
        if (exploreControl) exploreControl.setActive(state.showExploratory ? "all" : "recipes");
      }, 150));
    } catch (err) {
      console.error("[calendrier] load failed", err);
      status.textContent = `Erreur de chargement : ${err.message}`;
      status.classList.remove("hidden");
    }
  });

  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }
})();
