import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";

export const useNotificationSimulator = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Simular notificações periódicas para demonstração
    const interval = setInterval(() => {
      const notifications = [
        {
          type: 'ticket_response' as const,
          title: 'Chamado Respondido',
          message: 'Seu chamado sobre "Problema no fluxo de caixa" foi respondido pela equipe de suporte.',
          ticketId: Math.random().toString(36).substr(2, 9),
          actionUrl: '/suporte'
        },
        {
          type: 'system_message' as const,
          title: 'Atualização do Sistema',
          message: 'Nova funcionalidade de relatórios avançados foi adicionada ao FluxoAzul.'
        },
        {
          type: 'info' as const,
          title: 'Backup Automático',
          message: 'Backup dos seus dados foi realizado com sucesso às ' + new Date().toLocaleTimeString()
        },
        {
          type: 'success' as const,
          title: 'Sincronização Concluída',
          message: 'Todos os seus dados foram sincronizados com sucesso.'
        },
        {
          type: 'warning' as const,
          title: 'Estoque Baixo',
          message: 'Alguns produtos estão com estoque abaixo do mínimo configurado.'
        }
      ];

      // Adicionar uma notificação aleatória a cada 30 segundos (apenas para demonstração)
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      // Só adicionar se for horário comercial (para não spam)
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 9 && hour <= 18) {
        addNotification(randomNotification);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [addNotification]);
};

// Hook para adicionar notificação manual (para testes)
export const useAddTestNotification = () => {
  const { addNotification } = useNotifications();

  const addTicketResponseNotification = () => {
    addNotification({
      type: 'ticket_response',
      title: 'Chamado Respondido',
      message: 'Seu chamado #' + Math.random().toString(36).substr(2, 6).toUpperCase() + ' foi respondido pela equipe de suporte.',
      ticketId: Math.random().toString(36).substr(2, 9),
      actionUrl: '/suporte'
    });
  };

  const addSystemNotification = () => {
    addNotification({
      type: 'system_message',
      title: 'Mensagem do Sistema',
      message: 'Esta é uma mensagem de teste do sistema FluxoAzul.'
    });
  };

  return {
    addTicketResponseNotification,
    addSystemNotification
  };
};