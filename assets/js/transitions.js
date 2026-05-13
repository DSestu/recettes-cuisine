/* Page-to-page View Transitions support
 *
 * Browser does the heavy lifting via `@view-transition { navigation: auto }`
 * in head.html. This file adds two things:
 *
 *   1. View-transition TYPES handshake. On the outgoing page (`pageswap`) we
 *      add `from-<kind>` to `event.viewTransition.types`. On the incoming
 *      page (`pagereveal`) we add `to-<kind>`. CSS keys off these via the
 *      `:active-view-transition-type(...)` pseudo-class to pick the
 *      route-pair choreography. This is the canonical Chrome API for
 *      cross-document VT choreography (replaces the earlier sessionStorage
 *      + data-from-kind attempt, which didn't fire reliably).
 *
 *   2. Hero preload + pre-decode on hover/touch. Warms the HTTP cache and
 *      decodes the destination image off the main thread so the new page's
 *      first paint doesn't pay the JPEG/WebP decode cost at click time.
 */
(function () {
  // ---------- 1. View-transition types handshake ----------
  function pageKind() {
    return document.documentElement.getAttribute("data-page-kind") || "other";
  }

  // Infer the destination page kind from a navigation URL. Mirrors the
  // Liquid logic that sets <html data-page-kind="..."> on each page.
  function kindFromUrl(rawUrl) {
    try {
      var u = new URL(rawUrl, window.location.href);
      var p = u.pathname.replace(/\/+$/, "/"); // collapse trailing slashes
      var base = "";
      try {
        // Site baseurl prefix like '/recettes-cuisine'. Detect from current path.
        var here = window.location.pathname;
        var m = here.match(/^(\/[a-z0-9-]+)\//i);
        if (m) base = m[1];
      } catch (e) { /* */ }
      var path = p.indexOf(base) === 0 ? p.slice(base.length) : p;
      if (path === "" || path === "/" || path === "/index.html") return "home";
      if (path === "/recherche/" || path === "/recherche") return "search";
      if (path.indexOf("/recipes/") === 0) return "recipe";
      return "other";
    } catch (e) {
      return "other";
    }
  }

  // For Recipe → Recipe navigation, strip vt-hero / vt-content from the
  // outgoing recipe so the OLD pseudos for those names don't exist and the
  // unconditional slide-out rules don't fire. Recipe → Home/Search keeps
  // the names so the curtains slide out.
  function adjustOutgoingNamesForDestination(destUrl) {
    if (pageKind() !== "recipe") return;
    var destKind = kindFromUrl(destUrl);
    if (destKind !== "recipe") return;
    // Strip only vt-hero and vt-content; keep vt-nav so the navbar persists.
    document.querySelectorAll(".image, .post-content").forEach(function (el) {
      if (el.style && el.style.viewTransitionName) {
        el.style.viewTransitionName = "";
      }
    });
  }

  // Belt-and-suspenders: write the outgoing kind via both pageswap+viewTransition
  // types AND a sessionStorage fallback. Prefetched/back-forward navigations
  // can skip the pageswap.viewTransition path, but the storage always works.
  function writeFromKindStorage() {
    try { sessionStorage.setItem("rcFromKind", pageKind()); } catch (e) {}
  }
  window.addEventListener("pageswap", function (e) {
    writeFromKindStorage();
    try {
      var destUrl = e.activation && e.activation.entry && e.activation.entry.url;
      if (destUrl) adjustOutgoingNamesForDestination(destUrl);
    } catch (err) { /* */ }
    if (e.viewTransition) {
      try { e.viewTransition.types.add("from-" + pageKind()); } catch (err) {}
    }
  });
  window.addEventListener("pagehide", writeFromKindStorage);

  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    try {
      e.viewTransition.types.add("to-" + pageKind());
      var hasFrom = false;
      e.viewTransition.types.forEach(function (t) {
        if (typeof t === "string" && t.indexOf("from-") === 0) hasFrom = true;
      });
      if (!hasFrom) {
        var stored = null;
        try { stored = sessionStorage.getItem("rcFromKind"); } catch (err) {}
        if (stored) e.viewTransition.types.add("from-" + stored);
      }
      try { sessionStorage.removeItem("rcFromKind"); } catch (err) {}
    } catch (err) { /* */ }
  });

  // ---------- 2. Hero image preload + pre-decode ----------
  var preloadedHeroes = new Set();
  function preloadHero(url) {
    if (!url || preloadedHeroes.has(url)) return;
    preloadedHeroes.add(url);
    var link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    try {
      link.fetchPriority = "high";
    } catch (e) {
      // older browsers; ignore
    }
    link.href = url;
    document.head.appendChild(link);
    try {
      var img = new Image();
      img.src = url;
      if (img.decode) {
        img.decode().catch(function () {
          /* image not decodable yet — harmless */
        });
      }
    } catch (e) {
      // ignore
    }
  }

  function heroUrlFromCardLink(a) {
    if (!a) return "";
    var canvas = a.querySelector("canvas");
    if (!canvas) return "";
    var bg = (canvas.style && canvas.style.backgroundImage) || "";
    var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (!m) return "";
    var cardUrl = m[1];
    var idx = cardUrl.indexOf("/images/cards/");
    if (idx === -1) return "";
    return cardUrl.slice(0, idx) + "/images/" + cardUrl.slice(idx + "/images/cards/".length);
  }

  function maybePreloadHero(target) {
    var a = target && target.closest && target.closest("a[href]");
    if (!isInternalRecipeLink(a)) return;
    preloadHero(heroUrlFromCardLink(a));
  }

  document.addEventListener(
    "mouseover",
    function (e) {
      maybePreloadHero(e.target);
    },
    true,
  );
  document.addEventListener(
    "touchstart",
    function (e) {
      maybePreloadHero(e.target);
    },
    { capture: true, passive: true },
  );

  function isInternalRecipeLink(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    var url;
    try {
      url = new URL(a.href, window.location.href);
    } catch (e) {
      return false;
    }
    if (url.origin !== window.location.origin) return false;
    return url.pathname && url.pathname !== window.location.pathname;
  }
})();
