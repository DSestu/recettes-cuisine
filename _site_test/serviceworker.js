const CACHE = "rc-1784384939";
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
      );
    }).then(function () {
      return self.clients.claim();
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
    fetch(event.request)
      .then(function (response) {
        if (response && response.status === 200 && response.type === "basic") {
          var copy = response.clone();
          event.waitUntil(
            caches.open(CACHE).then(function (cache) {
              return cache.put(event.request, copy);
            })
          );
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request).then(function (cached) {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_FALLBACK);
          }
          return Response.error();
        });
      })
  );
});
