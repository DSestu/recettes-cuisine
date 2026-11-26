(function () {
  "use strict";

  function pickWeight(c) {
    return c.score == null ? 0 : (c.score * Math.min(c.nTemporal, 3)) / 3;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function poolFor(candidates, course) {
    return tiersFor(candidates, course)[0];
  }

  // Tier ladder season -> relaxed -> any, starting at the first usable tier.
  function tiersFor(candidates, course) {
    const base = candidates.filter(
      (c) => c.score != null && (course == null || (c.courses || []).includes(course))
    );
    const season = base.filter((c) => pickWeight(c) >= 0.4);
    const relaxed = base.filter((c) => pickWeight(c) > 0);
    const all = [
      { pool: season, tier: "season" },
      { pool: relaxed, tier: "relaxed" },
      { pool: base, tier: "any" },
    ];
    const start = season.length >= 3 ? 0 : relaxed.length > 0 ? 1 : 2;
    return all.slice(start);
  }

  function weightedPick(list, tier, rng) {
    if (tier === "any") return list[Math.floor(rng() * list.length)];
    let total = 0;
    for (const c of list) total += pickWeight(c);
    let r = rng() * total;
    for (const c of list) {
      r -= pickWeight(c);
      if (r < 0) return c;
    }
    return list[list.length - 1];
  }

  // Picks for slot i given the other slots' current slugs. Mutates seen[i].
  function pickSlot(candidates, slots, slugs, seen, rng, i, prev) {
    const used = new Set(slugs.filter((s, j) => j !== i && s != null));
    // Widen the tier when slugs used elsewhere exhaust it (e.g. 7 plats in a thin season).
    let pool, tier, avail = [];
    for (const t of tiersFor(candidates, slots[i])) {
      pool = t.pool;
      tier = t.tier;
      avail = pool.filter((c) => !used.has(c.slug));
      if (avail.length) break;
    }
    if (avail.length === 0) return { slug: null, tier: tier };

    let fresh = avail.filter((c) => !seen[i].has(c.slug));
    if (fresh.length === 0) {
      seen[i].clear();
      // Avoid an immediate repeat of the slot's previous pick when we can.
      fresh = avail.filter((c) => c.slug !== prev);
      if (fresh.length === 0) fresh = avail;
    }

    const leads = new Set();
    for (let j = 0; j < slugs.length; j++) {
      if (j === i || slugs[j] == null) continue;
      const o = candidates.find((c) => c.slug === slugs[j]);
      if (o && o.lead != null) leads.add(o.lead);
    }
    const varied = fresh.filter((c) => c.lead == null || !leads.has(c.lead));
    const chosen = weightedPick(varied.length ? varied : fresh, tier, rng);
    seen[i].add(chosen.slug);
    return { slug: chosen.slug, tier: tier };
  }

  function normSeen(seen, n) {
    return Array.from({ length: n }, (_, i) => (seen && seen[i]) || new Set());
  }

  function fillMenu(o) {
    const n = o.slots.length;
    const seen = normSeen(o.seen, n);
    const locked = o.locked || new Set();
    const slugs = o.slots.map((_, i) => (locked.has(i) ? o.current[i] || null : null));
    const tiers = new Array(n).fill(null);
    for (let i = 0; i < n; i++) {
      if (locked.has(i)) continue;
      const r = pickSlot(o.candidates, o.slots, slugs, seen, o.rng, i, o.current[i]);
      slugs[i] = r.slug;
      tiers[i] = r.tier;
    }
    return { slugs: slugs, tiers: tiers, seen: seen };
  }

  function rerollSlot(o) {
    const n = o.slots.length;
    const seen = normSeen(o.seen, n);
    const slugs = o.slots.map((_, i) => o.current[i] || null);
    const tiers = new Array(n).fill(null);
    const i = o.index;
    if (o.locked && o.locked.has(i)) return { slugs: slugs, tiers: tiers, seen: seen };
    const prev = slugs[i];
    if (prev != null) seen[i].add(prev);
    const r = pickSlot(o.candidates, o.slots, slugs, seen, o.rng, i, prev);
    slugs[i] = r.slug;
    tiers[i] = r.tier;
    return { slugs: slugs, tiers: tiers, seen: seen };
  }

  const api = {
    pickWeight: pickWeight,
    mulberry32: mulberry32,
    poolFor: poolFor,
    fillMenu: fillMenu,
    rerollSlot: rerollSlot,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.MenuPicker = api;
})();
