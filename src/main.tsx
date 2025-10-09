import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";
import { initializeSecurity } from "@/utils/securityEnforcement";

// Lovable tagger will be handled by vite.config.ts in development mode

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
    },
  },
});

// Register service worker for PWA functionality - FECHAMENTO25 Force Update
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Force immediate registration and update
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log(
          "FluxoAzul PWA FECHAMENTO25: Service Worker registered:",
          registration.scope
        );
        
        // Force immediate update
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available, force reload
                console.log('FluxoAzul: New version available, reloading...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log("FluxoAzul PWA: Service Worker registration failed:", error);
      });
  });
  
  // Force reload on SW message
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'RELOAD_PAGE') {
      window.location.reload();
    }
  });
}

// Enhanced debug information
console.log('FluxoAzul: Application starting...', {
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD,
  dev: import.meta.env.DEV,
  base: import.meta.env.BASE_URL,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'configured' : 'using fallback',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'configured' : 'using fallback',
  userAgent: navigator.userAgent,
  online: navigator.onLine,
  timestamp: new Date().toISOString()
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('FluxoAzul Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('FluxoAzul Unhandled promise rejection:', {
    reason: event.reason,
    promise: event.promise
  });
});

// Initialize enhanced security measures
initializeSecurity({
  enforceCSP: true,
  blockDevTools: import.meta.env.PROD,
  preventRightClick: import.meta.env.PROD,
  detectScreenRecording: import.meta.env.PROD,
  rateLimitRequests: true
});

// App rendering with enhanced error handling
try {
  console.log('FluxoAzul: Starting React render...');
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('FluxoAzul: Root element found, creating React root...');
  
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
  
  console.log('FluxoAzul: React render completed successfully');
} catch (error) {
  console.error('FluxoAzul: Critical error during app initialization:', error);
  
  // Fallback error display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    // Limpa o conteúdo anterior
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }
    // Cria container
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.color = 'red';
    container.style.fontFamily = 'Arial, sans-serif';

    const h1 = document.createElement('h1');
    h1.textContent = 'FluxoAzul - Erro de Inicialização';
    container.appendChild(h1);

    const p1 = document.createElement('p');
    p1.textContent = `Erro ao carregar a aplicação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
    container.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = 'Por favor, recarregue a página ou contate o suporte.';
    container.appendChild(p2);

    const button = document.createElement('button');
    button.textContent = 'Recarregar Página';
    button.style.padding = '10px 20px';
    button.style.marginTop = '10px';
    button.onclick = () => window.location.reload();
    container.appendChild(button);

    rootElement.appendChild(container);
  }
}
// FECHAMENTO25 - Force cache clear for PWA and mobile
if (typeof window !== 'undefined') {
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (!name.includes('FECHAMENTO25')) {
          caches.delete(name);
        }
      });
    });
  }
  
  // Force CSS reload
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
  cssLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.includes('FECHAMENTO25')) {
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = href + '?v=FECHAMENTO25-' + Date.now();
      document.head.appendChild(newLink);
      link.remove();
    }
  });
  
  // Add version info to localStorage
  localStorage.setItem('fluxoazul-version', 'FECHAMENTO25');
  localStorage.setItem('fluxoazul-build-time', new Date().toISOString());
}