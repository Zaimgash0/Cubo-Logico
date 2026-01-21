const CACHE_VERSION = 'v8'; // 🔴 aumenta SOLO se cambi asset offline
const CACHE_NAME = `cubo-logico-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icona.png'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {

  // HTML → SEMPRE NETWORK FIRST (mai JS vecchio)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put('./index.html', copy));
          return resp;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Asset → cache first
  event.respondWith(
    caches.match(event.request).then(
      cached => cached || fetch(event.request)
    )
  );
});




