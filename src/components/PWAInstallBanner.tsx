
import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useToast } from '@/hooks/use-toast';

const PWAInstallBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();
  const { 
    isInstallable, 
    isInstalled, 
    isIOS, 
    isAndroid,
    installPWA, 
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
    // Try direct installation first
    const success = await installPWA();
    
    if (success) {
      setDismissed(true);
      localStorage.setItem('pwa-banner-dismissed', 'true');
      toast({
        title: "FluxoAzul instalado!",
        description: "O app está pronto para uso.",
      });
    } else {
      // Fallback for devices that don't support automatic installation
      toast({
        title: "Instalação manual necessária",
        description: "Use o menu do seu navegador para adicionar à tela inicial.",
      });
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-xl border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 mx-auto max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              Instalar FluxoAzul
            </h3>
          </div>
          
          <div className="flex gap-2">
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
