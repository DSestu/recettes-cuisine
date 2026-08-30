/**
 * Text rewriting for the servings scaler, against a minimal DOM shim.
 *
 * Covers the parts that only fail in a real page: a quantity split across
 * several text nodes because kramdown wrapped part of it in `<strong>`, two
 * quantities inside one row, repeated identical quantities, restoring the
 * original text when the count returns to the recipe's own, and the prose
 * pass leaving durations and temperatures alone.
 *
 * Run: `node tests/test_scaler_dom.js`
 */
const assert = require("assert");

// --- minimal DOM ----------------------------------------------------------

class TextNode {
  constructor(value) {
    this.nodeType = 3;
    this.nodeValue = value;
    this.childNodes = [];
  }
}
class Element {
  constructor(children) {
    this.nodeType = 1;
    this.childNodes = children.map((c) =>
      typeof c === "string" ? new TextNode(c) : c
    );
  }
  get text() {
    return this.childNodes
      .map((c) => (c.nodeType === 3 ? c.nodeValue : c.text))
      .join("");
  }
}
function el(...children) {
  return new Element(children);
}

global.NodeFilter = { SHOW_TEXT: 4 };
global.document = {
  createTreeWalker(root) {
    const out = [];
    (function walk(node) {
      for (const c of node.childNodes) {
        if (c.nodeType === 3) out.push(c);
        else walk(c);
      }
    })(root);
    let i = 0;
    return { nextNode: () => (i < out.length ? out[i++] : null) };
  },
};

const S = require("../assets/js/servings-scaler.js");

let passed = 0;
function check(label, actual, expected) {
  assert.strictEqual(actual, expected, `${label}\n  got:  ${actual}\n  want: ${expected}`);
  passed++;
}

// --- single-node replacement ----------------------------------------------

let row = el("400 g de morue séchée");
S.applyPairs(row, [["400 g", "200 g"]]);
check("simple replacement", row.text, "200 g de morue séchée");

// --- idempotence: re-applying works from the original, not the result -----

S.applyPairs(row, [["400 g", "800 g"]]);
check("re-scales from the original", row.text, "800 g de morue séchée");
S.applyPairs(row, []);
check("empty pairs restore the original", row.text, "400 g de morue séchée");

// --- two quantities in one row --------------------------------------------

row = el("1 oignon jaune (150 g) grossièrement haché");
S.applyPairs(row, [
  ["1 oignon jaune", "2 oignons jaunes"],
  ["150 g", "300 g"],
]);
check("two tokens", row.text, "2 oignons jaunes (300 g) grossièrement haché");

// --- the same quantity twice ----------------------------------------------

row = el("1 c. à s. d'huile et 1 c. à s. de vinaigre");
S.applyPairs(row, [
  ["1 c. à s.", "2 c. à s."],
  ["1 c. à s.", "2 c. à s."],
]);
check("repeated token consumed once each", row.text,
  "2 c. à s. d'huile et 2 c. à s. de vinaigre");

// --- match split across text nodes by inline markup -----------------------

row = el("400", el(" g"), " de farine");
S.applyPairs(row, [["400 g", "200 g"]]);
check("match spanning two nodes", row.text, "200 g de farine");

row = el("2 ", el("gousses"), " d'ail");
S.applyPairs(row, [["2 gousses", "4 gousses"]]);
check("noun inside <strong>", row.text, "4 gousses d'ail");

// --- smart quotes and non-breaking spaces ---------------------------------

row = el("1 c. à s. d’huile"); // kramdown turns ' into ’
S.applyPairs(row, [["1 c. à s. d'huile", "2 c. à s. d'huile"]]);
check("apostrophe folding", row.text, "2 c. à s. d'huile");

row = el("400 g de sucre"); // non-breaking space before the unit
S.applyPairs(row, [["400 g", "200 g"]]);
check("nbsp folding", row.text, "200 g de sucre");

// --- a token that is not present is skipped, others still apply -----------

row = el("300 ml de lait");
S.applyPairs(row, [["999 g", "1 g"], ["300 ml", "150 ml"]]);
check("absent token skipped", row.text, "150 ml de lait");

// --- prose pass -----------------------------------------------------------

function prose(text, factor) {
  const root = el(text);
  S.scaleProse(root, factor);
  return root.text;
}

check("prose scales mass", prose("mélangez 70 g de beurre", 0.5),
  "mélangez 35 g de beurre");
check("prose scales volume", prose("Verser 15 cl d'eau", 2),
  "Verser 30 cl d'eau");
check("prose scales spelled-out units", prose("ajouter 100 grammes de sucre", 0.5),
  "ajouter 50 grammes de sucre");
check("prose leaves durations", prose("laissez cuire 15 minutes", 2),
  "laissez cuire 15 minutes");
check("prose leaves short durations", prose("cuire 20 min à feu doux", 2),
  "cuire 20 min à feu doux");
check("prose leaves temperatures", prose("enfourner à 180 °C", 2),
  "enfourner à 180 °C");
check("prose leaves dimensions", prose("des morceaux de 2 cm", 2),
  "des morceaux de 2 cm");
check("prose leaves repetition counts", prose("incorporer en 2 fois", 2),
  "incorporer en 2 fois");
check("prose leaves bare counts", prose("couper en 4 quartiers", 2),
  "couper en 4 quartiers");
check("prose leaves a non-litre l-word", prose("1 lot de champignons", 2),
  "1 lot de champignons");
check("prose scales a real litre", prose("1 l d'eau", 2), "2 l d'eau");
check("prose mixes scaled and untouched", prose("70 g de beurre pendant 15 minutes", 2),
  "140 g de beurre pendant 15 minutes");
check("prose at factor 1 is untouched", prose("70 g de beurre", 1),
  "70 g de beurre");
check("prose agrees spelled-out units", prose("ajouter 2 litres d'eau", 0.5),
  "ajouter 1 litre d'eau");
check("prose agrees cuillères", prose("ajouter 1 cuillère à soupe de miel", 2),
  "ajouter 2 cuillères à soupe de miel");
check("prose abbreviations do not agree", prose("ajouter 1 c. à s. de miel", 2),
  "ajouter 2 c. à s. de miel");

console.log(`${passed} assertions passed`);
