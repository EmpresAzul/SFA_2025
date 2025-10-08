import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';

export const PWADebugInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [swRegistration, setSWRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const pwa = usePWA();

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      setIsVisible(true);
    }

    // Get service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(setSWRegistration);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => (
    <Badge variant={condition ? "default" : "secondary"}>
      {condition ? trueText : falseText}
    </Badge>
  );

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-sm bg-white/95 backdrop-blur-sm border-2 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">PWA Debug Info</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>Platform:</div>
          <Badge variant="outline">{pwa.platform}</Badge>
          
          <div>Online:</div>
          {getStatusBadge(pwa.isOnline, "Online", "Offline")}
          
          <div>Installed:</div>
          {getStatusBadge(pwa.isInstalled, "Yes", "No")}
          
          <div>Installable:</div>
          {getStatusBadge(pwa.isInstallable, "Yes", "No")}
          
          <div>SW Active:</div>
          {getStatusBadge(!!swRegistration?.active, "Yes", "No")}
          
          <div>Standalone:</div>
          {getStatusBadge(
            window.matchMedia('(display-mode: standalone)').matches,
            "Yes", 
            "No"
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-gray-600 mb-2">Actions:</div>
          <div className="flex gap-2">
            {pwa.canInstall && (
              <Button
                size="sm"
                onClick={pwa.installApp}
                className="text-xs h-6"
              >
                Install
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-xs h-6"
            >
              Reload
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t text-xs text-gray-500">
          <div>Screen: {window.innerWidth}×{window.innerHeight}</div>
          <div>User Agent: {navigator.userAgent.slice(0, 30)}...</div>
        </div>
      </CardContent>
    </Card>
  );
};