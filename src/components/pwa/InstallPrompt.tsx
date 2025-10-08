import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Smartphone, Share } from 'lucide-react';

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
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('unknown');

  useEffect(() => {
    // Detectar plataforma
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) {
      setPlatform('android');
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else {
      setPlatform('desktop');
    }

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listener para o evento beforeinstallprompt (Chrome/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Verificar se o usuário já dismissou o prompt
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedDate = dismissed ? new Date(dismissed) : null;
      const daysSinceDismissed = dismissedDate ? 
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24) : 999;

      // Mostrar prompt se não foi dismissado recentemente (7 dias)
      if (!dismissed || daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 3000); // Mostrar após 3 segundos
      }
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

    // Para iOS, mostrar prompt após algumas visitas
    if (platform === 'ios') {
      const visits = parseInt(localStorage.getItem('pwa-visits') || '0');
      localStorage.setItem('pwa-visits', (visits + 1).toString());
      
      if (visits >= 2 && !localStorage.getItem('pwa-install-dismissed')) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [platform, onInstall]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        onInstall?.();
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (platform === 'ios') {
      // iOS - não fechar automaticamente, deixar usuário seguir instruções
      return;
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    onDismiss?.();
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  const renderAndroidPrompt = () => (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 max-w-sm mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-800">
                Instalar FluxoAzul
              </CardTitle>
              <p className="text-xs text-gray-600">Acesso rápido na tela inicial</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4">
          Instale o FluxoAzul para acesso rápido e experiência otimizada!
        </p>
        <div className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Instalar
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            size="sm"
            className="px-4"
          >
            Agora não
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderIOSPrompt = () => (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 max-w-sm mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-800">
                Adicionar à Tela Inicial
              </CardTitle>
              <p className="text-xs text-gray-600">FluxoAzul</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-3">
          Para instalar o FluxoAzul:
        </p>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <span>Toque no botão <Share className="w-4 h-4 inline mx-1" /> (Compartilhar)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <span>Selecione "Adicionar à Tela Inicial"</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <span>Toque em "Adicionar"</span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleDismiss}
          className="w-full"
          size="sm"
        >
          Entendi
        </Button>
      </CardContent>
    </Card>
  );

  if (platform === 'ios') {
    return renderIOSPrompt();
  }

  return renderAndroidPrompt();
};