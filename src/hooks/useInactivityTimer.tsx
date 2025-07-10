import { useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface UseInactivityTimerProps {
  timeout: number; // tempo em milissegundos
  onTimeout: () => void;
  warningTime?: number; // tempo em milissegundos antes do timeout para mostrar aviso
  onSaveData?: () => Promise<void>; // função para salvar dados antes do logout
}

export const useInactivityTimer = ({
  timeout,
  onTimeout,
  warningTime = 60000, // 1 minuto de aviso por padrão
  onSaveData,
}: UseInactivityTimerProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const saveRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const resetTimer = useCallback(() => {
    // Limpar timers existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }
    if (saveRef.current) {
      clearTimeout(saveRef.current);
    }

    // Configurar aviso
    if (warningTime && warningTime < timeout) {
      warningRef.current = setTimeout(() => {
        const remainingTime = Math.floor(warningTime / 1000);

        const { dismiss } = toast({
          title: "Sessão expirando",
          description: `Sua sessão expirará em ${remainingTime} segundos devido à inatividade.`,
          variant: "destructive",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetTimer();
                dismiss();
                toast({
                  title: "Sessão mantida",
                  description: "Sua sessão foi renovada com sucesso.",
                });
              }}
            >
              Manter ativa
            </Button>
          ),
        });

        // Timer para salvar dados 30 segundos antes do logout
        saveRef.current = setTimeout(async () => {
          if (onSaveData) {
            try {
              await onSaveData();
              toast({
                title: "Dados salvos",
                description: "Seus dados foram salvos automaticamente.",
              });
            } catch (error) {
              console.error("Erro ao salvar dados:", error);
            }
          }
        }, warningTime - 30000); // 30 segundos antes do logout
      }, timeout - warningTime);
    }

    // Configurar logout automático
    timeoutRef.current = setTimeout(async () => {
      // Salvar dados antes do logout se ainda não foi feito
      if (onSaveData) {
        try {
          await onSaveData();
        } catch (error) {
          console.error("Erro ao salvar dados antes do logout:", error);
        }
      }
      onTimeout();
    }, timeout);
  }, [timeout, onTimeout, warningTime, toast, onSaveData]);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Iniciar timer
    resetTimer();

    // Adicionar listeners para atividade do usuário
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
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
      if (saveRef.current) {
        clearTimeout(saveRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetTimer]);

  return { resetTimer };
};
