/**
 * Servings scaler — rescale a recipe's quantities to a chosen serving count.
 *
 * Quantities are tokenised at build time (scripts/generate_recipe_scaling.py)
 * and inlined by _includes/recipe-scaler.html as `#scaling-data`, keyed by
 * collection path. Each `<ul data-scale-scope>` names its key; each `<li>`
 * carries its index into that list. Tokens are located inside a row by their
 * verbatim `m` substring, which survives kramdown wrapping and the checkbox
 * script's re-parenting of `<li>` children.
 *
 * Prose directions (the markdown body) have no build-time tokens, so they get
 * a runtime pass restricted to a mass/volume/spoon whitelist. Durations,
 * temperatures and dimensions share the "<number> <word>" shape and must never
 * be touched, which is why the pass whitelists units rather than excluding
 * them.
 *
 * The scaler only ever rewrites text: it never adds or removes an `<li>`, so
 * the flat `<li>` indices the checkbox script persists in `?cb=` stay valid.
 */
(function () {
  "use strict";

  var PARAM = "pers";
  var ACCENT = "rgba(245, 50, 0, 0.65)";
  var MIN = 1;

  // Resolved from the inlined data in init(); the definitions above it stay
  // DOM-free so the number rendering can be unit-tested under Node.
  var DATA = null;
  var BASE = 4;
  var UNIT = "personnes";
  var MAX = 12;

  // ------------------------------------------------------------ numbers

  var VULGAR = { 0.25: "¼", 0.5: "½", 0.75: "¾" };

  /**
   * French number rendering: comma decimals, and vulgar fractions where a
   * cook would write one. Spoons and countable items take them ("½ oignon",
   * "¾ c. à c."); masses and volumes do not — "0,75 kg" reads as a weight,
   * "¾ kg" does not.
   */
  function fmtNum(v, cls) {
    if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
    if (cls !== "mass" && cls !== "volume") {
      var whole = Math.floor(v + 1e-9);
      var frac = Math.round((v - whole) * 10000) / 10000;
      if (VULGAR[frac]) return (whole ? whole + " " : "") + VULGAR[frac];
    }
    return String(Math.round(v * 100) / 100).replace(".", ",");
  }

  /**
   * Round a scaled quantity to something a cook can measure.
   *
   * Mass and volume use magnitude-dependent precision, except for kg and l
   * where a coarse step would be a large error (halving 1,2 kg must give
   * 0,6 kg, not 0,5 kg). Counts go to the nearest half; packaging and pinches
   * stay whole and never drop below one.
   */
  function roundQty(v, cls, unit) {
    if (cls === "spoon") return Math.max(0.25, Math.round(v * 4) / 4);
    if (cls === "pinch" || cls === "discrete") return Math.max(1, Math.round(v));
    if (cls === "count") return Math.max(0.5, Math.round(v * 2) / 2);
    if (unit === "kg" || unit === "l") {
      return v < 1 ? Math.round(v * 100) / 100 : Math.round(v * 10) / 10;
    }
    if (v < 10) return Math.max(0.5, Math.round(v * 2) / 2);
    if (v < 50) return Math.round(v);
    if (v < 200) return Math.round(v / 5) * 5;
    return Math.round(v / 10) * 10;
  }

  function renderToken(tok, factor) {
    var q = roundQty(tok.q * factor, tok.cls, tok.u);
    var out = tok.tpl.replace("{q}", fmtNum(q, tok.cls));
    var top = q;
    if (tok.q2 != null) {
      top = roundQty(tok.q2 * factor, tok.cls, tok.u);
      out = out.replace("{q2}", fmtNum(top, tok.cls));
    }
    if (out.indexOf("{n}") >= 0) {
      // French agrees the noun with the upper bound; 1,5 stays singular.
      out = out.replace("{n}", top >= 2 ? tok.pl : tok.sg);
    }
    return out;
  }

  // ------------------------------------------------------- text rewriting

  var ORIG = new WeakMap();

  /** Length-preserving folds, so match offsets map 1:1 onto the raw text. */
  function normalize(s) {
    return s
      .replace(/[’‘]/g, "'")
      .replace(/[\u00a0\u202f\u2009]/g, " ")
      .replace(/[‐‑‒–]/g, "-");
  }

  function textNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var out = [];
    var n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  /** Restore every cached node under `root` to the text the page shipped. */
  function snapshot(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var cached = ORIG.get(nodes[i]);
      if (cached === undefined) ORIG.set(nodes[i], nodes[i].nodeValue);
      else nodes[i].nodeValue = cached;
    }
  }

  /**
   * Replace `[start, start+len)` of the concatenated text with `repl`.
   *
   * A match can straddle several text nodes when kramdown wrapped part of it
   * in `<strong>`/`<em>`: the first covering node receives the whole
   * replacement and the rest drop their covered slice. Callers must apply
   * edits right-to-left so offsets computed on the original text stay valid.
   */
  function spliceRange(nodes, offsets, start, len, repl) {
    var end = start + len;
    for (var i = nodes.length - 1; i >= 0; i--) {
      var nodeStart = offsets[i];
      var nodeEnd = nodeStart + ORIG.get(nodes[i]).length;
      if (nodeEnd <= start || nodeStart >= end) continue;
      var from = Math.max(start, nodeStart) - nodeStart;
      var to = Math.min(end, nodeEnd) - nodeStart;
      var v = nodes[i].nodeValue;
      nodes[i].nodeValue =
        v.slice(0, from) + (nodeStart <= start ? repl : "") + v.slice(to);
    }
  }

  /** Apply ordered [needle, replacement] pairs to the text under `root`. */
  function applyPairs(root, pairs) {
    var nodes = textNodes(root);
    if (!nodes.length) return;
    snapshot(nodes);
    if (!pairs.length) return;

    var combined = "";
    var offsets = [];
    for (var i = 0; i < nodes.length; i++) {
      offsets.push(combined.length);
      combined += nodes[i].nodeValue;
    }
    var hay = normalize(combined);

    var edits = [];
    var cursor = 0;
    for (var j = 0; j < pairs.length; j++) {
      var needle = normalize(pairs[j][0]);
      var at = hay.indexOf(needle, cursor);
      if (at < 0) at = hay.indexOf(needle);
      if (at < 0) continue;
      cursor = at + needle.length;
      edits.push([at, needle.length, pairs[j][1]]);
    }
    edits.sort(function (a, b) {
      return b[0] - a[0];
    });
    for (var k = 0; k < edits.length; k++) {
      spliceRange(nodes, offsets, edits[k][0], edits[k][1], edits[k][2]);
    }
  }

  // ------------------------------------------------- prose direction pass

  var SPOON = "c\\.?\\s*à\\s*(?:s\\.?|c\\.?|soupe|café|cafe)|cuillères?\\s+à\\s+(?:soupe|café|cafe)";
  var UNITS =
    "kilogrammes?|kilos?|grammes?|millilitres?|centilitres?|décilitres?|litres?|" +
    "kg|ml|cl|dl|g|l|" + SPOON + "|pincées?";
  var BODY_RE = new RegExp(
    "(\\d+(?:[.,]\\d+)?|[½¼¾])\\s*(" + UNITS + ")(?![A-Za-zÀ-ÿ])",
    "gi"
  );
  // A bare "l" is only a litre when a quantity follows it, never in "1 lot".
  var LITRE_OK = /^\s*(?:d['’]|de\b|$|[,.;:)])/;

  /** Mass/volume scale hint, mirroring canonical_unit() in the generator. */
  function canonicalUnit(literal) {
    var s = literal.trim().toLowerCase();
    if (/^(kg|kilo)/.test(s)) return "kg";
    if (/^(g|gr)/.test(s)) return "g";
    if (/^(ml|milli)/.test(s)) return "ml";
    if (/^(cl|centi)/.test(s)) return "cl";
    if (/^(dl|déci|deci)/.test(s)) return "dl";
    if (/^(l|litre)/.test(s)) return "l";
    return null;
  }

  // Spelled-out units agree with the number; abbreviations never do. Mirrors
  // PLURALISABLE_UNITS in scripts/generate_recipe_scaling.py.
  var UNIT_WORD = /^(gramme|kilogramme|kilo|litre|millilitre|centilitre|décilitre|pincée|cuillère)(s?)(.*)$/i;

  function inflectUnit(literal, qty) {
    var m = UNIT_WORD.exec(literal);
    if (!m) return literal;
    return m[1] + (qty >= 2 ? "s" : "") + m[3];
  }

  function scaleProse(root, factor) {
    var nodes = textNodes(root);
    snapshot(nodes);
    if (factor === 1) return;

    for (var i = 0; i < nodes.length; i++) {
      var original = ORIG.get(nodes[i]);
      if (!original || !/\d|[½¼¾]/.test(original)) continue;
      BODY_RE.lastIndex = 0;
      nodes[i].nodeValue = original.replace(BODY_RE, function (
        match,
        rawNum,
        unit,
        offset
      ) {
        if (unit.toLowerCase() === "l" && !LITRE_OK.test(original.slice(offset + match.length))) {
          return match;
        }
        var value = VULGAR_VALUE(rawNum);
        if (value == null) return match;
        var canon = canonicalUnit(unit);
        var cls = canon ? "mass" : /^pincée/i.test(unit) ? "pinch" : "spoon";
        var scaled = roundQty(value * factor, cls, canon);
        return match
          .replace(rawNum, fmtNum(scaled, cls))
          .replace(unit, inflectUnit(unit, scaled));
      });
    }
  }

  function VULGAR_VALUE(raw) {
    if (VULGAR_LOOKUP[raw] != null) return VULGAR_LOOKUP[raw];
    var v = parseFloat(raw.replace(",", "."));
    return isNaN(v) ? null : v;
  }
  var VULGAR_LOOKUP = { "½": 0.5, "¼": 0.25, "¾": 0.75 };

  // ------------------------------------------------------- servings label

  var SERVINGS_RE = /\b([Pp]our)\s+\d+(?:\s*(?:à|-|ou)\s*\d+)?\s+(personnes?|pièces?|parts?|portions?)/g;

  function scaleServingsText(n) {
    var root = document.querySelector(".post-content");
    if (!root) return;
    var nodes = textNodes(root);
    for (var i = 0; i < nodes.length; i++) {
      // Reads the live value, not the snapshot: the prose pass has already
      // rewritten this node and its edits must survive. Safe to repeat, since
      // the pattern matches whatever count is currently displayed.
      var current = nodes[i].nodeValue;
      if (!/[Pp]our\s+\d/.test(current)) continue;
      SERVINGS_RE.lastIndex = 0;
      nodes[i].nodeValue = current.replace(SERVINGS_RE, function (m, pour, noun) {
        var word = n === 1 ? noun.replace(/s$/, "") : noun;
        if (n > 1 && !/s$/.test(word)) word += "s";
        return pour + " " + n + " " + word;
      });
    }
  }

  // --------------------------------------------------------------- apply

  function apply(n) {
    var factor = n / BASE;

    document.querySelectorAll("[data-scale-scope]").forEach(function (list) {
      var entry = DATA[list.getAttribute("data-scale-scope")];
      if (!entry) return;
      // Inline components are written for the parent recipe, so they follow
      // the parent's factor rather than their own (unrelated) serving count.
      list.querySelectorAll("[data-scale-ing], [data-scale-dir]").forEach(
        function (row) {
          var isIng = row.hasAttribute("data-scale-ing");
          var bucket = isIng ? entry.ing : entry.dir;
          var idx = row.getAttribute(isIng ? "data-scale-ing" : "data-scale-dir");
          var toks = bucket && bucket[idx];
          if (!toks) {
            applyPairs(row, []);
            return;
          }
          applyPairs(
            row,
            factor === 1
              ? []
              : toks.map(function (t) {
                  return [t.m, renderToken(t, factor)];
                })
          );
        }
      );
    });

    document
      .querySelectorAll(
        '[itemprop="recipeInstructions"]:not([data-scale-scope]),' +
          '[itemprop="instructions"]:not([data-scale-scope])'
      )
      .forEach(function (root) {
        scaleProse(root, factor);
      });

    scaleServingsText(n);
  }

  // -------------------------------------------------------------- stepper

  function buildStepper(current, onPick) {
    var wrap = document.createElement("div");
    wrap.className =
      "inline-flex items-stretch rounded-lg border border-primary/40 bg-white/70 backdrop-blur shadow-sm overflow-hidden";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Nombre de " + UNIT);

    function mkButton(label, aria) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.setAttribute("aria-label", aria);
      b.className =
        "px-3 py-1 text-base font-semibold text-red-900/70 hover:bg-primary/10 " +
        "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 " +
        "disabled:opacity-30 disabled:hover:bg-transparent";
      return b;
    }

    var minus = mkButton("−", "Diminuer les quantités");
    var value = document.createElement("span");
    value.className =
      "flex items-center px-3 py-1 text-sm font-bold text-white whitespace-nowrap tabular-nums";
    value.style.backgroundColor = ACCENT;
    var plus = mkButton("+", "Augmenter les quantités");

    var reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "↺";
    reset.title = "Revenir aux quantités d'origine";
    reset.setAttribute("aria-label", "Revenir aux quantités d'origine");
    reset.className =
      "px-2 py-1 text-base text-red-900/70 hover:bg-primary/10 border-l border-primary/30 " +
      "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30";

    wrap.appendChild(minus);
    wrap.appendChild(value);
    wrap.appendChild(plus);
    wrap.appendChild(reset);

    function setValue(n) {
      var word = UNIT;
      if (n === 1 && UNIT === "personnes") word = "personne";
      value.textContent = n + " " + word;
      minus.disabled = n <= MIN;
      plus.disabled = n >= MAX;
      reset.style.display = n === BASE ? "none" : "";
    }

    minus.addEventListener("click", function () {
      onPick(Math.max(MIN, current - 1));
    });
    plus.addEventListener("click", function () {
      onPick(Math.min(MAX, current + 1));
    });
    reset.addEventListener("click", function () {
      onPick(BASE);
    });

    setValue(current);
    return {
      wrap: wrap,
      setValue: function (n) {
        current = n;
        setValue(n);
      },
    };
  }

  function writeUrl(n) {
    try {
      var url = new URL(window.location.href);
      if (n === BASE) url.searchParams.delete(PARAM);
      else url.searchParams.set(PARAM, String(n));
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      /* noop */
    }
  }

  function readUrl() {
    var raw = new URLSearchParams(window.location.search).get(PARAM);
    var n = parseInt(raw, 10);
    if (!isFinite(n)) return BASE;
    return Math.min(MAX, Math.max(MIN, n));
  }

  function init() {
    var dataEl = document.getElementById("scaling-data");
    if (!dataEl) return;
    try {
      DATA = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    var scriptEl = document.querySelector('script[src*="servings-scaler"]');
    var pagePath = scriptEl ? scriptEl.getAttribute("data-scope") : null;
    var page = pagePath ? DATA[pagePath] : null;
    if (!page) return;

    BASE = page.servings > 0 ? page.servings : 4;
    UNIT = page.servings_unit || "personnes";
    MAX = Math.max(12, BASE * 2);

    var mount = document.getElementById("servings-scaler-mount");
    if (!mount) return;

    var current = readUrl();
    var stepper = buildStepper(current, function (n) {
      if (n === current) return;
      current = n;
      stepper.setValue(n);
      apply(n);
      writeUrl(n);
    });
    mount.appendChild(stepper.wrap);
    apply(current);
  }

  // The checkbox block in _layouts/recipe.html registers its DOMContentLoaded
  // handler while parsing, so it re-wraps `<li>` children before this deferred
  // script's handler runs — text nodes are already in their final parents.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      fmtNum: fmtNum,
      roundQty: roundQty,
      renderToken: renderToken,
      canonicalUnit: canonicalUnit,
      applyPairs: applyPairs,
      scaleProse: scaleProse,
    };
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
