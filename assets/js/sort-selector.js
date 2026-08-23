(function () {
  "use strict";

  function buildControl(modes, current, onPick) {
    const wrap = document.createElement("div");
    wrap.className =
      "inline-flex items-stretch rounded-lg border border-primary/40 bg-white/70 backdrop-blur shadow-sm overflow-hidden";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Trier les recettes");

    const label = document.createElement("span");
    label.className =
      "flex items-center text-white font-bold text-sm px-3 py-1 whitespace-nowrap";
    label.style.backgroundColor = "rgba(245, 50, 0, 0.65)";
    label.textContent = "Trier par";
    wrap.appendChild(label);

    const btnRow = document.createElement("div");
    btnRow.className = "relative flex items-center gap-1 px-1.5 py-0.5";
    wrap.appendChild(btnRow);

    const indicator = document.createElement("div");
    indicator.className =
      "absolute top-0 bottom-0 rounded-md shadow-sm pointer-events-none";
    indicator.style.backgroundColor = "rgba(245, 50, 0, 0.65)";
    indicator.style.left = "0px";
    indicator.style.width = "0px";
    indicator.style.opacity = "0";
    indicator.style.transition =
      "left 440ms cubic-bezier(0.22, 1, 0.36, 1), width 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease-out";
    btnRow.appendChild(indicator);

    const buttons = new Map();
    for (const mode of modes) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.sort = mode.id;
      btn.textContent = mode.label;
      btn.setAttribute("aria-label", "Trier par " + mode.label);
      btn.className =
        "relative z-10 px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 whitespace-nowrap";
      btn.addEventListener("click", function () {
        onPick(mode.id);
      });
      buttons.set(mode.id, btn);
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

    function setActive(id) {
      let activeBtn = null;
      for (const [val, btn] of buttons) {
        const active = val === id;
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
    return { wrap: wrap, setActive: setActive, buttons: buttons };
  }

  function writeUrl(paramName, id, defaultId) {
    try {
      const url = new URL(window.location.href);
      if (id === defaultId) {
        url.searchParams.delete(paramName);
      } else {
        url.searchParams.set(paramName, id);
      }
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      /* noop */
    }
  }

  /**
   * Segmented control for the homepage sort mode.
   *
   * opts.modes       [{ id, label }] — order is display order
   * opts.defaultMode id used when the URL carries nothing (and omitted from URL)
   * opts.param       URL search param name (default "sort")
   * opts.onChange    called with the mode id on every pick
   */
  function initSortSelector(opts) {
    const mount = opts && opts.mount;
    const modes = (opts && opts.modes) || [];
    const param = (opts && opts.param) || "sort";
    const ids = modes.map(function (m) {
      return m.id;
    });
    const defaultMode =
      (opts && opts.defaultMode && ids.includes(opts.defaultMode)
        ? opts.defaultMode
        : ids[0]) || null;

    if (!mount || !modes.length) {
      return { getMode: function () { return defaultMode; }, setMode: function () {} };
    }

    let current = defaultMode;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get(param);
      if (fromUrl && ids.includes(fromUrl)) current = fromUrl;
    } catch (e) {
      /* ignore URL parsing errors */
    }

    const onChange = (opts && opts.onChange) || function () {};

    const control = buildControl(modes, current, function (id) {
      if (id === current) return;
      current = id;
      control.setActive(id);
      writeUrl(param, id, defaultMode);
      onChange(id);
    });

    mount.innerHTML = "";
    mount.appendChild(control.wrap);
    requestAnimationFrame(function () {
      control.setActive(current);
    });
    window.addEventListener("resize", function () {
      control.setActive(current);
    });

    onChange(current);

    return {
      getMode: function () {
        return current;
      },
      setMode: function (id) {
        if (!ids.includes(id) || id === current) return;
        current = id;
        control.setActive(id);
        writeUrl(param, id, defaultMode);
        onChange(id);
      },
      /** Hide a mode's button — used for modes with no data yet (e.g. pays). */
      setModeAvailable: function (id, available) {
        const btn = control.buttons.get(id);
        if (btn) btn.style.display = available ? "" : "none";
      },
    };
  }

  window.initSortSelector = initSortSelector;
})();
