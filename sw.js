self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('cubo-logico-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './icona.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
