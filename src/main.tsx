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

// Register service worker for PWA functionality - improved for custom domains
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    // Add small delay to ensure DOM is fully loaded
    setTimeout(() => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log(
            "FluxoAzul PWA: Service Worker registered successfully:",
            registration.scope,
            "- Domain:", window.location.hostname
          );
          
          // Force update check for custom domains
          if (!window.location.hostname.includes('lovable.app')) {
            registration.update();
          }
        })
        .catch((error) => {
          console.log(
            "FluxoAzul PWA: Service Worker registration failed:",
            error,
            "- Domain:", window.location.hostname
          );
        });
    }, 1000);
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
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
        <h1>FluxoAzul - Erro de Inicialização</h1>
        <p>Erro ao carregar a aplicação: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <p>Por favor, recarregue a página ou contate o suporte.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">
          Recarregar Página
        </button>
      </div>
    `;
  }
}
