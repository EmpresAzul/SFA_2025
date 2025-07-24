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
  "/lovable-uploads/43485371-baca-4cf3-9711-e59f1d1dfe3c.png",
  "/lovable-uploads/b004bf2a-e9b1-4f11-87da-28e15f0cb2e2.png",
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

// Fetch event - advanced caching strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        // For API calls, try to fetch fresh data in background
        if (
          event.request.url.includes("/api/") ||
          event.request.url.includes("supabase")
        ) {
          fetch(event.request)
            .then((freshResponse) => {
              if (freshResponse.ok) {
                const responseClone = freshResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
            })
            .catch(() => {
              // Silently fail background updates
            });
        }
        return response;
      }

      // Fetch from network
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

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          // Return empty response for other requests
          return new Response("", { status: 404 });
        });
    }),
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
