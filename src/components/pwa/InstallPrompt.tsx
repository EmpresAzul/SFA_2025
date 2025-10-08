import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  onInstall,
  onDismiss
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const location = useLocation();

  // Só mostrar na página de login
  const isLoginPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Só mostrar se estiver na página de login
    if (!isLoginPage) {
      setShowPrompt(false);
      return;
    }

    // Verificar se o usuário já dismissou o prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const daysSinceDismissed = dismissedDate ?
      (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24) : 999;

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listener para detectar instalação
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
      onInstall?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Mostrar prompt se não foi dismissado recentemente (7 dias)
    if (!dismissed || daysSinceDismissed > 7) {
      setTimeout(() => setShowPrompt(true), 1500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isLoginPage, onInstall]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Android - usar prompt nativo para download imediato
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          onInstall?.();
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error('Erro ao instalar:', error);
        setShowPrompt(false);
      }
    } else {
      // Para iOS ou outros browsers - mostrar instruções
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);

      if (isIOS) {
        alert('Para instalar:\n1. Toque no botão de compartilhar (⬆️)\n2. Selecione "Adicionar à Tela Inicial"\n3. Toque em "Adicionar"');
      } else {
        alert('Para instalar:\n1. Use o menu do navegador\n2. Selecione "Instalar FluxoAzul" ou "Adicionar à área de trabalho"');
      }

      onInstall?.();
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    onDismiss?.();
  };

  // Não mostrar se não estiver na página de login, se já estiver instalado, ou se não deve mostrar
  if (!isLoginPage || isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex gap-3">
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Baixar Aplicativo
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            size="sm"
            className="flex-1"
          >
            Agora Não
          </Button>
        </div>
      </div>
    </div>
  );
};