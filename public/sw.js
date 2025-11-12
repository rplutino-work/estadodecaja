// Service Worker SIN caché - siempre obtener la versión más reciente
// Instalación: actualiza inmediatamente y toma control
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  // Fuerza la activación inmediata sin cachear nada
  event.waitUntil(self.skipWaiting());
});

// Activación: limpia todos los caches y toma control
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Eliminar TODOS los caches
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Service Worker: Eliminando cache', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Toma control de todas las páginas inmediatamente
      return self.clients.claim();
    })
  );
});

// Fetch: NO cachear nada - siempre obtener de la red
self.addEventListener('fetch', (event) => {
  // Para todas las requests, siempre ir a la red sin caché
  event.respondWith(
    fetch(event.request, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    }).catch(() => {
      // Si falla la red, devolver error
      return new Response('Error de red', { status: 503 });
    })
  );
});

// Mensaje para forzar actualización
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

