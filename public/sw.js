const CACHE_NAME = "fluxoazul-v2.0.1";
const STATIC_CACHE = "fluxoazul-static-v2.0.1";
const DYNAMIC_CACHE = "fluxoazul-dynamic-v2.0.1";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/favicon.svg",
  "/icon-192x192.png"
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

// Fetch event - optimized for custom domain
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Skip external requests, API calls, and non-GET requests
  if (
    url.origin !== location.origin ||
    url.pathname.includes("/api/") ||
    url.hostname.includes("supabase") ||
    url.hostname.includes("vercel") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // For static assets: Cache-first strategy
        if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          const response = await fetch(event.request);
          if (response.ok && response.status < 400) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(event.request, response.clone());
          }
          return response;
        }
        
        // For navigation: Network-first with no-cache headers
        if (event.request.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html")) {
          try {
            const response = await fetch(event.request, {
              cache: 'no-cache',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            });
            
            if (response.ok && response.status < 400) {
              const cache = await caches.open(DYNAMIC_CACHE);
              cache.put(event.request, response.clone());
            }
            
            return response;
          } catch (networkError) {
            console.log('FluxoAzul PWA: Network failed, trying cache');
            
            const cachedResponse = await caches.match(event.request) || await caches.match("/index.html") || await caches.match("/");
            if (cachedResponse) {
              return cachedResponse;
            }
            
            return new Response(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>FluxoAzul - Offline</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    text-align: center; 
                    padding: 50px 20px; 
                    background: #f8fafc;
                    color: #334155;
                    margin: 0;
                  }
                  .container { 
                    max-width: 400px; 
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                  }
                  h1 { color: #1e293b; margin-bottom: 16px; }
                  p { margin-bottom: 24px; line-height: 1.6; }
                  button {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    margin: 5px;
                  }
                  button:hover { background: #2563eb; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>FluxoAzul Offline</h1>
                  <p>Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.</p>
                  <button onclick="window.location.reload()">Tentar Novamente</button>
                  <button onclick="window.location.href='/'">Ir para Início</button>
                </div>
              </body>
              </html>
            `, {
              headers: { 'Content-Type': 'text/html' }
            });
          }
        }
        
        // For other requests: Network-first
        const response = await fetch(event.request);
        
        if (response.ok && response.status < 400) {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(event.request, response.clone());
        }
        
        return response;
        
      } catch (error) {
        console.error('FluxoAzul PWA: Fetch error:', error);
        
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        if (event.request.mode === "navigate") {
          return new Response("Erro de Rede", { status: 503 });
        }
        
        throw error;
      }
    })()
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
