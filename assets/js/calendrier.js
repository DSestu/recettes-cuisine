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
  const WIDE_CELL_W_MOBILE = WIDE_CELL_W_BASE * 0.75; // 42 px per quinzaine

  const LAYOUT_URL_PARAM = "vue";

  function initialLayoutMode() {
    // URL wins so shared links land in the intended view.
    const fromUrl = new URLSearchParams(location.search).get(LAYOUT_URL_PARAM);
    if (fromUrl === "fit" || fromUrl === "wide") return fromUrl;
    try {
      const stored = localStorage.getItem("calendrier.layoutMode");
      if (stored === "fit" || stored === "wide") return stored;
    } catch (_) { /* localStorage unavailable */ }
    // Sensible default: on narrow viewports the "fit" mode is too cramped.
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

  const state = {
    showExploratory: initialShowExploratory(),
    layoutMode: initialLayoutMode(),
    collapsedCategories: initialCollapsedCategories(),
  };

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

  function buildRows(index, seasonality) {
    const rows = [];
    for (const cat of CATEGORY_ORDER) {
      const ings = [];
      for (const [id, meta] of Object.entries(seasonality)) {
        if (meta.category !== cat) continue;
        const nRecipes = (index.ingredients[id]?.recipes || []).length;
        if (!state.showExploratory && nRecipes === 0) continue;
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

  function renderGantt(container, rows) {
    d3.select(container).selectAll("*").remove();

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
    const LABEL_W = isMobile ? 140 : 300;
    const NAME_FONT = isMobile ? 12 : 14;
    const NAME_LINE_H = Math.round(NAME_FONT * 1.15);
    const BAR_X = LABEL_W - LABEL_PAD_R - BAR_W;
    const COUNT_X = showRecipeBar ? BAR_X - 6 : LABEL_W - LABEL_PAD_R;
    const NAME_MAX_X = showRecipeCount ? COUNT_X - 26 : LABEL_W - LABEL_PAD_R;
    const NAME_MAX_WIDTH = NAME_MAX_X - 14;
    const ROW_H = 34;
    const GROUP_HEADER_H = 38;
    const GROUP_GAP = 8;
    const MONTH_HEADER_H = 40;
    const RIGHT_PAD = 14;

    const containerWidth = container.clientWidth || 900;
    let cellW, gridW, svgWidth;
    if (state.layoutMode === "wide") {
      cellW = isMobile ? WIDE_CELL_W_MOBILE : WIDE_CELL_W_DESKTOP;
      gridW = cellW * 24;
      svgWidth = LABEL_W + gridW + RIGHT_PAD;
    } else {
      gridW = Math.max(600, containerWidth) - LABEL_W - RIGHT_PAD;
      cellW = gridW / 24;
      svgWidth = LABEL_W + gridW + RIGHT_PAD;
    }

    // Per-category layout with collapse state applied. Y coordinates are
    // relative to the BODY (excluding the month header row).
    function computeCatLayout() {
      const cats = [];
      let cy = 0;
      for (const g of rows) {
        const collapsed = state.collapsedCategories.has(g.category);
        const fullContentH = g.ingredients.length * ROW_H;
        const contentH = collapsed ? 0 : fullContentH;
        cats.push({ ...g, y: cy, contentH, fullContentH, collapsed });
        cy += GROUP_HEADER_H + contentH + GROUP_GAP;
      }
      return { cats, bodyH: Math.max(1, cy - GROUP_GAP) };
    }
    let { cats: catLayout, bodyH } = computeCatLayout();

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

    const topLeftSvg = topRow.append("svg")
      .attr("viewBox", `0 0 ${LABEL_W} ${MONTH_HEADER_H}`)
      .attr("width", LABEL_W).attr("height", MONTH_HEADER_H)
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block")
      .style("flex", `0 0 ${LABEL_W}px`)
      .style("position", "sticky")
      .style("left", "0")
      .style("z-index", "4")
      .style("background", "#fff7ed")
      .style("box-shadow", "2px 0 6px rgba(0,0,0,0.06)");
    topLeftSvg.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", LABEL_W).attr("height", MONTH_HEADER_H)
      .attr("fill", "#fff7ed");

    const topRightSvg = topRow.append("svg")
      .attr("viewBox", `0 0 ${rightWidth} ${MONTH_HEADER_H}`)
      .attr("height", MONTH_HEADER_H)
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block");
    if (state.layoutMode === "wide") {
      topRightSvg
        .attr("width", rightWidth)
        .style("flex", `0 0 ${rightWidth}px`)
        .style("min-width", rightWidth + "px");
    } else {
      topRightSvg
        .attr("width", "100%")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .style("flex", "1 1 auto");
    }

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
      topRightSvg.append("text")
        .attr("x", col * cellW + w / 2).attr("y", MONTH_HEADER_H / 2 + 6)
        .attr("text-anchor", "middle")
        .attr("fill", "#7c2d12")
        .attr("font-size", 15).attr("font-weight", 600)
        .text(MONTH_LABELS_FR[monthIdx]);
      col = end;
    }

    // ---- Body band: labels (sticky-left) + grid. ----
    const bodyWrap = scrollWrap.append("div");
    if (state.layoutMode === "wide") {
      bodyWrap
        .style("overflow-x", "auto")
        .style("overflow-y", "visible")
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
      .attr("viewBox", `0 0 ${LABEL_W} ${bodyH}`)
      .attr("width", LABEL_W).attr("height", bodyH)
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block")
      .style("flex", `0 0 ${LABEL_W}px`)
      .style("position", "sticky")
      .style("left", "0")
      .style("z-index", "2")
      .style("background", "#fff7ed")
      .style("box-shadow", "2px 0 6px rgba(0,0,0,0.06)");

    const rightSvg = bodyRow.append("svg")
      .attr("viewBox", `0 0 ${rightWidth} ${bodyH}`)
      .attr("height", bodyH)
      .attr("font-family", "Inter, ui-sans-serif, system-ui, sans-serif")
      .style("display", "block");
    if (state.layoutMode === "wide") {
      rightSvg
        .attr("width", rightWidth)
        .style("flex", `0 0 ${rightWidth}px`)
        .style("min-width", rightWidth + "px");
    } else {
      rightSvg
        .attr("width", "100%")
        .attr("preserveAspectRatio", "xMinYMin meet")
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

    // Current-quinzaine highlight band (body-right SVG, spans full body height).
    rightSvg.append("rect")
      .attr("class", "cal-fullh-rect")
      .attr("x", currentDisplayCol * cellW).attr("y", 0)
      .attr("width", cellW).attr("height", bodyH)
      .attr("fill", "#f97316").attr("opacity", 0.10)
      .attr("pointer-events", "none");

    // Month-boundary vertical lines.
    for (let c = 1; c < 24; c++) {
      const isBoundary = Math.floor(displaySlots[c] / 2) !== Math.floor(displaySlots[c - 1] / 2);
      if (!isBoundary) continue;
      rightSvg.append("line")
        .attr("class", "cal-fullh-line")
        .attr("x1", c * cellW).attr("x2", c * cellW)
        .attr("y1", 0).attr("y2", bodyH)
        .attr("stroke", "#fed7aa").attr("stroke-width", 1);
    }

    // clipPath defs per category / side — animate their rect height for accordion.
    const clipDefs = leftSvg.append("defs");
    const clipDefsR = defs;
    for (const cat of catLayout) {
      clipDefs.append("clipPath").attr("id", `cal-clip-${cat.category}-l`)
        .append("rect")
        .attr("class", `cal-clip-rect-${cat.category}`)
        .attr("x", 0).attr("y", 0).attr("width", LABEL_W).attr("height", cat.contentH);
      clipDefsR.append("clipPath").attr("id", `cal-clip-${cat.category}-r`)
        .append("rect")
        .attr("class", `cal-clip-rect-${cat.category}`)
        .attr("x", 0).attr("y", 0).attr("width", rightWidth).attr("height", cat.contentH);
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

      // Header: clickable, contains chevron + colored bar + label.
      const leftHdr = leftCatG.append("g")
        .attr("class", "cal-hdr")
        .attr("cursor", "pointer")
        .attr("role", "button")
        .attr("aria-label", `Replier ou déplier ${CATEGORY_LABELS[cat.category]}`)
        .style("user-select", "none")
        .on("click", () => toggleCategory(cat.category));
      leftHdr.append("rect")
        .attr("x", 0).attr("y", 0).attr("width", LABEL_W).attr("height", GROUP_HEADER_H)
        .attr("fill", "#fff7ed");
      leftHdr.append("rect")
        .attr("x", 0).attr("y", 0).attr("width", 4).attr("height", GROUP_HEADER_H)
        .attr("fill", color);
      leftHdr.append("text")
        .attr("x", 14).attr("y", GROUP_HEADER_H / 2 + 6)
        .attr("fill", "#431407")
        .attr("font-size", 17).attr("font-weight", 700)
        .text(CATEGORY_LABELS[cat.category]);
      // Chevron on the far right of the header. Rotates 0° when expanded, −90° when collapsed.
      leftHdr.append("g")
        .attr("class", `cal-chevron cal-chevron-${cat.category}`)
        .attr("transform", `translate(${LABEL_W - 20}, ${GROUP_HEADER_H / 2}) rotate(${cat.collapsed ? -90 : 0})`)
        .attr("pointer-events", "none")
        .append("path")
        .attr("d", "M -6 -3 L 0 3 L 6 -3")
        .attr("fill", "none")
        .attr("stroke", "#7c2d12")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");

      // Rows wrapper — clipped so overflowing rows are hidden during animation.
      const leftRowsWrap = leftCatG.append("g")
        .attr("class", "cal-rows-wrap")
        .attr("clip-path", `url(#cal-clip-${cat.category}-l)`);
      const leftRows = leftRowsWrap.append("g")
        .attr("class", "cal-rows")
        .attr("transform", `translate(0, ${GROUP_HEADER_H})`);

      // ----- RIGHT side -----
      const rightCatG = rightSvg.append("g")
        .attr("class", `cal-cat cal-cat-${cat.category}`)
        .attr("data-cat", cat.category)
        .attr("transform", `translate(0, ${cat.y})`);

      rightCatG.append("rect")
        .attr("class", "cal-hdr-bg")
        .attr("x", 0).attr("y", 0).attr("width", rightWidth).attr("height", GROUP_HEADER_H)
        .attr("fill", "#fff7ed");

      const rightRowsWrap = rightCatG.append("g")
        .attr("class", "cal-rows-wrap")
        .attr("clip-path", `url(#cal-clip-${cat.category}-r)`);
      const rightRows = rightRowsWrap.append("g")
        .attr("class", "cal-rows")
        .attr("transform", `translate(0, ${GROUP_HEADER_H})`);

      // ----- Ingredient rows (yLocal starts at 0 inside cal-rows). -----
      let yLocal = 0;
      for (const ing of cat.ingredients) {
        const labelG = leftRows.append("g")
          .attr("class", "calendrier-row")
          .attr("data-ingredient", ing.id)
          .attr("cursor", ing.recipeCount > 0 ? "pointer" : "default");

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
      .attr("y1", 0).attr("y2", bodyH)
      .attr("stroke", "#dc2626").attr("stroke-width", 1.25);
    todayLayer.append("path")
      .attr("d", `M ${todayX - 4} 0 L ${todayX + 4} 0 L ${todayX} 5 Z`)
      .attr("fill", "#dc2626");
    todayLayer.append("title").text("Aujourd'hui");

    // ---- Toggle animation ----
    function toggleCategory(catId) {
      if (state.collapsedCategories.has(catId)) state.collapsedCategories.delete(catId);
      else state.collapsedCategories.add(catId);
      persistCollapsedCategories(state.collapsedCategories);

      const { cats: newCats, bodyH: newBodyH } = computeCatLayout();
      catLayout = newCats;
      bodyH = newBodyH;

      const D = 320;
      const ease = d3.easeCubicInOut;

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
        leftSvg.select(`.cal-chevron-${cat.category}`)
          .transition().duration(D).ease(ease)
          .attr("transform", `translate(${LABEL_W - 20}, ${GROUP_HEADER_H / 2}) rotate(${cat.collapsed ? -90 : 0})`);
      }

      // Body SVG heights + viewBox (month header row stays constant).
      leftSvg.transition().duration(D).ease(ease)
        .attr("height", newBodyH)
        .attr("viewBox", `0 0 ${LABEL_W} ${newBodyH}`);
      rightSvg.transition().duration(D).ease(ease)
        .attr("height", newBodyH)
        .attr("viewBox", `0 0 ${rightWidth} ${newBodyH}`);

      rightSvg.selectAll(".cal-fullh-rect")
        .transition().duration(D).ease(ease)
        .attr("height", newBodyH);
      rightSvg.selectAll(".cal-fullh-line, .cal-today-line")
        .transition().duration(D).ease(ease)
        .attr("y2", newBodyH);
    }
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

  // Segmented toggle mirroring the home page's "recipes per row" selector
  // (see assets/js/cols-selector.js). Sliding indicator + labelled buttons.
  function buildSegmentedToggle(mount, options, ariaLabel, onPick) {
    const wrap = document.createElement("div");
    wrap.className =
      "inline-flex items-stretch rounded-lg border border-primary/40 bg-white/70 backdrop-blur shadow-sm overflow-hidden";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", ariaLabel);

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

    try {
      const { index, seasonality } = await loadData(root);
      let rows = buildRows(index, seasonality);
      const total = Object.keys(seasonality).length;

      function refreshStatus() {
        const n = rows.reduce((s, g) => s + g.ingredients.length, 0);
        const hidden = total - n;
        status.textContent = state.showExploratory
          ? `Mode exploration : ${n} ingrédients affichés (${total} au total).`
          : `${n} ingrédients affichés (${hidden} exploratoires masqués).`;
      }
      refreshStatus();

      // Make the URL reflect the resolved state from the start (so copy-paste of
      // the URL preserves the view, even when the initial values came from
      // localStorage or the viewport-based default).
      writeLayoutModeToUrl(state.layoutMode);
      writeExploreToUrl(state.showExploratory);

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
        const exploreMount = document.createElement("div");
        controlsMount.appendChild(modeMount);
        controlsMount.appendChild(exploreMount);

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
            rows = buildRows(index, seasonality);
            refreshStatus();
            renderGantt(root, rows);
          }
        );
        requestAnimationFrame(() => {
          modeControl.setActive(state.layoutMode);
          exploreControl.setActive(state.showExploratory ? "all" : "recipes");
        });
      }

      renderGantt(root, rows);
      window.__calendrier = { index, seasonality, get rows() { return rows; }, state };

      window.addEventListener("resize", debounce(() => {
        // In "wide" mode the SVG has a fixed pixel width so no re-render is
        // needed on resize; the scroll wrapper handles it.
        if (state.layoutMode === "fit") renderGantt(root, rows);
        if (modeControl) modeControl.setActive(state.layoutMode);
        if (exploreControl) exploreControl.setActive(state.showExploratory ? "all" : "recipes");
      }, 150));
    } catch (err) {
      console.error("[calendrier] load failed", err);
      status.textContent = `Erreur de chargement : ${err.message}`;
      status.classList.add("text-red-700");
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
