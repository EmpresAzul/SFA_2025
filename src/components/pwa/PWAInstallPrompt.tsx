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
      <div 
        className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl"
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(15, 40, 71, 0.95) 50%, rgba(26, 58, 92, 0.95) 100%)'
        }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg backdrop-blur-sm shadow-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg text-white font-bold tracking-wide">
                  FLUXO<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AZUL</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-light">
                  Gestão Financeira Inteligente
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 mobile-touch"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isIOS ? (
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-white/90 font-medium">
                Para instalar no iOS:
              </p>
              <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-white/80">
                    Toque no ícone de compartilhar (⬆️)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-white/80">
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
                className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm sm:text-base">Instalar App</span>
              </button>
              <button
                onClick={handleDismiss}
                className={`text-white/70 hover:text-white hover:bg-white/10 font-medium rounded-xl px-4 py-3 transition-all duration-200 mobile-touch border border-white/20 ${isMobile ? 'w-full' : 'min-w-[120px]'}`}
              >
                <span className="text-sm sm:text-base">Agora não</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;