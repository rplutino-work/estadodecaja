// Service Worker básico para PWA
const CACHE_NAME = 'estado-caja-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/ventas',
  '/gastos',
  '/configuracion',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
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

