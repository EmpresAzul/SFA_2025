
const CACHE_NAME = 'fluxoazul-v2.0.0';
const STATIC_CACHE = 'fluxoazul-static-v2.0.0';
const DYNAMIC_CACHE = 'fluxoazul-dynamic-v2.0.0';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png',
  '/lovable-uploads/b004bf2a-e9b1-4f11-87da-28e15f0cb2e2.png',
  '/login',
  '/dashboard'
];

const OFFLINE_FALLBACK_PAGE = '/';

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('FluxoAzul PWA: Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('FluxoAzul PWA: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('FluxoAzul PWA: Resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('FluxoAzul PWA: Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('FluxoAzul PWA: Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('FluxoAzul PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('FluxoAzul PWA: Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - Network First with Cache Fallback strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    networkFirstWithCacheFallback(event.request)
  );
});

async function networkFirstWithCacheFallback(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response for future use
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('FluxoAzul PWA: Network failed, trying cache...', error);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a navigation request and we don't have it cached, return offline page
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match(OFFLINE_FALLBACK_PAGE);
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    // For other requests, return a basic 503 response
    return new Response('Offline - Sem conexão com a internet', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background sync for when connectivity is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('FluxoAzul PWA: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Here you could sync any pending data when connectivity is restored
  console.log('FluxoAzul PWA: Performing background sync...');
}

// Push notifications support
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png',
    badge: '/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir FluxoAzul',
        icon: '/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'FluxoAzul', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
