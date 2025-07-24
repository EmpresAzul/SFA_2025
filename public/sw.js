const CACHE_NAME = "fluxoazul-v3.0.0";
const STATIC_CACHE = "fluxoazul-static-v3.0.0";
const DYNAMIC_CACHE = "fluxoazul-dynamic-v3.0.0";

const urlsToCache = [
  "/",
  "/dashboard",
  "/lancamentos",
  "/fluxo-caixa",
  "/dre",
  "/precificacao",
  "/estoque",
  "/cadastros",
  "/crm",
  "/saldos-bancarios",
  "/lembretes",
  "/ponto-equilibrio",
  "/suporte",
  "/perfil",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.svg",
  "/icon-192x192.png",
];

const OFFLINE_PAGE = "/";
const MAX_CACHE_SIZE = 50;

// Install event - cache resources
self.addEventListener("install", (event) => {
  console.log("FluxoAzul PWA: Service Worker installing...");
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("FluxoAzul PWA: Static cache opened");
        return cache.addAll(
          urlsToCache.map((url) => new Request(url, { cache: "reload" }))
        );
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log("FluxoAzul PWA: Dynamic cache opened");
        return cache.put(OFFLINE_PAGE, new Response("Offline"));
      })
    ])
    .then(() => {
      console.log("FluxoAzul PWA: All resources cached successfully");
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error("FluxoAzul PWA: Cache installation failed:", error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("FluxoAzul PWA: Service Worker activating...");
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
              console.log("FluxoAzul PWA: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
    .then(() => {
      console.log("FluxoAzul PWA: Service Worker activated and claimed clients");
    })
  );
});

// Fetch event - improved caching strategy for custom domains
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Skip cache for API requests and Supabase to avoid stale data
  if (
    url.pathname.includes("/api/") ||
    url.hostname.includes("supabase") ||
    event.request.method !== "GET"
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version for static assets only
      if (response && (
        event.request.url.includes('.js') ||
        event.request.url.includes('.css') ||
        event.request.url.includes('.png') ||
        event.request.url.includes('.jpg') ||
        event.request.url.includes('.svg')
      )) {
        return response;
      }

      // For navigation requests, always try network first
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Only cache static assets
          if (
            event.request.url.includes('.js') ||
            event.request.url.includes('.css') ||
            event.request.url.includes('.png') ||
            event.request.url.includes('.jpg') ||
            event.request.url.includes('.svg')
          ) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Only return cached version if available, otherwise show network error
          if (response) {
            return response;
          }
          
          // For navigation requests, return cached index if available
          if (event.request.mode === "navigate") {
            return caches.match("/").then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return a simple error page instead of generic offline message
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>FluxoAzul - Sem Conexão</title>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: #e53e3e; }
                    button { padding: 10px 20px; margin: 10px; background: #3182ce; color: white; border: none; border-radius: 5px; cursor: pointer; }
                  </style>
                </head>
                <body>
                  <h1>FluxoAzul</h1>
                  <p class="error">Não foi possível conectar ao servidor.</p>
                  <p>Verifique sua conexão com a internet e tente novamente.</p>
                  <button onclick="window.location.reload()">Tentar Novamente</button>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html' }
              });
            });
          }
          
          return new Response("Network Error", { status: 503 });
        });
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
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    event.waitUntil(self.registration.showNotification("FluxoAzul", options));
  }
});
