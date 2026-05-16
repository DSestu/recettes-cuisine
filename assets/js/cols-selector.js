(function () {
  "use strict";

  function parseCols(raw, allowed, fallback) {
    const n = parseInt(raw, 10);
    return allowed.includes(n) ? n : fallback;
  }

  function buildControl(allowed, current, onPick) {
    const wrap = document.createElement("div");
    wrap.className =
      "hidden md:inline-flex items-stretch rounded-lg border border-primary/40 bg-white/70 backdrop-blur shadow-sm overflow-hidden";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Nombre de colonnes");

    const label = document.createElement("span");
    label.className =
      "flex items-center text-white font-bold text-base px-4 whitespace-nowrap";
    label.style.backgroundColor = "rgba(245, 50, 0, 0.65)";
    label.textContent = "Recettes par ligne";
    wrap.appendChild(label);

    const btnRow = document.createElement("div");
    btnRow.className = "flex items-center gap-1 p-2";
    wrap.appendChild(btnRow);

    const buttons = new Map();
    for (const n of allowed) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.cols = String(n);
      btn.textContent = String(n);
      btn.setAttribute("aria-label", "Afficher " + n + " colonnes");
      btn.className =
        "px-4 py-2.5 text-base font-semibold rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary/30";
      btn.style.minWidth = "3.25rem";
      btn.addEventListener("click", function () {
        onPick(n);
      });
      buttons.set(n, btn);
      btnRow.appendChild(btn);
    }

    function setActive(n) {
      for (const [val, btn] of buttons) {
        const active = val === n;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
        if (active) {
          btn.classList.add("bg-primary", "text-white", "shadow-sm");
          btn.classList.remove("text-red-900/70", "hover:bg-primary/10");
        } else {
          btn.classList.remove("bg-primary", "text-white", "shadow-sm");
          btn.classList.add("text-red-900/70", "hover:bg-primary/10");
        }
      }
    }

    setActive(current);
    return { wrap: wrap, setActive: setActive };
  }

  function writeUrl(n) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("cols", String(n));
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      /* noop */
    }
  }

  function applyToGrids(gridSelector, n) {
    const grids = document.querySelectorAll(gridSelector);
    grids.forEach(function (g) {
      g.style.setProperty("--cols", String(n));
    });
  }

  function initColsSelector(opts) {
    const mount = opts && opts.mount;
    const gridSelector = (opts && opts.gridSelector) || "[data-cols-grid]";
    const allowed = (opts && opts.allowed) || [3, 4, 5, 6, 7, 8];
    const defaultCols = (opts && opts.defaultCols) || 5;

    if (!mount) {
      return { setCols: function () {}, refresh: function () {} };
    }

    const params = new URLSearchParams(window.location.search);
    let current = parseCols(params.get("cols"), allowed, defaultCols);

    const control = buildControl(allowed, current, function (n) {
      current = n;
      applyToGrids(gridSelector, n);
      control.setActive(n);
      writeUrl(n);
    });

    mount.appendChild(control.wrap);
    applyToGrids(gridSelector, current);

    return {
      setCols: function (n) {
        if (!allowed.includes(n)) return;
        current = n;
        applyToGrids(gridSelector, n);
        control.setActive(n);
        writeUrl(n);
      },
      refresh: function () {
        applyToGrids(gridSelector, current);
      },
    };
  }

  window.initColsSelector = initColsSelector;
})();
