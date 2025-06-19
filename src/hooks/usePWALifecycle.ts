
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PWALifecycleState {
  isOnline: boolean;
  isInstalled: boolean;
  updateAvailable: boolean;
  isUpdating: boolean;
}

export const usePWALifecycle = () => {
  const [state, setState] = useState<PWALifecycleState>({
    isOnline: navigator.onLine,
    isInstalled: false,
    updateAvailable: false,
    isUpdating: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone;
    setState(prev => ({ 
      ...prev, 
      isInstalled: isStandalone || isInWebAppiOS 
    }));

    // Online/Offline detection
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Conexão restaurada",
        description: "Você está online novamente!",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "Sem conexão",
        description: "Você está offline. Algumas funcionalidades podem estar limitadas.",
        variant: "destructive",
        duration: 5000,
      });
    };

    // Service Worker update detection
    const handleSWUpdate = () => {
      setState(prev => ({ ...prev, updateAvailable: true }));
      toast({
        title: "Atualização disponível",
        description: "Uma nova versão do FluxoAzul está disponível.",
        duration: 0, // Don't auto-dismiss
      });
    };

    // Register event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker registration and update handling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                handleSWUpdate();
              }
            });
          }
        });
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          handleSWUpdate();
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const updateServiceWorker = async () => {
    setState(prev => ({ ...prev, isUpdating: true }));
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const waitingWorker = registration.waiting;
        
        if (waitingWorker) {
          waitingWorker.postMessage({ type: 'SKIP_WAITING' });
          waitingWorker.addEventListener('statechange', () => {
            if (waitingWorker.state === 'activated') {
              window.location.reload();
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar o app. Tente recarregar a página.",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isUpdating: false, updateAvailable: false }));
    }
  };

  const registerBackgroundSync = (tag: string) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check if sync is supported
        if ('sync' in registration) {
          return (registration as any).sync.register(tag);
        } else {
          console.log('Background sync not supported');
        }
      }).catch((error) => {
        console.error('Background sync registration failed:', error);
      });
    }
  };

  return {
    ...state,
    updateServiceWorker,
    registerBackgroundSync,
  };
};
