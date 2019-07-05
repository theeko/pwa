const staticCacheName = "site-static-v3";
const dynamicCache = "dynamic-static-v3";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/pages/fallback.html"
];

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", event => {
  //console.log("sw installed");
  event.waitUntill(
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", event => {
  //console.log("sw active");
  event.waitUntill(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key != dynamicCache)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", event => {
  //console.log("fetch event", event); /
  if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(
      caches
        .match(event.request)
        .then(cacheResponse => {
          return (
            cacheResponse ||
            fetch(event.request).then(fetchRes => {
              return caches.open(dynamicCache).then(cache => {
                cache.put(event.request.url, fetchRes.clone());
                limitCacheSize(dynamicCache, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(e => {
          if (event.request.url.indexOf(".html") != -1) {
            return caches.match("/pages/fallback.html");
          }
        })
    );
  }
});
