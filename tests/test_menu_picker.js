/** Menu picker logic. Run: `node tests/test_menu_picker.js` */
const assert = require("assert");
const M = require("../assets/js/menu-picker.js");

let passed = 0;
function ok(cond, label) {
  assert.ok(cond, label);
  passed++;
}
function eq(a, b, label) {
  assert.deepStrictEqual(a, b, `${label}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);
  passed++;
}

const cand = (slug, score, n, courses, lead) => ({
  slug, score, nTemporal: n, courses: courses || ["plat"], lead: lead === undefined ? slug : lead,
});
const fill = (candidates, slots, seed, extra) =>
  M.fillMenu(Object.assign({
    candidates, slots, current: slots.map(() => null), locked: new Set(),
    rng: M.mulberry32(seed),
  }, extra));
const dup = (a) => new Set(a.filter((x) => x != null)).size !== a.filter((x) => x != null).length;

// pickWeight / rng
ok(Math.abs(M.pickWeight(cand("a", 1, 1)) - 1 / 3) < 1e-9, "weight n=1");
ok(Math.abs(M.pickWeight(cand("a", 0.8, 5)) - 0.8) < 1e-9, "weight n capped at 3");
eq(M.pickWeight(cand("a", null, 2)), 0, "weight null");
const r1 = M.mulberry32(42), r2 = M.mulberry32(42);
const seq = [r1(), r1(), r1()];
eq(seq, [r2(), r2(), r2()], "mulberry32 deterministic");
ok(seq.every((x) => x >= 0 && x < 1), "mulberry32 range");

// weighted pick: w=1 vs w=0.4 should come out ~2.5:1 (a uniform pick would give ~1:1)
{
  const pair = [cand("hi", 1, 3, ["plat"], "x"), cand("lo", 0.4, 3, ["plat"], "y"),
                cand("z1", 0.4, 3, ["plat"], "z"), cand("z2", 0.4, 3, ["plat"], "w")];
  const rng = M.mulberry32(7);
  let hi = 0, lo = 0;
  for (let i = 0; i < 4000; i++) {
    const s = M.fillMenu({ candidates: pair, slots: ["plat"], current: [null], locked: new Set(), rng }).slugs[0];
    if (s === "hi") hi++; else if (s === "lo") lo++;
  }
  const ratio = hi / lo;
  ok(ratio > 2 && ratio < 3, `weighted ratio ~2.5 (got ${ratio.toFixed(2)})`);
}

// pools: course filter, null exclusion, tier fallback
const mix = [
  cand("e1", 1, 3, ["entree"]), cand("e2", 1, 3, ["entree"]), cand("e3", 1, 3, ["entree"]),
  cand("p1", 1, 3, ["plat"]), cand("d1", 1, 3, ["dessert"]), cand("n", null, 0, ["plat", "entree"]),
];
eq(M.poolFor(mix, "entree").pool.map((c) => c.slug), ["e1", "e2", "e3"], "course filter");
ok(!M.poolFor(mix, null).pool.some((c) => c.slug === "n"), "null score excluded");
eq(M.poolFor(mix, null).tier, "season", "tier season");
eq(M.poolFor(mix, "plat").tier, "relaxed", "tier relaxed when <3 seasonal");
const weak = [cand("w1", 0.5, 1), cand("w2", 0.2, 1)]; // weights .17/.07
eq(M.poolFor(weak, "plat").tier, "relaxed", "weak -> relaxed");
const zero = [cand("z1", 0, 2), cand("z2", 0, 1)];
const zp = M.poolFor(zero, null);
eq([zp.tier, zp.pool.length], ["any", 2], "tier any");

// determinism, duplicates, empty
const big = Array.from({ length: 12 }, (_, i) => cand("r" + i, 1, 3));
const slots4 = [null, null, null, null];
eq(fill(big, slots4, 7).slugs, fill(big, slots4, 7).slugs, "same seed same menu");
for (let s = 0; s < 50; s++) ok(!dup(fill(big, slots4, s).slugs), "no duplicates");
const empty = fill([], slots4, 1);
eq(empty.slugs, [null, null, null, null], "empty candidates -> null slugs");
eq(fill(mix, ["entree", "plat", "dessert"], 3).slugs.filter(Boolean).length, 3, "repas fills");

// locked slots
const lk = M.fillMenu({
  candidates: big, slots: slots4, current: ["gone", null, "r3", null],
  locked: new Set([0, 2]), rng: M.mulberry32(5),
});
eq([lk.slugs[0], lk.slugs[2], lk.tiers[0]], ["gone", "r3", null], "locked kept (even off-pool)");
ok(lk.slugs[1] !== "r3" && lk.slugs[3] !== "r3", "others avoid locked slug");
const rl = M.rerollSlot({
  candidates: big, slots: slots4, current: ["r1", "r2", "r3", "r4"],
  locked: new Set([1]), seen: null, rng: M.mulberry32(9), index: 1,
});
eq(rl.slugs, ["r1", "r2", "r3", "r4"], "reroll of locked slot is a no-op");

// reroll: no repeat until exhausted, then reset
const small = ["a", "b", "c"].map((s) => cand(s, 1, 3));
let cur = fill(small.concat([cand("d", 1, 3)]), [null], 11);
const four = small.concat([cand("d", 1, 3)]);
const shown = [cur.slugs[0]];
for (let k = 0; k < 3; k++) {
  cur = M.rerollSlot({ candidates: four, slots: [null], current: cur.slugs, locked: new Set(), seen: cur.seen, rng: M.mulberry32(20 + k), index: 0 });
  shown.push(cur.slugs[0]);
}
eq(new Set(shown).size, 4, "no repeat before pool exhausted");
cur = M.rerollSlot({ candidates: four, slots: [null], current: cur.slugs, locked: new Set(), seen: cur.seen, rng: M.mulberry32(99), index: 0 });
ok(cur.slugs[0] != null && cur.slugs[0] !== shown[3], "after exhaustion, reset and pick something else");
eq(cur.seen[0].size, 1, "seen reset to the new pick");

// soft lead variety
const lead = [cand("x1", 1, 3, ["plat"], "squash"), cand("x2", 1, 3, ["plat"], "squash"),
  cand("y1", 1, 3, ["plat"], "leek"), cand("y2", 1, 3, ["plat"], "leek")];
for (let s = 0; s < 40; s++) {
  const m = fill(lead, [null, null], s).slugs;
  ok(m[0][0] !== m[1][0], "leads differ when possible");
}
const same = lead.slice(0, 2);
const sm = fill(same, [null, null], 1).slugs;
ok(sm[0] && sm[1] && sm[0] !== sm[1], "still fills when leads cannot differ");

// realism against real data (fortnight 21 = nov-2)
const data = require("../assets/data/recipe-seasonality.json");
const CATS = new Set(["legume", "fruit", "champignon", "coquillage"]);
const W = { peak: 1, start: 0.5, end: 0.5 };
function build(f) {
  return data.recipes.filter((r) => r.kind !== "component").map((r) => {
    const act = r.temporal_ingredients.filter((i) => CATS.has(i.category));
    let sum = 0, lead = null, best = 0;
    for (const i of act) {
      const w = W[i.phases[String(f)]] || 0;
      sum += w;
      if (w > best) { best = w; lead = i.id; }
    }
    return {
      slug: r.slug, score: act.length ? sum / act.length : null, nTemporal: act.length,
      courses: r.courses || [], lead,
    };
  });
}
const hasCourses = data.recipes.some((r) => r.courses);
let multi = 0, total = 0;
const nov = build(21), byslug = new Map(nov.map((c) => [c.slug, c]));
for (let s = 0; s < 200; s++) {
  for (const slug of fill(nov, slots4, s).slugs) {
    ok(slug != null, "realism: slot filled");
    total++;
    if (byslug.get(slug).nTemporal >= 2) multi++;
  }
}
const pct = (100 * multi) / total;
console.log(`nov-2 Surprise: ${pct.toFixed(1)}% of picks have nTemporal >= 2`);
ok(pct >= 70, "at least 70% multi-ingredient picks");

if (hasCourses) {
  const layouts = [slots4, ["entree", "plat", "dessert"], Array(7).fill("plat")];
  for (let f = 0; f < 24; f++) {
    for (const L of layouts) {
      const m = fill(build(f), L, f).slugs;
      ok(m.every((x) => x != null) && !dup(m), `sweep f=${f} layout=${L.length}`);
    }
  }
} else {
  console.log("courses missing in recipe-seasonality.json: course sweep skipped");
}

console.log(`${passed} assertions passed`);
