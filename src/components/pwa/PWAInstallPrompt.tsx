import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { useResponsiveClasses } from '@/hooks/useResponsiveDesign';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar se já está instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listener para o evento beforeinstallprompt (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt após 30 segundos se não estiver instalado
      setTimeout(() => {
        if (!standalone) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      console.log('FluxoAzul PWA: App instalado com sucesso!');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Para iOS, mostrar prompt após 1 minuto se não estiver instalado
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 60000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('FluxoAzul PWA: Usuário aceitou a instalação');
      } else {
        console.log('FluxoAzul PWA: Usuário recusou a instalação');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Não mostrar novamente por 7 dias
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Não mostrar se já está instalado ou foi dispensado recentemente
  if (isStandalone || !showPrompt) {
    return null;
  }

  // Verificar se foi dispensado recentemente
  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissedTime) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      return null;
    }
  }

  const { getCardClass, getButtonClass, getTextClass, isMobile } = useResponsiveClasses();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className={`${getCardClass('elevated')} border-0`} 
           style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className={`${getTextClass('md')} text-white font-semibold`}>
                  Instalar FluxoAzul
                </h3>
                <p className={`${getTextClass('body-sm')} text-white/90`}>
                  Acesso rápido e funcionalidade offline
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 mobile-touch"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isIOS ? (
            <div className="space-y-4">
              <p className={`${getTextClass('body-md')} text-white/95`}>
                Para instalar no iOS:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white/70 rounded-full flex-shrink-0"></div>
                  <span className={`${getTextClass('body-sm')} text-white/90`}>
                    Toque no ícone de compartilhar (⬆️)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white/70 rounded-full flex-shrink-0"></div>
                  <span className={`${getTextClass('body-sm')} text-white/90`}>
                    Selecione "Adicionar à Tela de Início"
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
              <button
                onClick={handleInstallClick}
                disabled={!deferredPrompt}
                className={`
                  flex-1 bg-white text-blue-600 hover:bg-white/95 
                  font-medium rounded-lg px-4 py-3 
                  transition-all duration-200 mobile-touch
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                `}
              >
                <Download className="h-4 w-4" />
                <span className={getTextClass('body-md')}>Instalar App</span>
              </button>
              <button
                onClick={handleDismiss}
                className={`
                  text-white hover:bg-white/20 font-medium rounded-lg 
                  px-4 py-3 transition-all duration-200 mobile-touch
                  ${isMobile ? 'w-full' : 'min-w-[120px]'}
                `}
              >
                <span className={getTextClass('body-md')}>Agora não</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;