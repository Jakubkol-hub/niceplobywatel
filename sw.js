const CACHE_NAME = 'mobywatel-cache-v2';
const ASSETS = [
  './',
  './index.html',
  './home.html',
  './id.html',
  './card.html',
  './services.html',
  './qr.html',
  './more.html',
  './pesel.html',
  './scanqr.html',
  './showqr.html',
  './shortcuts.html',
  './assets/main.css',
  './assets/bar.js',
  './assets/home.js',
  './assets/id.js',
  './assets/card.js',
  './manifest.json'
];

// Install Event - Cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Event - Stale-While-Revalidate strategy
// Return from cache immediately, but fetch from network to update cache in background
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
