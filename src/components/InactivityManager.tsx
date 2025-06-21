
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from '@/hooks/use-toast';

const InactivityManager: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { saveFormData } = useAutoSave();

  // Logout automático por inatividade
  const handleInactivityLogout = async () => {
    toast({
      title: "Sessão expirada",
      description: "Você foi desconectado devido à inatividade. Seus dados foram salvos automaticamente.",
      variant: "destructive",
    });
    
    // Log security event before logout
    try {
      await fetch('/api/log-security-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'logout_inactivity',
          details: {
            logout_time: new Date().toISOString(),
            reason: 'inactivity_timeout'
          }
        })
      });
    } catch (error) {
      // Silent log
    }
    
    await logout();
  };

  // Configurar timer de inatividade apenas se há usuário logado
  useInactivityTimer({
    timeout: 600000, // 10 minutos
    onTimeout: handleInactivityLogout,
    warningTime: 60000, // 1 minuto de aviso
    onSaveData: saveFormData, // Função para salvar dados automaticamente
  });

  // Não renderiza nada - apenas gerencia a inatividade
  return null;
};

export default InactivityManager;
