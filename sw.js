const CACHE_NAME = 'cubo-logico-v3'; // ⬅️ aumenta SOLO questo se cambi codice

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icona.png'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// ACTIVATE (PULIZIA TOTALE CACHE VECCHIE)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (NETWORK FIRST PER HTML)
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // HTML sempre aggiornato
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Tutto il resto: cache first
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

