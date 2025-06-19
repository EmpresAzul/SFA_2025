
import React from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';

const PWAStatusIndicator: React.FC = () => {
  const { isOnline, updateAvailable, isUpdating, updateServiceWorker } = usePWALifecycle();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {/* Online/Offline Indicator */}
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>

      {/* Update Available Indicator */}
      {updateAvailable && (
        <Button
          size="sm"
          onClick={updateServiceWorker}
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="h-3 w-3 mr-1" />
          {isUpdating ? 'Atualizando...' : 'Atualizar'}
        </Button>
      )}
    </div>
  );
};

export default PWAStatusIndicator;
