import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
// import { useRegisterSW } from 'virtual:pwa-register/react';

interface UpdateNotificationProps {
  onUpdate?: () => void;
  onDismiss?: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  onUpdate,
  onDismiss
}) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Temporary implementation without useRegisterSW
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  
  const updateServiceWorker = async (reloadPage?: boolean) => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        if (reloadPage) {
          window.location.reload();
        }
      }
    }
  };

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setNeedRefresh(true);
      });
      
      // Check if app is ready for offline use
      navigator.serviceWorker.ready.then(() => {
        setOfflineReady(true);
        setTimeout(() => setOfflineReady(false), 5000); // Hide after 5 seconds
      });
    }
  }, []);

  useEffect(() => {
    if (needRefresh) {
      setShowUpdate(true);
    }
  }, [needRefresh]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateServiceWorker(true);
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setIsUpdating(false);
      setShowUpdate(false);
      setNeedRefresh(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    setNeedRefresh(false);
    onDismiss?.();
  };

  if (offlineReady && !needRefresh) {
    return (
      <Card className="fixed top-4 right-4 z-50 shadow-lg bg-green-50 border-green-200 max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-800 font-medium">
              App pronto para uso offline!
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOfflineReady(false)}
              className="ml-auto h-6 w-6 p-0 hover:bg-green-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showUpdate || !needRefresh) {
    return null;
  }

  return (
    <Card className="fixed top-4 right-4 z-50 shadow-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">
                Nova versão disponível!
              </h4>
              <p className="text-xs text-gray-600">
                Atualize para a versão mais recente
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm py-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={isUpdating}
            className="px-4 text-sm"
          >
            Depois
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};