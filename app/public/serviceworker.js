const CACHE = "rc-" + Date.now();
const OFFLINE_FALLBACK = "/recettes-cuisine/";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.add(new Request(OFFLINE_FALLBACK, { cache: "reload" }));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.map(function (name) {
          if (name !== CACHE) return caches.delete(name);
        })
      ).then(function () {
        return self.clients.claim();
      });
    })
  );
});

function shouldCache(request) {
  if (request.method !== "GET") return false;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.search) return false;
  if (url.hash) return false;
  return true;
}

self.addEventListener("fetch", function (event) {
  if (!shouldCache(event.request)) return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        var clone = response.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});
