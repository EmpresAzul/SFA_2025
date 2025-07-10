import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import { useToast } from "@/hooks/use-toast";

const InactivityManager: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // Logout automático por inatividade
  const handleInactivityLogout = async () => {
    toast({
      title: "Sessão expirada",
      description:
        "Você foi desconectado devido à inatividade.",
      variant: "destructive",
    });
    
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Configurar timer de inatividade apenas se há usuário logado
  useInactivityTimer({
    timeout: 600000, // 10 minutos
    onTimeout: handleInactivityLogout,
    warningTime: 60000, // 1 minuto de aviso
  });

  // Não renderiza nada - apenas gerencia a inatividade
  return null;
};

export default InactivityManager;