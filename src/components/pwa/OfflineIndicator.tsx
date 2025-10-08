import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(true);
      
      // Mostrar indicador de reconexão por 3 segundos
      setShowIndicator(true);
      setTimeout(() => {
        setIsReconnecting(false);
        setTimeout(() => setShowIndicator(false), 2000);
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Mostrar indicador inicial se estiver offline
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) {
    return null;
  }

  const getIndicatorContent = () => {
    if (isReconnecting) {
      return {
        icon: <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />,
        text: 'Reconectando...',
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-800'
      };
    }

    if (isOnline) {
      return {
        icon: <Wifi className="h-4 w-4 text-green-600" />,
        text: 'Conectado',
        bgColor: 'bg-green-50 border-green-200',
        textColor: 'text-green-800'
      };
    }

    return {
      icon: <WifiOff className="h-4 w-4 text-orange-600" />,
      text: 'Modo offline',
      bgColor: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-800'
    };
  };

  const { icon, text, bgColor, textColor } = getIndicatorContent();

  return (
    <Card className={`fixed top-4 left-4 z-40 shadow-lg ${bgColor} ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-sm font-medium ${textColor}`}>
            {text}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};