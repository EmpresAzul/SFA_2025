
import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share, Chrome, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const PWAInstallBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { 
    isInstallable, 
    isInstalled, 
    isIOS, 
    isAndroid,
    installPWA, 
    getIOSInstallInstructions, 
    getAndroidInstallInstructions,
    canShowInstallPrompt 
  } = usePWAInstall();

  useEffect(() => {
    // Check if user has dismissed the banner before
    const hasBeenDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (hasBeenDismissed) {
      setDismissed(true);
    }
  }, []);

  // Don't show if dismissed, already installed, or not installable
  if (dismissed || isInstalled || !canShowInstallPrompt) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS || isAndroid) {
      setShowInstructions(true);
      return;
    }
    
    const success = await installPWA();
    if (success) {
      setDismissed(true);
      localStorage.setItem('pwa-banner-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (showInstructions && (isIOS || isAndroid)) {
    const instructions = isIOS ? getIOSInstallInstructions() : getAndroidInstallInstructions();
    
    return (
      <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-xl border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 mx-auto max-w-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {isIOS ? (
                <Apple className="h-6 w-6 text-gray-700" />
              ) : (
                <Chrome className="h-6 w-6 text-blue-600" />
              )}
              <h3 className="font-bold text-gray-900 text-lg">
                Instalar FluxoAzul
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 -mt-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Siga os passos abaixo para instalar o app:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm border">
              {isIOS ? (
                <Share className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Chrome className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              )}
              <span className="text-sm text-gray-700 leading-relaxed">
                {instructions.step1}
              </span>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">
                {instructions.step2}
              </span>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">
                {instructions.step3}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <Button
              onClick={() => setShowInstructions(false)}
              variant="outline"
              className="w-full text-sm"
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-xl border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 mx-auto max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Instalar FluxoAzul
                </h3>
                <p className="text-xs text-gray-500">
                  App gratuito para sua empresa
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Acesse offline, receba notificações e tenha o FluxoAzul sempre à mão
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 text-sm"
            >
              Instalar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              Agora não
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallBanner;
