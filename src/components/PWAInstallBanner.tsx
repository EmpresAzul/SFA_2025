
import React, { useState } from 'react';
import { X, Download, Smartphone, Share, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const PWAInstallBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { isInstallable, isInstalled, isIOS, installPWA, getIOSInstallInstructions, canShowInstallPrompt } = usePWAInstall();

  // Don't show if dismissed, already installed, or not installable
  if (dismissed || isInstalled || !canShowInstallPrompt) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, we'll show instructions
      return;
    }
    
    const success = await installPWA();
    if (success) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  // Check if banner was already dismissed this session
  React.useEffect(() => {
    const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isIOS) {
    const instructions = getIOSInstallInstructions();
    
    return (
      <Card className="fixed bottom-4 left-4 right-4 z-40 shadow-xl border-2 border-fluxo-blue-500 bg-gradient-to-r from-fluxo-blue-50 via-white to-fluxo-blue-50 mx-auto max-w-md animate-slide-up">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Apple className="h-5 w-5 text-gray-600" />
                  <Smartphone className="h-5 w-5 text-fluxo-blue-600" />
                </div>
                <h3 className="font-bold text-fluxo-blue-900">
                  Instalar FluxoAzul
                </h3>
              </div>
              <p className="text-sm text-gray-700 mb-3 font-medium">
                Adicione à sua tela inicial para acesso rápido e melhor experiência
              </p>
              <div className="space-y-2 bg-white/60 rounded-lg p-3 border">
                <div className="flex items-center gap-2 text-xs text-gray-800">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white font-bold text-[10px]">
                    1
                  </div>
                  <span className="flex items-center gap-1">
                    Toque no ícone <Share className="h-3 w-3 inline" /> de compartilhar
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-800">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white font-bold text-[10px]">
                    2
                  </div>
                  <span>Role para baixo e toque em "Adicionar à Tela de Início"</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-800">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full text-white font-bold text-[10px]">
                    3
                  </div>
                  <span>Toque em "Adicionar" para finalizar</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-40 shadow-xl border-2 border-fluxo-blue-500 bg-gradient-to-r from-fluxo-blue-50 via-white to-fluxo-blue-50 mx-auto max-w-md animate-slide-up">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-fluxo-blue-100 rounded-full">
                <Download className="h-4 w-4 text-fluxo-blue-600" />
              </div>
              <h3 className="font-bold text-fluxo-blue-900">
                Instalar FluxoAzul
              </h3>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              Adicione o app à sua tela inicial para acesso rápido e uso offline
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Depois
            </Button>
            <Button
              onClick={handleInstall}
              size="sm"
              className="bg-fluxo-blue-600 hover:bg-fluxo-blue-700 text-white font-semibold shadow-md"
            >
              <Download className="h-3 w-3 mr-1" />
              Instalar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallBanner;
