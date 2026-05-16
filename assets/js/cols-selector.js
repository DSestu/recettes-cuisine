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
      "flex items-center text-white font-bold text-sm px-3 py-1 whitespace-nowrap";
    label.style.backgroundColor = "rgba(245, 50, 0, 0.65)";
    label.textContent = "Recettes par ligne";
    wrap.appendChild(label);

    const btnRow = document.createElement("div");
    btnRow.className = "relative flex items-center gap-1 px-1.5 py-0.5";
    wrap.appendChild(btnRow);

    const indicator = document.createElement("div");
    indicator.className = "absolute top-0 bottom-0 rounded-md shadow-sm pointer-events-none";
    indicator.style.backgroundColor = "rgba(245, 50, 0, 0.65)";
    indicator.style.left = "0px";
    indicator.style.width = "0px";
    indicator.style.opacity = "0";
    indicator.style.transition =
      "left 440ms cubic-bezier(0.22, 1, 0.36, 1), width 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease-out";
    btnRow.appendChild(indicator);

    const buttons = new Map();
    for (const n of allowed) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.cols = String(n);
      btn.textContent = String(n);
      btn.setAttribute("aria-label", "Afficher " + n + " colonnes");
      btn.className =
        "relative z-10 px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30";
      btn.style.minWidth = "2.5rem";
      btn.addEventListener("click", function () {
        onPick(n);
      });
      buttons.set(n, btn);
      btnRow.appendChild(btn);
    }

    function moveIndicator(activeBtn) {
      if (!activeBtn || !activeBtn.offsetParent) return;
      const rowRect = btnRow.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      indicator.style.left = btnRect.left - rowRect.left + "px";
      indicator.style.width = btnRect.width + "px";
      indicator.style.top = activeBtn.offsetTop + "px";
      indicator.style.bottom = "";
      indicator.style.height = activeBtn.offsetHeight + "px";
      indicator.style.opacity = "1";
    }

    function setActive(n) {
      let activeBtn = null;
      for (const [val, btn] of buttons) {
        const active = val === n;
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
    requestAnimationFrame(function () {
      control.setActive(current);
    });
    window.addEventListener("resize", function () {
      control.setActive(current);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const idx = allowed.indexOf(current);
      if (idx === -1) return;
      const nextIdx = e.key === "ArrowLeft" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= allowed.length) return;
      const n = allowed[nextIdx];
      current = n;
      applyToGrids(gridSelector, n);
      control.setActive(n);
      writeUrl(n);
      e.preventDefault();
    });

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
