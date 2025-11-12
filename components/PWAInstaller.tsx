'use client'

import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Registrar service worker
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((registration) => {
          console.log('Service Worker registrado:', registration)

          // Verificar actualizaciones periódicamente
          setInterval(() => {
            registration.update()
          }, 60000) // Cada minuto

          // Escuchar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Hay una nueva versión disponible
                  console.log('Nueva versión disponible')
                  // Forzar actualización
                  newWorker.postMessage({ type: 'SKIP_WAITING' })
                  // Recargar la página
                  window.location.reload()
                }
              })
            }
          })

          // Escuchar cuando el service worker toma control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker tomó control, recargando...')
            window.location.reload()
          })
        })
        .catch((error) => {
          console.log('Error al registrar Service Worker:', error)
        })
    }
  }, [])

  return null
}

