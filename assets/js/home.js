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

  function setupHomeSearch() {
    const input = document.getElementById("home-search");
    if (!input) return;
    const clearBtn = document.getElementById("home-search-clear");
    const countEl = document.getElementById("home-search-count");
    const recipesRoot = document.getElementById("recipes-by-category");
    if (!recipesRoot) return;

    const BASES_ID = "bases";

    // Initial state from URL
    let initialCategoryId = null;
    let showComponentsInMain = true;
    try {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("cat");
      if (catParam) initialCategoryId = catParam;
      const basesParam = params.get("bases");
      if (basesParam === "0") showComponentsInMain = false;
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
        "px-6 text-red-950 md:text-primary uppercase font-semibold mb-2 md:text-2xl";
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
        "px-6 text-red-950 md:text-primary uppercase font-semibold mb-2 md:text-2xl";
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

    if (typeof window.initColsSelector === "function") {
      window.initColsSelector({
        mount: document.getElementById("cols-selector-mount"),
        gridSelector: "[data-cols-grid]",
        defaultCols: 5,
      });
    }

    function createRecipeCard(recipe) {
      const a = document.createElement("a");
      a.className = "recipe md:hover:scale-105 md:hover:rotate-1 transition";
      a.href = recipe.url;

      const canvas = document.createElement("canvas");
      canvas.className =
        "aspect-video w-full rounded-xl bg-gray-100 mb-1 bg-cover bg-center";
      const images = Array.isArray(recipe.images)
        ? recipe.images
        : recipe.images
          ? [recipe.images]
          : [];
      if (images.length > 0) {
        const slug = images[0].replace(/\.[^./]+$/, "");
        canvas.style.backgroundImage = "url("
          + HOME_BASE_URL
          + "/images/cards/"
          + slug
          + ".webp)";
      }
      a.appendChild(canvas);

      const h1 = document.createElement("h1");
      h1.className = "font-semibold leading-tight";
      h1.textContent = recipe.title;
      a.appendChild(h1);

      return a;
    }

    const items = [];

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
          kind: r.kind,
        });
      }
    }

    const activeCategoryIds = new Set();

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

        // Compute total recipes/components assigned to this category
        const count = items.filter(
          (it) => it.categoryId === cat.id,
        ).length;
        if (count > 0) {
          const badge = document.createElement("span");
          badge.className =
            "ml-2 inline-flex items-center justify-center text-xs rounded-full bg-white/90 text-red-900 border border-red-200 w-5 h-5";
          badge.textContent = String(count);
          btn.appendChild(badge);
        }

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

    function syncUrlState(hasTextFilter, hasCategoryFilter, matches) {
      try {
        const params = new URLSearchParams(window.location.search);
        const catId = hasCategoryFilter ? getSelectedCategoryId() : null;
        if (catId) {
          params.set("cat", catId);
        } else {
          params.delete("cat");
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
          { matches, cat: catId, bases: showComponentsInMain, q: qRaw },
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

      // Toggle clear button based on any active filter
      if (clearBtn) {
        clearBtn.classList.toggle(
          "hidden",
          !hasTextFilter && !hasCategoryFilter,
        );
      }

      let matches = 0;

      for (const it of items) {
        let ok = true;

        // 1) Category filter (single active category acts like a tab)
        if (hasCategoryFilter && it.categoryId && selectedId) {
          if (it.categoryId !== selectedId) {
            ok = false;
          }
        }

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
            if (norm.includes(w)) continue;
            if (!isSubsequence(w, norm)) {
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

      // Show/hide category sections
      for (const [catId, { section, grid }] of categorySections.entries()) {
        if (hasCategoryFilter) {
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
        if (hasCategoryFilter) {
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

      if (countEl) {
        if (!hasTextFilter && !hasCategoryFilter) {
          countEl.style.display = "none";
        } else {
          const activeLabels = selectedCats
            .map((c) => c.label)
            .filter(Boolean);
          let suffix = "";
          if (activeLabels.length) {
            suffix = ` (catégories : ${activeLabels.join(", ")})`;
          }
          countEl.textContent =
            `${matches} résultat${matches > 1 ? "s" : ""}${suffix}`;
          countEl.style.display = "";
        }
      }

      syncUrlState(hasTextFilter, hasCategoryFilter, matches);
    }

    setupHomeCategories();

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

