/**
 * Number rendering and rounding for the servings scaler.
 *
 * This is where French correctness lives: vulgar fractions, comma decimals,
 * noun agreement, and rounding that stays measurable without drifting far
 * from the true scaled value. Run: `node tests/test_scaler_rendering.js`
 */
const assert = require("assert");
const S = require("../assets/js/servings-scaler.js");

let passed = 0;
function check(label, actual, expected) {
  assert.strictEqual(actual, expected, `${label}: got ${actual}, want ${expected}`);
  passed++;
}

// --- number formatting ----------------------------------------------------

check("integer", S.fmtNum(4), "4");
check("half", S.fmtNum(0.5), "½");
check("quarter", S.fmtNum(0.25), "¼");
check("three quarters", S.fmtNum(0.75), "¾");
check("mixed fraction", S.fmtNum(1.5), "1 ½");
check("mixed quarter", S.fmtNum(2.25), "2 ¼");
check("decimal uses a comma", S.fmtNum(1.2), "1,2");
check("decimal thirds", S.fmtNum(0.33), "0,33");

// --- rounding -------------------------------------------------------------

check("spoons go to quarters", S.roundQty(0.66, "spoon"), 0.75);
check("spoons never vanish", S.roundQty(0.05, "spoon"), 0.25);
check("pinches stay whole", S.roundQty(0.4, "pinch"), 1);
check("packaging stays whole", S.roundQty(0.5, "discrete"), 1);
check("counts go to halves", S.roundQty(1.4, "count"), 1.5);
check("counts never vanish", S.roundQty(0.1, "count"), 0.5);

check("kg keeps a decimal", S.roundQty(0.6, "mass", "kg"), 0.6);
check("kg below one keeps two", S.roundQty(0.375, "mass", "kg"), 0.38);
check("small grams to halves", S.roundQty(6.2, "mass", "g"), 6);
check("mid grams to units", S.roundQty(37.4, "mass", "g"), 37);
check("large grams to fives", S.roundQty(74.6, "mass", "g"), 75);
check("very large grams to tens", S.roundQty(266, "mass", "g"), 270);

// Halving and doubling a typical line must land on the obvious answer.
check("400 g halved", S.roundQty(200, "mass", "g"), 200);
check("150 ml halved", S.roundQty(75, "volume", "ml"), 75);
check("80 g halved", S.roundQty(40, "mass", "g"), 40);

// --- token rendering ------------------------------------------------------

const gram = { q: 400, cls: "mass", u: "g", m: "400 g", tpl: "{q} g" };
check("mass halved", S.renderToken(gram, 0.5), "200 g");
check("mass identity", S.renderToken(gram, 1), "400 g");
check("mass doubled", S.renderToken(gram, 2), "800 g");

const glued = { q: 80, cls: "mass", u: "g", m: "80g", tpl: "{q}g" };
check("glued unit keeps its spacing", S.renderToken(glued, 0.5), "40g");

const spoon = { q: 1, cls: "spoon", m: "1 c. à s.", tpl: "{q} c. à s." };
check("spoon halved renders a fraction", S.renderToken(spoon, 0.5), "½ c. à s.");

const onion = {
  q: 1, cls: "count", m: "1 oignon jaune", tpl: "{q} {n}",
  sg: "oignon jaune", pl: "oignons jaunes",
};
check("count doubled pluralises", S.renderToken(onion, 2), "2 oignons jaunes");
check("count identity stays singular", S.renderToken(onion, 1), "1 oignon jaune");
check("count halved stays singular", S.renderToken(onion, 0.5), "½ oignon jaune");

const cloves = {
  q: 4, cls: "count", m: "4 gousses", tpl: "{q} {n}",
  sg: "gousse", pl: "gousses",
};
check("plural collapses to singular at one", S.renderToken(cloves, 0.25), "1 gousse");
check("1,5 stays singular in French", S.renderToken(cloves, 0.375), "1 ½ gousse");

const range = {
  q: 3, q2: 4, cls: "count", m: "3-4 gousses", tpl: "{q}-{q2} {n}",
  sg: "gousse", pl: "gousses",
};
check("range scales both bounds", S.renderToken(range, 2), "6-8 gousses");
check("range agrees with its upper bound", S.renderToken(range, 1 / 3), "1-1 ½ gousse");

const sachet = {
  q: 1, cls: "discrete", m: "1 sachet", tpl: "{q} {n}",
  sg: "sachet", pl: "sachets",
};
check("packaging never halves", S.renderToken(sachet, 0.5), "1 sachet");

// Spelled-out units agree with the number; masses read better as decimals.
const pinch = {
  q: 2, cls: "pinch", m: "2 pincées", tpl: "{q} {n}", sg: "pincée", pl: "pincées",
};
check("pincées halved", S.renderToken(pinch, 0.5), "1 pincée");

const spoonWord = {
  q: 3, cls: "spoon", m: "3 cuillères à soupe", tpl: "{q} {n}",
  sg: "cuillère à soupe", pl: "cuillères à soupe",
};
check("cuillères at 1,5 stay singular", S.renderToken(spoonWord, 0.5),
  "1 ½ cuillère à soupe");
check("cuillères doubled", S.renderToken(spoonWord, 2), "6 cuillères à soupe");

const litre = {
  q: 1, cls: "volume", u: "l", m: "1 litre", tpl: "{q} {n}",
  sg: "litre", pl: "litres",
};
check("litre halved is a decimal, not a glyph", S.renderToken(litre, 0.5), "0,5 litre");
check("litre doubled agrees", S.renderToken(litre, 2), "2 litres");

const heavy = { q: 1.5, cls: "mass", u: "kg", m: "1,5 kg", tpl: "{q} kg" };
check("kg halved stays decimal", S.renderToken(heavy, 0.5), "0,75 kg");

const andAHalf = {
  q: 1.5, cls: "count", m: "1 gros oignon et demi", tpl: "{q} {n}",
  sg: "gros oignon", pl: "gros oignons",
};
check("et demi absorbed into the count", S.renderToken(andAHalf, 1), "1 ½ gros oignon");
check("et demi doubled", S.renderToken(andAHalf, 2), "3 gros oignons");

const withTail = {
  q: 2, cls: "count", m: "2 gousses d'ail pilées", tpl: "{q} {n}",
  sg: "gousse d'ail pilée", pl: "gousses d'ail pilées",
};
check("tail agreement halved", S.renderToken(withTail, 0.5), "1 gousse d'ail pilée");

// --- canonical units ------------------------------------------------------

check("kg", S.canonicalUnit("kg"), "kg");
check("grammes", S.canonicalUnit("grammes"), "g");
check("centilitres", S.canonicalUnit("centilitres"), "cl");
check("litre", S.canonicalUnit("litre"), "l");
check("spoons are not a mass unit", S.canonicalUnit("c. à s."), null);
check("cuillère is not a mass unit", S.canonicalUnit("cuillère à soupe"), null);

console.log(`${passed} assertions passed`);
