const CACHE_NAME = "fluxoazul-v2.0.0";
const urlsToCache = [
  "/",
  "/dashboard",
  "/lancamentos",
  "/fluxo-caixa",
  "/dre",
  "/precificacao",
  "/estoque",
  "/cadastros",
  "/saldos-bancarios",
  "/lembretes",
  "/ponto-equilibrio",
  "/suporte",
  "/manifest.json",
  "/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png",
  "/lovable-uploads/b004bf2a-e9b1-4f11-87da-28e15f0cb2e2.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  console.log("FluxoAzul PWA: Service Worker installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("FluxoAzul PWA: Cache opened successfully");
        return cache.addAll(
          urlsToCache.map((url) => new Request(url, { cache: "reload" })),
        );
      })
      .then(() => {
        console.log("FluxoAzul PWA: All resources cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("FluxoAzul PWA: Cache installation failed:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("FluxoAzul PWA: Service Worker activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("FluxoAzul PWA: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("FluxoAzul PWA: Service Worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - improved error handling and caching strategy
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        // For API calls, try to fetch fresh data in background
        if (
          event.request.url.includes("/api/") ||
          event.request.url.includes("supabase")
        ) {
          fetch(event.request)
            .then((freshResponse) => {
              if (freshResponse && freshResponse.ok) {
                const responseClone = freshResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                }).catch((error) => {
                  console.log('FluxoAzul PWA: Cache update failed:', error);
                });
              }
            })
            .catch((error) => {
              console.log('FluxoAzul PWA: Background fetch failed:', error);
            });
        }
        return cachedResponse;
      }

      // Fetch from network with improved error handling
      return fetch(event.request)
        .then((response) => {
          // Check for valid response
          if (!response) {
            throw new Error('No response received');
          }

          // Don't cache error responses
          if (response.status >= 400) {
            return response;
          }

          // Only cache successful responses from same origin or CORS-enabled
          if (response.type === "basic" || response.type === "cors") {
            try {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              }).catch((error) => {
                console.log('FluxoAzul PWA: Cache storage failed:', error);
              });
            } catch (error) {
              console.log('FluxoAzul PWA: Response clone failed:', error);
            }
          }

          return response;
        })
        .catch((error) => {
          console.log('FluxoAzul PWA: Fetch failed:', error);
          
          // For navigation requests, return cached index page
          if (event.request.mode === "navigate") {
            return caches.match("/").then((response) => {
              if (response) {
                return response;
              }
              // Fallback offline page
              return new Response(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>FluxoAzul - Offline</title>
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                    .container { max-width: 400px; margin: 0 auto; }
                    .icon { font-size: 48px; margin-bottom: 20px; }
                    h1 { color: #1e3a8a; }
                    button { background: #1e3a8a; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
                    button:hover { background: #1e40af; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="icon">📱</div>
                    <h1>FluxoAzul</h1>
                    <p>Você está offline. Verifique sua conexão e tente novamente.</p>
                    <button onclick="window.location.reload()">Tentar Novamente</button>
                  </div>
                </body>
                </html>
              `, { 
                headers: { 'Content-Type': 'text/html' },
                status: 200 
              });
            });
          }
          
          // For other requests, return a simple error response
          return new Response(JSON.stringify({ 
            error: 'Network error', 
            message: 'Unable to fetch resource' 
          }), { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
    }).catch((error) => {
      console.error('FluxoAzul PWA: Cache match failed:', error);
      return new Response('Service unavailable', { status: 503 });
    })
  );
});

// Background sync for when connectivity is restored
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("FluxoAzul PWA: Background sync triggered");
    event.waitUntil(
      // Here you could sync any pending data when connectivity is restored
      syncPendingData(),
    );
  }
});

async function syncPendingData() {
  try {
    // Implementation for syncing pending data
    console.log("FluxoAzul PWA: Syncing pending data...");
    // This would sync any pending financial transactions, etc.
  } catch (error) {
    console.error("FluxoAzul PWA: Background sync failed:", error);
  }
}

// Push notification handler
self.addEventListener("push", (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: "/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png",
      badge: "/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    event.waitUntil(self.registration.showNotification("FluxoAzul", options));
  }
});
