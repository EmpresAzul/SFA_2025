
import React, { useState } from 'react';
import { X, Download, Smartphone, Share } from 'lucide-react';
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
  };

  if (isIOS) {
    const instructions = getIOSInstallInstructions();
    
    return (
      <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-lg border-fluxo-blue-500 bg-gradient-to-r from-fluxo-blue-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-fluxo-blue-600" />
                <h3 className="font-semibold text-fluxo-blue-900">Instalar FluxoAzul</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Adicione o FluxoAzul à sua tela inicial para acesso rápido
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Share className="h-3 w-3" />
                  <span>{instructions.step1}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="w-3 h-3 bg-fluxo-blue-500 rounded-full text-white text-[10px] flex items-center justify-center">2</span>
                  <span>{instructions.step2}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="w-3 h-3 bg-fluxo-blue-500 rounded-full text-white text-[10px] flex items-center justify-center">3</span>
                  <span>{instructions.step3}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-lg border-fluxo-blue-500 bg-gradient-to-r from-fluxo-blue-50 to-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Download className="h-5 w-5 text-fluxo-blue-600" />
              <h3 className="font-semibold text-fluxo-blue-900">Instalar FluxoAzul</h3>
            </div>
            <p className="text-sm text-gray-600">
              Adicione o app à sua tela inicial para acesso rápido e offline
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-600"
            >
              Agora não
            </Button>
            <Button
              onClick={handleInstall}
              size="sm"
              className="bg-fluxo-blue-600 hover:bg-fluxo-blue-700"
            >
              Instalar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallBanner;
