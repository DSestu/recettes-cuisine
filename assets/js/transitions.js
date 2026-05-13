/* Page-to-page View Transitions support
 * Browser does the heavy lifting via @view-transition { navigation: auto } (see head.html).
 * This script:
 *   1. Exposes `window.recipeViewTransitionName(url)` so card renderers and the
 *      recipe hero stamp matching `view-transition-name` values. Each name is
 *      unique to its recipe (derived from the URL), so the page never has
 *      duplicate names — no isolation step is needed.
 *   2. Preloads + pre-decodes the destination hero image on hover/touch so
 *      the new page paints fast.
 */
(function () {
  function slugifyForViewTransition(url) {
    if (!url) return "";
    var path = String(url);
    // Mirror Jekyll: slugify is applied to `page.url`, which excludes site.baseurl.
    var base = window.SITE_BASEURL || "";
    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length);
    }
    return path
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  window.recipeViewTransitionName = function (url) {
    var slug = slugifyForViewTransition(url);
    return slug ? "vt-" + slug : "";
  };

  // Preload the destination hero image on hover/touch.
  // The card thumb's background is `…/images/cards/<file>`; the recipe page's
  // hero uses `…/images/<file>` (same filename). We can derive the hero URL
  // from the card and warm it before the click, so the new page paints fast.
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
    // Decode off the main thread so the click-time paint doesn't pay it.
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
    // Only do the morph for navigations whose destination has a hero image
    // with a matching transition name — i.e. URLs that look like a recipe.
    // We can't introspect the destination, so be permissive: anything with a
    // bare path that resembles a recipe page works because the receiving
    // page either has the name (morph happens) or doesn't (default fade).
    return url.pathname && url.pathname !== window.location.pathname;
  }

})();
