import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
  showInstallPrompt: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    platform: 'unknown',
    showInstallPrompt: false
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detectar plataforma
    const userAgent = navigator.userAgent.toLowerCase();
    let platform: PWAState['platform'] = 'unknown';
    
    if (/android/.test(userAgent)) {
      platform = 'android';
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      platform = 'ios';
    } else {
      platform = 'desktop';
    }

    // Verificar se está instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    setState(prev => ({
      ...prev,
      platform,
      isInstalled
    }));

    // Event listeners
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      setState(prev => ({
        ...prev,
        isInstallable: true,
        showInstallPrompt: !isInstalled
      }));
    };

    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        showInstallPrompt: false
      }));
      setDeferredPrompt(null);
    };

    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      setDeferredPrompt(null);
      setState(prev => ({ ...prev, showInstallPrompt: false }));
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      return false;
    }
  };

  const dismissInstallPrompt = () => {
    setState(prev => ({ ...prev, showInstallPrompt: false }));
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  const canInstall = () => {
    return state.isInstallable && !state.isInstalled && deferredPrompt !== null;
  };

  const getInstallInstructions = () => {
    switch (state.platform) {
      case 'ios':
        return {
          title: 'Adicionar à Tela Inicial',
          steps: [
            'Toque no botão de compartilhar (⬆️)',
            'Selecione "Adicionar à Tela Inicial"',
            'Toque em "Adicionar"'
          ]
        };
      case 'android':
        return {
          title: 'Instalar App',
          steps: [
            'Toque em "Instalar" quando aparecer o prompt',
            'Ou use o menu do navegador > "Adicionar à tela inicial"'
          ]
        };
      default:
        return {
          title: 'Adicionar como App',
          steps: [
            'Use o menu do navegador',
            'Selecione "Instalar FluxoAzul" ou "Adicionar à área de trabalho"'
          ]
        };
    }
  };

  return {
    ...state,
    installApp,
    dismissInstallPrompt,
    canInstall: canInstall(),
    installInstructions: getInstallInstructions()
  };
};