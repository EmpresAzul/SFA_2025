// Service Worker para FluxoAzul - FECHAMENTO26
const CACHE_NAME = 'fluxoazul-v-FECHAMENTO26-' + Date.now();
const CACHE_VERSION = 'FECHAMENTO26';

// Força atualização do cache
self.addEventListener('install', (event) => {
  console.log('SW: Installing new version', CACHE_VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activating new version', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Força reload da página para aplicar novas mudanças
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'FORCE_RELOAD') {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'RELOAD_PAGE' });
      });
    });
  }
});

// Intercepta requests para forçar cache busting
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'style' || 
      event.request.url.includes('.css') ||
      event.request.url.includes('index.css')) {
    // Força reload de CSS
    const url = new URL(event.request.url);
    url.searchParams.set('v', CACHE_VERSION);
    
    event.respondWith(
      fetch(url.toString(), {
        cache: 'no-cache'
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});