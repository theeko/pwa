if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(reg => {
      console.log("service worker registered", reg);
    })
    .catch(e => console.log("service worker register error", e));
}
