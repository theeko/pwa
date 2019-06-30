const staticCacheName = "site-static";
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
  "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];

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
      return Promise.all(keys.filter(key => key !== staticCacheName)).map(key =>
        caches.delete(key)
      );
    })
  );
});

self.addEventListener("fetch", event => {
  //console.log("fetch event", event);
  event.respondWith(
    caches.match(event.request).then(cacheResponse => {
      return cacheResponse || fetch(event.request);
    })
  );
});
