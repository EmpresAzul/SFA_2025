
import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseInactivityTimerProps {
  timeout: number; // tempo em milissegundos
  onTimeout: () => void;
  warningTime?: number; // tempo em milissegundos antes do timeout para mostrar aviso
}

export const useInactivityTimer = ({ 
  timeout, 
  onTimeout, 
  warningTime = 60000 // 1 minuto de aviso por padrão
}: UseInactivityTimerProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const resetTimer = useCallback(() => {
    // Limpar timers existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Configurar aviso
    if (warningTime && warningTime < timeout) {
      warningRef.current = setTimeout(() => {
        toast({
          title: "Sessão expirando",
          description: "Sua sessão expirará em 1 minuto devido à inatividade. Mova o mouse ou pressione uma tecla para continuar.",
          variant: "destructive",
        });
      }, timeout - warningTime);
    }

    // Configurar logout automático
    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, timeout);
  }, [timeout, onTimeout, warningTime, toast]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Iniciar timer
    resetTimer();

    // Adicionar listeners para atividade do usuário
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetTimer]);

  return { resetTimer };
};
