/* Page-to-page View Transitions support
 *
 * Browser does the heavy lifting via `@view-transition { navigation: auto }`
 * (declared in head.html). This file adds:
 *
 *   1. A direction handshake. On the way out, we stash the current page kind
 *      in sessionStorage as `rcFromKind`. The destination page reads it
 *      synchronously in an inline <head> script (see head.html) and writes
 *      it onto <html data-from-kind="...">. CSS in transitions.css keys off
 *      both `data-page-kind` (set by Liquid) and `data-from-kind` to pick
 *      the route-pair choreography.
 *
 *   2. Hero preload + pre-decode on hover/touch. Warms the HTTP cache and
 *      decodes the destination image off the main thread so the new page's
 *      first paint doesn't pay the JPEG/WebP decode cost at click time.
 */
(function () {
  // ---------- 1. Direction handshake (write side) ----------
  function writeFromKind() {
    try {
      var kind = document.documentElement.getAttribute("data-page-kind");
      if (kind) sessionStorage.setItem("rcFromKind", kind);
    } catch (e) {
      // sessionStorage unavailable; transitions will fall back to default fade.
    }
  }
  // `pageswap` fires right before the document is swapped out during a
  // same-origin navigation (Chromium). `pagehide` is the universal fallback.
  window.addEventListener("pageswap", writeFromKind);
  window.addEventListener("pagehide", writeFromKind);

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
