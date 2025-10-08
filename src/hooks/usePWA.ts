import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: false,
    isUpdateAvailable: false,
  });

  useEffect(() => {
    // Verificar se está instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      
      setPwaState(prev => ({ ...prev, isInstalled: isStandalone }));
    };

    // Verificar status offline com teste de conectividade real
    const updateOnlineStatus = async () => {
      const isOnline = navigator.onLine;
      
      if (!isOnline) {
        setPwaState(prev => ({ ...prev, isOffline: true }));
        return;
      }

      // Teste de conectividade real para evitar falsos positivos
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('/health-check.json', {
          method: 'HEAD',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setPwaState(prev => ({ ...prev, isOffline: !response.ok }));
      } catch (error) {
        // Se o health check falhar, considerar como potencialmente offline
        // mas não marcar definitivamente como offline se navigator.onLine é true
        setPwaState(prev => ({ ...prev, isOffline: false }));
      }
    };

    // Listener para beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({ ...prev, isInstallable: true }));
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
    };

    // Verificar atualizações do Service Worker
    const checkForUpdates = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
        });
      }
    };

    // Registrar Service Worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          console.log('FluxoAzul PWA: Service Worker registrado:', registration);

          // Verificar atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
                }
              });
            }
          });

        } catch (error) {
          console.error('FluxoAzul PWA: Erro ao registrar Service Worker:', error);
        }
      }
    };

    // Inicializar
    checkInstalled();
    updateOnlineStatus();
    registerServiceWorker();
    checkForUpdates();

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
          window.location.reload();
        }
      });
    }
  };

  return {
    ...pwaState,
    updateApp,
  };
};