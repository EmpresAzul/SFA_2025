import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const UpdateNotification: React.FC = () => {
  // Componente desabilitado conforme solicitação do usuário
  return null;

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Atualização Disponível</h3>
                <p className="text-xs text-white/90">
                  Nova versão do FluxoAzul
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              className="flex-1 bg-white text-green-600 hover:bg-white/90 text-sm py-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Agora
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              className="text-white hover:bg-white/20 text-sm py-2"
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateNotification;