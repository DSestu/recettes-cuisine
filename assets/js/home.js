// Homepage search, category filters and recipe/component grid rendering.
// Relies on global HOME_CATEGORIES, HOME_RECIPES and HOME_BASE_URL defined in the page template.
(function () {
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isSubsequence(query, text) {
    if (!query) return true;
    let i = 0;
    let j = 0;
    while (i < query.length && j < text.length) {
      if (query[i] === text[j]) i += 1;
      j += 1;
    }
    return i === query.length;
  }

  // Approximate substring match: needle appears in hay with up to `maxDist`
  // total edits (insertion, deletion, substitution), of which at most
  // `maxSubs` may be substitutions. Short needles (<= 3) require exact match.
  function fuzzyContains(needle, hay, maxDist, maxSubs) {
    if (!needle) return true;
    if (hay.includes(needle)) return true;
    if (needle.length <= 3) return false;
    const m = needle.length;
    const n = hay.length;
    const K = maxSubs + 1; // sub-budget index 0..maxSubs
    // dp[k][j] = min total edits to align needle[0..i] against hay ending at j,
    // having used k substitutions so far. Row 0 (i=0) starts at 0 anywhere.
    let prev = [];
    let curr = [];
    for (let k = 0; k < K; k++) {
      prev.push(new Array(n + 1).fill(0));
      curr.push(new Array(n + 1).fill(0));
    }
    for (let i = 1; i <= m; i++) {
      for (let k = 0; k < K; k++) curr[k][0] = i;
      let rowMin = i;
      for (let j = 1; j <= n; j++) {
        const match = needle.charCodeAt(i - 1) === hay.charCodeAt(j - 1);
        for (let k = 0; k < K; k++) {
          const ins = curr[k][j - 1] + 1;
          const del = prev[k][j] + 1;
          const diagMatch = match ? prev[k][j - 1] : Infinity;
          const diagSub = !match && k > 0 ? prev[k - 1][j - 1] + 1 : Infinity;
          const v = Math.min(ins, del, diagMatch, diagSub);
          curr[k][j] = v;
          if (v < rowMin) rowMin = v;
        }
      }
      if (rowMin > maxDist) return false;
      const tmp = prev;
      prev = curr;
      curr = tmp;
    }
    for (let k = 0; k < K; k++) {
      for (let j = 0; j <= n; j++) {
        if (prev[k][j] <= maxDist) return true;
      }
    }
    return false;
  }

  function setupHomeSearch() {
    const input = document.getElementById("home-search");
    if (!input) return;
    const clearBtn = document.getElementById("home-search-clear");
    const countEl = document.getElementById("home-search-count");
    const recipesRoot = document.getElementById("recipes-by-category");
    if (!recipesRoot) return;

    const BASES_ID = "bases";

    const COUNTRY_FLAGS =
      (typeof HOME_COUNTRY_FLAGS === "object" && HOME_COUNTRY_FLAGS) || {};

    /** Small inline flag <img> for a country, or null when no flag is known. */
    function createFlag(country, heightRem) {
      const url = country ? COUNTRY_FLAGS[country] : null;
      if (!url) return null;
      const img = document.createElement("img");
      img.src = url;
      img.alt = "";
      img.title = country;
      img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      img.loading = "lazy";
      img.className = "inline-block w-auto rounded-sm";
      img.style.verticalAlign = "-0.1em";
      img.style.height = (heightRem || 0.9) + "rem";
      img.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.12)";
      return img;
    }

    /**
     * Append `text` to `el`, followed by the flag (one space apart). The last
     * word and the flag share a `nowrap` span: browsers may break before an
     * inline image even after a no-break space, which would orphan the flag.
     */
    function appendTextWithFlag(el, text, flag) {
      if (!flag) {
        el.appendChild(document.createTextNode(text));
        return;
      }
      const words = String(text).split(" ");
      const last = words.pop();
      if (words.length) {
        el.appendChild(document.createTextNode(words.join(" ") + " "));
      }
      const tail = document.createElement("span");
      tail.style.whiteSpace = "nowrap";
      tail.appendChild(document.createTextNode(last + "\u00a0"));
      tail.appendChild(flag);
      el.appendChild(tail);
    }

    // Initial state from URL
    let initialCategoryId = null;
    let initialCountry = null;
    let showComponentsInMain = false;
    try {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("cat");
      if (catParam) initialCategoryId = catParam;
      const paysParam = params.get("pays");
      if (paysParam) initialCountry = paysParam.trim();
      const basesParam = params.get("bases");
      if (basesParam === "1") showComponentsInMain = true;
      const urlQ = params.get("q") || params.get("query");
      if (urlQ) {
        input.value = urlQ;
      }
    } catch (e) {
      // ignore URL parsing errors
    }

    // Build sections per category (plus an "Autres" section)
    const categorySections = new Map();
    let othersSection = null;

    for (const cat of HOME_CATEGORIES || []) {
      if (cat.mode === "other") continue;
      const section = document.createElement("section");
      section.className = "mb-8";
      section.dataset.categoryId = cat.id;

      const title = document.createElement("h3");
      title.className =
        "px-6 text-primary uppercase font-semibold mb-2 text-lg md:text-xl";
      title.textContent = cat.label;
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.className =
        "grid px-6 h-full grid-cols-2 gap-4 md:gap-6";
      grid.setAttribute("data-cols-grid", "");
      section.appendChild(grid);

      recipesRoot.appendChild(section);
      categorySections.set(cat.id, { section, grid });
    }

    const othersCat = (HOME_CATEGORIES || []).find(
      (c) => c.mode === "other",
    );
    if (othersCat) {
      const section = document.createElement("section");
      section.className = "mb-8";
      section.dataset.categoryId = othersCat.id;

      const title = document.createElement("h3");
      title.className =
        "px-6 text-primary uppercase font-semibold mb-2 text-lg md:text-xl";
      title.textContent = othersCat.label;
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.className =
        "grid px-6 h-full grid-cols-2 gap-4 md:gap-6";
      grid.setAttribute("data-cols-grid", "");
      section.appendChild(grid);

      recipesRoot.appendChild(section);
      othersSection = { section, grid };
    }

    // Alternate views ("Récents", "Pays"). These hold exactly one
    // card per recipe, unlike the category sections which duplicate a card into
    // every category a recipe's tags match. Only one view family is visible at
    // a time; applyFilter() gates them on `sortMode`.
    function buildSection(labelText, opts) {
      const section = document.createElement("section");
      section.className = "mb-8";
      section.style.display = "none";

      const title = document.createElement("h3");
      title.className = (opts && opts.big)
        ? "px-6 text-primary uppercase font-semibold mb-3 text-2xl md:text-3xl"
        : "px-6 text-primary uppercase font-semibold mb-2 text-lg md:text-xl";
      const flag = opts && opts.flag ? createFlag(opts.flag, 1.1) : null;
      appendTextWithFlag(title, labelText, flag);
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "grid px-6 h-full grid-cols-2 gap-4 md:gap-6";
      grid.setAttribute("data-cols-grid", "");
      section.appendChild(grid);

      recipesRoot.appendChild(section);
      return { section, grid };
    }

    // "Récents" is grouped into one big section per calendar month,
    // newest month first. Sections are created lazily while walking the
    // date-sorted list, so insertion order is already the display order.
    const MONTH_FMT = new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    });

    /** "2026-08-23" -> "2026-08". Empty string for a missing/malformed date. */
    function monthKey(raw) {
      const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(String(raw || "").trim());
      return m ? m[1] + "-" + m[2] : "";
    }

    function monthLabel(key) {
      if (!key) return "Date inconnue";
      const parts = key.split("-");
      const text = MONTH_FMT.format(new Date(+parts[0], +parts[1] - 1, 1));
      return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const dateSections = new Map();

    function dateSectionFor(raw) {
      const key = monthKey(raw);
      let found = dateSections.get(key);
      if (!found) {
        found = buildSection(monthLabel(key), { big: true });
        dateSections.set(key, found);
      }
      return found;
    }

    // One section per distinct non-empty `country`, alphabetical. Empty today —
    // the "pays" sort button stays hidden until recipes declare a country.
    const countryNames = Array.from(
      new Set(
        (HOME_RECIPES || [])
          .map((r) => String(r.country || "").trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, "fr"));
    const countrySections = new Map();
    for (const name of countryNames) {
      countrySections.set(name, buildSection(name, { flag: name }));
    }

    if (typeof window.initColsSelector === "function") {
      window.initColsSelector({
        mount: document.getElementById("cols-selector-mount"),
        gridSelector: "[data-cols-grid]",
        defaultCols: 5,
      });
    }

    let cardIndex = 0;
    const EAGER_CARD_COUNT = 8;

    const ADDED_AT_FMT = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // "2026-08-23" -> "23 août 2026". Built from local Y/M/D parts rather than
    // Date.parse, which reads a bare date as UTC and shifts the day west of GMT.
    function formatAddedAt(raw) {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(raw || "").trim());
      if (!m) return "";
      return ADDED_AT_FMT.format(new Date(+m[1], +m[2] - 1, +m[3]));
    }

    // Date bubble, only on the "Récents" cards. Always visible
    // rather than hover-only: the homepage is mostly read on touch screens,
    // where there is no hover. `title` adds the native tooltip on desktop.
    function addDateBubble(a, recipe) {
      const added = formatAddedAt(recipe.date);
      if (!added) return;

      a.style.position = "relative";
      a.title = "Ajoutée le " + added;

      const bubble = document.createElement("span");
      bubble.textContent = added;
      const s = bubble.style;
      s.position = "absolute";
      s.top = "0.375rem";
      s.right = "0.375rem";
      s.padding = "0.125rem 0.5rem";
      s.borderRadius = "9999px";
      s.fontSize = "0.6875rem";
      s.fontWeight = "600";
      s.lineHeight = "1.45";
      s.color = "#fff";
      s.backgroundColor = "rgba(245, 50, 0, 0.82)";
      s.backdropFilter = "blur(2px)";
      s.whiteSpace = "nowrap";
      s.pointerEvents = "none";
      a.appendChild(bubble);
    }

    function createRecipeCard(recipe, opts) {
      const a = document.createElement("a");
      a.className = "recipe md:hover:scale-105 md:hover:rotate-1 transition";
      a.href = recipe.url;

      const eager = cardIndex < EAGER_CARD_COUNT;
      cardIndex++;

      const img = document.createElement("img");
      img.className =
        "aspect-video w-full rounded-xl bg-gray-100 mb-1 object-cover";
      img.loading = eager ? "eager" : "lazy";
      img.fetchPriority = eager ? "high" : "low";
      img.decoding = "async";
      img.width = 400;
      img.height = 225;
      img.alt = "";
      const images = Array.isArray(recipe.images)
        ? recipe.images
        : recipe.images
          ? [recipe.images]
          : [];
      if (images.length > 0) {
        const slug = images[0].replace(/\.[^./]+$/, "");
        img.src =
          HOME_BASE_URL + "/images/cards/" + slug + ".webp";
      }
      a.appendChild(img);

      const h1 = document.createElement("h1");
      h1.className = "font-semibold leading-tight";
      // Flag after the title (one space apart), except in the "Pays" view
      // where the section header already carries it.
      const flag = opts && opts.hideFlag ? null : createFlag(recipe.country, 0.8);
      appendTextWithFlag(h1, recipe.title, flag);
      a.appendChild(h1);

      if (opts && opts.showDate) addDateBubble(a, recipe);

      return a;
    }

    const items = [];
    const catIdsByTitle = new Map();
    let sortMode = "category";

    for (const r of HOME_RECIPES || []) {
      const tags = new Set((r.tags || []).map(String));

      // Determine all matching category IDs for this recipe/component
      let matchedCatIds = [];

      // Allow multiple category matches based on tags
      for (const cat of HOME_CATEGORIES || []) {
        if (cat.mode === "other") continue;
        if ((cat.tags || []).some((t) => tags.has(String(t)))) {
          matchedCatIds.push(cat.id);
        }
      }

      // Ensure components also always appear in the "bases" category if it exists
      if (r.kind === "component" && categorySections.has(BASES_ID)) {
        if (!matchedCatIds.includes(BASES_ID)) {
          matchedCatIds.push(BASES_ID);
        }
      }

      // If no category matched, fall back to "Autres" if available
      if (matchedCatIds.length === 0 && othersCat) {
        matchedCatIds = [othersCat.id];
      }

      for (const catId of matchedCatIds) {
        const targetSection =
          categorySections.get(catId)
          || (othersCat && othersCat.id === catId ? othersSection : null);
        if (!targetSection) continue;

        const card = createRecipeCard(r);
        targetSection.grid.appendChild(card);

        items.push({
          card,
          title: r.title,
          norm: normalize(r.title),
          tags: r.tags || [],
          categoryId: catId,
          catIds: matchedCatIds,
          kind: r.kind,
          country: String(r.country || "").trim(),
          view: "category",
        });
      }

      // Remember the category matches so the alternate views, which have no
      // per-category card, can still honour the category filter.
      catIdsByTitle.set(r.title, matchedCatIds);
    }

    // "Récents": newest first. Dates collide heavily (batch imports
    // share a commit date), so tiebreak on title for a stable order.
    const byDateDesc = (HOME_RECIPES || []).slice().sort((a, b) => {
      const da = String(a.date || "");
      const db = String(b.date || "");
      if (da !== db) return db.localeCompare(da);
      return String(a.title || "").localeCompare(String(b.title || ""), "fr");
    });

    for (const r of byDateDesc) {
      const card = createRecipeCard(r, { showDate: true });
      dateSectionFor(r.date).grid.appendChild(card);
      items.push({
        card,
        title: r.title,
        norm: normalize(r.title),
        tags: r.tags || [],
        categoryId: null,
        catIds: catIdsByTitle.get(r.title) || [],
        kind: r.kind,
        country: String(r.country || "").trim(),
        view: "date",
      });
    }

    for (const r of HOME_RECIPES || []) {
      const country = String(r.country || "").trim();
      const target = country ? countrySections.get(country) : null;
      if (!target) continue;
      const card = createRecipeCard(r, { hideFlag: true });
      target.grid.appendChild(card);
      items.push({
        card,
        title: r.title,
        norm: normalize(r.title),
        tags: r.tags || [],
        categoryId: null,
        catIds: catIdsByTitle.get(r.title) || [],
        kind: r.kind,
        country,
        view: "country",
      });
    }

    const activeCategoryIds = new Set();
    const categoryBadges = new Map();

    function setupHomeCategories() {
      const container = document.getElementById("home-categories");
      if (!container || !HOME_CATEGORIES || !HOME_CATEGORIES.length) {
        return;
      }

      const allButtons = [];

      function setButtonActive(btn) {
        btn.classList.remove(
          "bg-white",
          "border-red-200",
          "text-red-900",
          "hover:bg-red-50",
        );
        btn.classList.add(
          "bg-green-600",
          "border-green-600",
          "text-white",
        );
      }

      function setButtonInactive(btn) {
        btn.classList.remove(
          "bg-green-600",
          "border-green-600",
          "text-white",
        );
        if (
          !btn.classList.contains("bg-white")
          && !btn.classList.contains("border-red-200")
        ) {
          btn.classList.add(
            "bg-white",
            "border-red-200",
            "text-red-900",
            "hover:bg-red-50",
          );
        }
      }

      for (const cat of HOME_CATEGORIES) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "px-3 py-1 rounded-full border border-red-200 bg-white text-red-900 hover:bg-red-50 transition";

        const labelSpan = document.createElement("span");
        labelSpan.textContent = cat.label;
        btn.appendChild(labelSpan);

        const count = items.filter(
          (it) => it.categoryId === cat.id,
        ).length;
        const badge = document.createElement("span");
        badge.className =
          "ml-2 inline-flex items-center justify-center text-xs rounded-full bg-white/90 text-red-900 border border-red-200 w-5 h-5";
        badge.textContent = String(count);
        if (count === 0) badge.style.display = "none";
        btn.appendChild(badge);
        categoryBadges.set(cat.id, badge);

        btn.addEventListener("click", () => {
          const isActive = activeCategoryIds.has(cat.id);

          if (isActive) {
            // Clicking an active category clears all category filters
            activeCategoryIds.clear();
            for (const b of allButtons) {
              setButtonInactive(b);
            }
          } else {
            // Only one category can be active at a time
            activeCategoryIds.clear();
            for (const b of allButtons) {
              setButtonInactive(b);
            }
            activeCategoryIds.add(cat.id);
            setButtonActive(btn);
          }

          applyFilter();
        });

        allButtons.push(btn);
        container.appendChild(btn);
      }

      // Expose so clear button can reset category styles
      setupHomeCategories._buttons = allButtons;

      // Apply initial category from URL if present
      if (initialCategoryId) {
        allButtons.forEach((btn, index) => {
          const cat = HOME_CATEGORIES[index];
          if (cat && cat.id === initialCategoryId) {
            activeCategoryIds.add(cat.id);
            setButtonActive(btn);
          }
        });
      }
    }

    function getSelectedCategoryId() {
      for (const id of activeCategoryIds) return id;
      return null;
    }

    // Country selector: same interaction as categories — one country at a
    // time, clicking the active one shows everything again.
    let activeCountry = null;
    const countryBadges = new Map();
    const countryButtons = new Map();

    function setCountryButtonState(btn, active) {
      const inactiveCls = ["bg-white", "border-red-200", "text-red-900", "hover:bg-red-50"];
      const activeCls = ["bg-green-600", "border-green-600", "text-white"];
      btn.classList.remove(...(active ? inactiveCls : activeCls));
      btn.classList.add(...(active ? activeCls : inactiveCls));
    }

    function setActiveCountry(name) {
      activeCountry = name || null;
      for (const [country, btn] of countryButtons) {
        setCountryButtonState(btn, country === activeCountry);
      }
    }

    function setupHomeCountries() {
      const container = document.getElementById("home-countries");
      if (!container || !countryNames.length) return;

      for (const country of countryNames) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "inline-flex items-center px-3 py-1 rounded-full border border-red-200 bg-white text-red-900 hover:bg-red-50 transition";

        const labelSpan = document.createElement("span");
        labelSpan.textContent = country;
        btn.appendChild(labelSpan);
        const flag = createFlag(country, 0.9);
        if (flag) {
          flag.style.marginLeft = "0.375rem";
          btn.appendChild(flag);
        }

        const badge = document.createElement("span");
        badge.className =
          "ml-2 inline-flex items-center justify-center text-xs rounded-full bg-white/90 text-red-900 border border-red-200 w-5 h-5";
        badge.textContent = "0";
        btn.appendChild(badge);
        countryBadges.set(country, badge);

        btn.addEventListener("click", () => {
          setActiveCountry(activeCountry === country ? null : country);
          applyFilter();
        });

        countryButtons.set(country, btn);
        container.appendChild(btn);
      }

      if (initialCountry && countryButtons.has(initialCountry)) {
        setActiveCountry(initialCountry);
      }
    }

    function syncUrlState(hasTextFilter, hasCategoryFilter, matches) {
      try {
        const params = new URLSearchParams(window.location.search);
        const catId = hasCategoryFilter ? getSelectedCategoryId() : null;
        if (catId) {
          params.set("cat", catId);
        } else {
          params.delete("cat");
        }
        if (activeCountry) {
          params.set("pays", activeCountry);
        } else {
          params.delete("pays");
        }
        params.set("bases", showComponentsInMain ? "1" : "0");
        const qRaw = input.value || "";
        if (qRaw && qRaw.length >= 2) {
          params.set("q", qRaw);
        } else {
          params.delete("q");
        }
        const query = params.toString();
        const newUrl = window.location.pathname + (query ? `?${query}` : "");
        window.history.replaceState(
          { matches, cat: catId, pays: activeCountry, bases: showComponentsInMain, q: qRaw },
          "",
          newUrl,
        );
      } catch (e) {
        // ignore history errors
      }
    }

    function applyFilter() {
      const qRaw = input.value || "";
      const q = normalize(qRaw);
      const words = q.split(" ").filter(Boolean);

      const selectedCats = (HOME_CATEGORIES || []).filter((c) =>
        activeCategoryIds.has(c.id),
      );
      const selectedIds = new Set(selectedCats.map((c) => c.id));
      const selectedId = selectedCats.length > 0 ? selectedCats[0].id : null;

      const hasTextFilter = q.length >= 2;
      const hasCategoryFilter = selectedIds.size > 0;
      const hasCountryFilter = !!activeCountry;

      // Toggle clear button based on any active filter
      if (clearBtn) {
        clearBtn.classList.toggle(
          "hidden",
          !hasTextFilter && !hasCategoryFilter && !hasCountryFilter,
        );
      }

      let matches = 0;

      for (const it of items) {
        // 0) Only the active view's cards can ever be visible.
        let ok = it.view === sortMode;

        // 1) Category filter (single active category acts like a tab).
        // Category-view cards live in exactly one section, so compare that.
        // Alternate views have one card per recipe, so test every match.
        if (ok && hasCategoryFilter && selectedId) {
          if (it.view === "category") {
            if (it.categoryId && it.categoryId !== selectedId) ok = false;
          } else if (!it.catIds.includes(selectedId)) {
            ok = false;
          }
        }

        // 1a) Country filter (single country, any view).
        if (ok && hasCountryFilter && it.country !== activeCountry) ok = false;

        // 1b) Optional: hide components in non-bases categories when toggle is off
        if (
          ok
          && !showComponentsInMain
          && it.kind === "component"
          && it.categoryId !== BASES_ID
        ) {
          ok = false;
        }

        // 2) Text filter (applied within the current category view or across all)
        if (ok && hasTextFilter) {
          const norm = it.norm;
          for (const w of words) {
            if (!fuzzyContains(w, norm, 2, 1)) {
              ok = false;
              break;
            }
          }
        }

        // eslint-disable-next-line no-param-reassign
        it.card.style.display = ok ? "" : "none";
      }

      // Count only visible cards (respecting layout visibility)
      for (const it of items) {
        if (
          it.card.style.display !== "none"
          && it.card.offsetParent !== null
        ) {
          matches += 1;
        }
      }

      // Recompute per-category badge counts based on the text filter only,
      // so badges show how many recipes each category would yield if selected.
      const perCatCount = new Map();
      for (const it of items) {
        // Badges count per-category cards only, whatever the active view.
        if (it.view !== "category") continue;
        if (
          !showComponentsInMain
          && it.kind === "component"
          && it.categoryId !== BASES_ID
        ) {
          continue;
        }
        if (hasTextFilter) {
          const norm = it.norm;
          let textOk = true;
          for (const w of words) {
            if (!fuzzyContains(w, norm, 2, 1)) { textOk = false; break; }
          }
          if (!textOk) continue;
        }
        perCatCount.set(
          it.categoryId,
          (perCatCount.get(it.categoryId) || 0) + 1,
        );
      }
      for (const [catId, badge] of categoryBadges.entries()) {
        const n = perCatCount.get(catId) || 0;
        badge.textContent = String(n);
        badge.style.display = n === 0 ? "none" : "";
      }

      // Per-country badges: how many recipes each country would yield given
      // the text + category filters. "date" view holds exactly one card per
      // recipe, so count on it to avoid category duplicates.
      const perCountryCount = new Map();
      for (const it of items) {
        if (it.view !== "date" || !it.country) continue;
        if (hasCategoryFilter && selectedId && !it.catIds.includes(selectedId)) continue;
        if (hasTextFilter) {
          let textOk = true;
          for (const w of words) {
            if (!fuzzyContains(w, it.norm, 2, 1)) { textOk = false; break; }
          }
          if (!textOk) continue;
        }
        perCountryCount.set(it.country, (perCountryCount.get(it.country) || 0) + 1);
      }
      for (const [country, badge] of countryBadges.entries()) {
        const n = perCountryCount.get(country) || 0;
        badge.textContent = String(n);
        badge.style.display = n === 0 ? "none" : "";
      }

      // Show/hide category sections
      for (const [catId, { section, grid }] of categorySections.entries()) {
        if (sortMode !== "category") {
          section.style.display = "none";
        } else if (hasCategoryFilter) {
          // In category mode, only the selected category's section is shown
          section.style.display = catId === selectedId ? "" : "none";
        } else {
          // No category selected: show sections that have any recipes that pass
          // the current text filter, ignoring previous section visibility.
          const hasVisible = Array.from(grid.children).some(
            (el) => el.style.display !== "none",
          );
          section.style.display = hasVisible ? "" : "none";
        }
      }
      if (othersSection) {
        if (sortMode !== "category") {
          othersSection.section.style.display = "none";
        } else if (hasCategoryFilter) {
          const othersId = othersCat ? othersCat.id : null;
          othersSection.section.style.display =
            othersId && othersId === selectedId ? "" : "none";
        } else {
          const hasVisible = Array.from(othersSection.grid.children).some(
            (el) => el.style.display !== "none",
          );
          othersSection.section.style.display = hasVisible ? "" : "none";
        }
      }

      // Show/hide the alternate-view sections
      const altSections = Array.from(dateSections.values())
        .map((s) => ["date", s])
        .concat(Array.from(countrySections.values()).map((s) => ["country", s]));
      for (const [mode, { section, grid }] of altSections) {
        if (mode !== sortMode) {
          section.style.display = "none";
          continue;
        }
        const hasVisible = Array.from(grid.children).some(
          (el) => el.style.display !== "none",
        );
        section.style.display = hasVisible ? "" : "none";
      }

      if (countEl) {
        if (!hasTextFilter && !hasCategoryFilter && !hasCountryFilter) {
          countEl.style.display = "none";
        } else {
          const activeLabels = selectedCats
            .map((c) => c.label)
            .filter(Boolean);
          const parts = [];
          if (activeLabels.length) parts.push(`catégories : ${activeLabels.join(", ")}`);
          if (hasCountryFilter) parts.push(`pays : ${activeCountry}`);
          const suffix = parts.length ? ` (${parts.join(" ; ")})` : "";
          countEl.textContent =
            `${matches} résultat${matches > 1 ? "s" : ""}${suffix}`;
          countEl.style.display = "";
        }
      }

      syncUrlState(hasTextFilter, hasCategoryFilter, matches);
    }

    setupHomeCategories();
    setupHomeCountries();

    // Sort/view selector. Must run after items[] is populated: initSortSelector
    // fires onChange once with the initial mode (from ?sort=), which filters.
    if (typeof window.initSortSelector === "function") {
      const sortSelector = window.initSortSelector({
        mount: document.getElementById("sort-selector-mount"),
        param: "sort",
        defaultMode: "category",
        modes: [
          { id: "category", label: "Catégories" },
          { id: "date", label: "Récents" },
          { id: "country", label: "Pays" },
        ],
        onChange: function (mode) {
          sortMode = mode;
          applyFilter();
        },
      });
      // No recipe declares a country yet: hide the button until one does, and
      // fall back to the default view if ?sort=country was requested anyway.
      if (!countrySections.size) {
        sortSelector.setModeAvailable("country", false);
        if (sortSelector.getMode() === "country") {
          sortSelector.setMode("category");
        }
      }
    }

    // Toggle to show/hide components in non-bases categories
    const componentsToggle = document.getElementById("components-toggle");
    if (componentsToggle) {
      function updateComponentsToggleLabel() {
        componentsToggle.textContent = showComponentsInMain
          ? "Bases visibles partout"
          : "Bases seulement dans leur section";
      }
      updateComponentsToggleLabel();
      componentsToggle.addEventListener("click", () => {
        showComponentsInMain = !showComponentsInMain;
        updateComponentsToggleLabel();
        applyFilter();
      });
    }

    input.addEventListener("input", applyFilter);
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        activeCategoryIds.clear();
        setActiveCountry(null);
        const buttons = setupHomeCategories._buttons || [];
        for (const btn of buttons) {
          btn.classList.remove(
            "bg-green-600",
            "border-green-600",
            "text-white",
          );
          if (
            !btn.classList.contains("bg-white")
            && !btn.classList.contains("border-red-200")
          ) {
            btn.classList.add(
              "bg-white",
              "border-red-200",
              "text-red-900",
              "hover:bg-red-50",
            );
          }
        }
        applyFilter();
        input.focus();
      });
    }
    // Prefill from URL (?q= or ?query=)
    try {
      const params = new URLSearchParams(window.location.search);
      const q0 = params.get("q") || params.get("query");
      if (q0) {
        input.value = q0;
      }
    } catch (e) {
      // ignore URL parsing errors
    }
    applyFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupHomeSearch, {
      once: true,
    });
  } else {
    setupHomeSearch();
  }
})();

