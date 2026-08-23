// Shared seasonality primitives: fortnight math, per-fortnight scoring, the
// colour ramp, and the two strip renderers (aggregate curve + per-ingredient
// cells). Consumed by `calendrier.js` (recettes-de-saison mode) and by the
// per-recipe panel in `_includes/recipe-seasonality.html`, so both views draw
// the exact same signature.
//
// Dependencies: `d3.line`, `d3.area`, `d3.curveMonotoneX` only — the calendrier
// loads the full d3 bundle, recipe pages load just d3-shape. DOM plumbing is
// plain `document.createElement` so no d3-selection is required.
(function () {
  "use strict";

  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const MONTH_LABELS_FR = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

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

  // Categories whose ingredients carry a season (mirrors
  // `TEMPORAL_CATEGORIES` in scripts/generate_recipe_seasonality.py).
  const TEMPORAL_CATEGORIES = [
    "legume", "fruit", "herbe", "champignon",
    "poisson", "coquillage", "viande", "fromage",
  ];

  const TOKEN_RE = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-([12]):(start|peak|end)$/;

  const PHASE_WEIGHTS = { peak: 1.0, start: 0.5, end: 0.5 };

  // "mar-2:start, apr-1:peak" → Map(fortnightIdx → phase).
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

  // Same tokens as `parseSeason`, but shaped like the `phases` maps in
  // assets/data/recipe-seasonality.json: plain object keyed by "0".."23".
  // That's the shape `scoreSeries` / `renderIngredientStrip` consume.
  function phasesFromSeason(seasonStr) {
    const out = {};
    for (const [idx, phase] of parseSeason(seasonStr)) out[String(idx)] = phase;
    return out;
  }

  // Fortnight index math: (month - 1) * 2 + (day <= 15 ? 0 : 1). Range 0..23.
  function currentFortnightIdx(date) {
    const d = date || new Date();
    return d.getMonth() * 2 + (d.getDate() <= 15 ? 0 : 1);
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

  const SVG_NS = "http://www.w3.org/2000/svg";

  // Minimal `d3.select().append().attr()` replacement so this module needs
  // d3-shape only (recipe pages skip the 270 kB full d3 bundle).
  function svgEl(tag, attrs, innerHTML) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
    }
    if (innerHTML != null) node.innerHTML = innerHTML;
    return node;
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
    const svgAttrs = {
      viewBox: `0 0 ${W} ${H}`,
      preserveAspectRatio: "none",
      "aria-hidden": "true",
    };
    const svgBack = svgEl("svg", { class: "cal-strip-svg cal-strip-svg-back", ...svgAttrs });
    const svg = svgEl("svg", { class: "cal-strip-svg cal-strip-svg-front", ...svgAttrs });
    container.append(svgBack, svg);

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
    const defs = svgEl("defs", null,
      `<linearGradient id="grad-${uid}" x1="0" x2="1" y1="0" y2="0">${stops.join("")}</linearGradient>`
    );
    svg.appendChild(defs);

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
    svgBack.appendChild(svgEl("defs", null,
      `<linearGradient id="grad-back-${uid}" x1="0" x2="1" y1="0" y2="0">${stops.join("")}</linearGradient>`
    ));
    svgBack.appendChild(svgEl("path", {
      d: areaPath,
      fill: `url(#grad-back-${uid})`,
      opacity: 0.30,
    }));

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
    container.insertBefore(hatchLayer, svg);

    // Curve outline — thicker so it stays legible against the fill.
    svg.appendChild(svgEl("path", {
      d: line(series),
      fill: "none",
      stroke: `url(#grad-${uid})`,
      "stroke-width": 4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "vector-effect": "non-scaling-stroke",
    }));

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
      defs.appendChild(svgEl("linearGradient", {
        id: maskGradId, x1: "0", x2: "1", y1: "0", y2: "0",
      }, maskStops.join("")));
      defs.appendChild(svgEl("mask", {
        id: maskId,
        maskUnits: "userSpaceOnUse",
        x: 0, y: 0, width: W, height: H,
      }, `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#${maskGradId})"/>`));

      // Halo — wide, translucent fresh green; visibility ramps with score.
      svg.appendChild(svgEl("path", {
        d: line(series),
        fill: "none",
        stroke: "#3F9A5F",
        "stroke-width": 10,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        opacity: 0.32,
        mask: `url(#${maskId})`,
        "vector-effect": "non-scaling-stroke",
      }));
      // Emphasis — thicker deep teal-green stroke, same mask.
      svg.appendChild(svgEl("path", {
        d: line(series),
        fill: "none",
        stroke: "#0F4C3A",
        "stroke-width": 6.5,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        mask: `url(#${maskId})`,
        "vector-effect": "non-scaling-stroke",
      }));
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

  window.SeasonalityStrip = {
    MONTHS,
    MONTH_LABELS_FR,
    CATEGORY_LABELS,
    CATEGORY_COLORS,
    TEMPORAL_CATEGORIES,
    TOKEN_RE,
    PHASE_WEIGHTS,
    parseSeason,
    phasesFromSeason,
    currentFortnightIdx,
    scoreSeries,
    scoreColor,
    renderStrip,
    renderIngredientStrip,
  };
})();
