self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('mobywatel-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/home.html',
        '/card.html',
        '/more.html',
        '/assets/main.css',
        '/assets/bar.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
