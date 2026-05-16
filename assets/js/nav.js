(function () {
  // "Coming soon" label tweak for links with .coming-soon
  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".coming-soon");
    if (!links.length) return;
    links.forEach((link) => {
      link.addEventListener("click", function onClick(event) {
        event.preventDefault();
        const label = this.querySelector(".label");
        if (label) {
          label.textContent = "Soon";
        }
      });
    });
  });

  // Smooth hide/show nav on scroll (mobile only)
  (function mobileNavScroll() {
    const nav = document.querySelector("nav.mobile-nav");
    if (!nav) return;
    let lastY = window.scrollY || 0;
    window.addEventListener(
      "scroll",
      () => {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        if (isDesktop) {
          nav.classList.remove("nav-hidden");
          nav.classList.add("nav-visible");
          lastY = window.scrollY || 0;
          return;
        }
        const y = window.scrollY || 0;
        const goingDown = y > lastY && y > 8;
        const atTop = y <= 0;
        if (nav.classList.contains("hidden") && (atTop || y < lastY)) {
          nav.classList.remove("hidden");
        }
        if (goingDown) {
          nav.classList.add("nav-hidden");
          nav.classList.remove("nav-visible");
        } else if (atTop || y < lastY) {
          nav.classList.remove("nav-hidden");
          nav.classList.add("nav-visible");
        }
        lastY = y;
      },
      { passive: true },
    );
    window.addEventListener("resize", () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop) {
        nav.classList.remove("nav-hidden");
        nav.classList.add("nav-visible");
      }
    });
  })();

  // Disable context menu on mobile (prevent long-press right-click behavior)
  (function disableContextMenuOnMobile() {
    const isMobile =
      window.matchMedia("(max-width: 767px)").matches
      || "ontouchstart" in window
      || (navigator.maxTouchPoints || 0) > 0;
    if (!isMobile) return;
    document.addEventListener(
      "contextmenu",
      (e) => {
        try {
          e.preventDefault();
        } catch {
          // ignore
        }
      },
      { capture: true },
    );
  })();

  // Desktop: hover-to-expand left panel (edge strip + proximity, panel expand/collapse)
  (function desktopSidebarHover() {
    const wrap = document.getElementById("desktop-sidebar-wrap");
    const strip = document.getElementById("desktop-edge-strip");
    const panel = wrap && wrap.querySelector(".desktop-sidebar-panel");
    const nav = document.querySelector("nav.mobile-nav");
    const md = window.matchMedia("(min-width: 768px)");
    const TRIGGER_WIDTH = 24;
    const PROXIMITY_VISIBLE = 900;
    const COLLAPSE_DELAY_MS = 180;

    if (!wrap || !strip || !panel || !nav) return;

    let collapseTimer = null;

    function isDesktop() {
      return md.matches;
    }

    function expand() {
      if (!isDesktop()) return;
      if (collapseTimer) {
        clearTimeout(collapseTimer);
        collapseTimer = null;
      }
      wrap.classList.add("desktop-sidebar-expanded");
      wrap.setAttribute("aria-hidden", "false");
      nav.setAttribute("aria-expanded", "true");
    }

    function collapse() {
      if (!isDesktop()) return;
      wrap.classList.remove("desktop-sidebar-expanded");
      wrap.setAttribute("aria-hidden", "true");
      nav.setAttribute("aria-expanded", "false");
    }

    function scheduleCollapse() {
      if (collapseTimer) clearTimeout(collapseTimer);
      collapseTimer = window.setTimeout(collapse, COLLAPSE_DELAY_MS);
    }

    function cancelCollapse() {
      if (collapseTimer) {
        clearTimeout(collapseTimer);
        collapseTimer = null;
      }
    }

    function updateProximity(clientX) {
      if (!isDesktop() || wrap.classList.contains("desktop-sidebar-expanded")) {
        return;
      }
      if (clientX < PROXIMITY_VISIBLE) {
        strip.classList.add("desktop-edge-strip--visible");
        let intensity = 1 - clientX / PROXIMITY_VISIBLE;
        if (intensity < 0) intensity = 0;
        if (intensity > 1) intensity = 1;
        strip.style.setProperty(
          "--desktop-strip-intensity",
          String(intensity),
        );
      } else {
        strip.classList.remove("desktop-edge-strip--visible");
        strip.style.setProperty("--desktop-strip-intensity", "0");
      }
    }

    document.addEventListener(
      "mousemove",
      (e) => {
        if (!isDesktop()) return;
        const x = e.clientX;
        updateProximity(x);
        if (x < TRIGGER_WIDTH) {
          expand();
          cancelCollapse();
        }
      },
      { passive: true },
    );

    [strip, panel].forEach((el) => {
      if (!el) return;
      el.addEventListener("mouseenter", () => {
        if (isDesktop()) {
          expand();
          cancelCollapse();
        }
      });
      el.addEventListener("mouseleave", () => {
        if (isDesktop()) scheduleCollapse();
      });
    });

    const openBtn = document.getElementById("desktop-sidebar-open-btn");
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        if (isDesktop()) {
          expand();
          cancelCollapse();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape"
        && isDesktop()
        && wrap.classList.contains("desktop-sidebar-expanded")
      ) {
        collapse();
      }
    });

    window.addEventListener("resize", () => {
      if (!isDesktop()) collapse();
    });
  })();
})();

