import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();

  // Only show if actually offline (not just Service Worker cache issues)
  if (!isOffline || navigator.onLine) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>Sem conexão com a internet. Algumas funcionalidades podem estar limitadas.</span>
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-2 py-1 bg-destructive/80 rounded text-xs hover:bg-destructive/90"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;