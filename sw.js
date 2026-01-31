const CACHE_NAME = 'mobywatel-cache-v2';
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'home.html',
    'card.html',
    'documents.html',
    'id.html',
    'more.html',
    'qr.html',
    'services.html',
    'assets/index.css',
    'assets/index.js',
    'assets/card.js',
    'assets/bar.js',
    'assets/id.js',
    'assets/home.css',
    'assets/qr.css',
    'assets/main.css',
    'assets/more.css',
    'images/app-icon.png',
    'manifest.json'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
