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

  window.addEventListener("pageswap", function (e) {
    if (!e.viewTransition) return;
    try {
      e.viewTransition.types.add("from-" + pageKind());
      console.log("[rc-vt] pageswap: added from-" + pageKind());
    } catch (err) {
      console.log("[rc-vt] pageswap types.add failed:", err);
    }
  });

  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    try {
      e.viewTransition.types.add("to-" + pageKind());
      console.log("[rc-vt] pagereveal: types=", Array.from(e.viewTransition.types));
    } catch (err) {
      console.log("[rc-vt] pagereveal types.add failed:", err);
    }
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
