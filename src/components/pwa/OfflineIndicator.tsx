import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useResponsiveClasses } from '@/hooks/useResponsiveDesign';

const OfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();
  const { getTextClass, isMobile } = useResponsiveClasses();

  // Only show if actually offline (not just Service Worker cache issues)
  if (!isOffline || navigator.onLine) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 safe-area-top" 
         style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' }}>
      <div className="fluxo-container">
        <div className={`
          flex items-center justify-center gap-3 py-3 px-4
          ${isMobile ? 'flex-col text-center' : 'flex-row'}
        `}>
          <div className="flex items-center gap-2 text-white">
            <WifiOff className="h-4 w-4 flex-shrink-0" />
            <span className={`${getTextClass('body-md')} font-medium`}>
              {isMobile ? 'Sem conexão' : 'Sem conexão com a internet'}
            </span>
          </div>
          
          <span className={`${getTextClass('body-sm')} text-white/90 ${isMobile ? 'text-xs' : ''}`}>
            {isMobile 
              ? 'Funcionalidades limitadas' 
              : 'Algumas funcionalidades podem estar limitadas'
            }
          </span>
          
          <button 
            onClick={() => window.location.reload()} 
            className={`
              bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg
              px-3 py-1.5 transition-all duration-200 mobile-touch
              flex items-center gap-2 backdrop-blur-sm
              ${isMobile ? 'text-sm' : 'text-xs'}
            `}
          >
            <RefreshCw className="h-3 w-3" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;