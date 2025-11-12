// Service Worker con actualización automática
const CACHE_NAME = 'estado-caja-v2';
const urlsToCache = [
  '/',
  '/dashboard',
  '/ventas',
  '/gastos',
  '/ajustes',
  '/configuracion',
];

// Instalación: actualiza inmediatamente y toma control
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache abierto');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Service Worker: Error al cachear', err);
        });
      })
      .then(() => {
        // Fuerza la activación inmediata
        return self.skipWaiting();
      })
  );
});

// Activación: limpia caches antiguos y toma control
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Toma control de todas las páginas inmediatamente
      return self.clients.claim();
    })
  );
});

// Fetch: estrategia network-first para siempre tener la versión más reciente
self.addEventListener('fetch', (event) => {
  // Solo cachear requests GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y guardarla en cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar desde cache
        return caches.match(event.request);
      })
  );
});

// Mensaje para forzar actualización
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

