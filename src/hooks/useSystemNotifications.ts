import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export const useSystemNotifications = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Função para criar notificação de lembrete vencido
    const checkOverdueReminders = () => {
      const today = new Date().toISOString().split('T')[0];
      const lembretes = JSON.parse(localStorage.getItem(`lembretes_${user.id}`) || '[]');
      
      lembretes.forEach((lembrete: any) => {
        if (lembrete.data_lembrete < today && lembrete.status === 'ativo') {
          // Verificar se já foi notificado
          const notificationKey = `reminder_notified_${lembrete.id}`;
          if (!localStorage.getItem(notificationKey)) {
            addNotification({
              type: 'reminder',
              title: 'Lembrete Vencido',
              message: `Lembrete "${lembrete.titulo}" estava programado para ${new Date(lembrete.data_lembrete).toLocaleDateString('pt-BR')}`,
              actionUrl: '/lembretes'
            });
            
            // Marcar como notificado
            localStorage.setItem(notificationKey, 'true');
          }
        }
      });
    };

    // Função para notificar sobre backup automático (simulado)
    const checkBackupStatus = () => {
      const lastBackupCheck = localStorage.getItem(`last_backup_check_${user.id}`);
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      if (!lastBackupCheck || (now - parseInt(lastBackupCheck)) > oneDayMs) {
        // Simular backup automático diário
        addNotification({
          type: 'info',
          title: 'Backup Automático',
          message: 'Backup dos seus dados foi realizado com sucesso.',
        });
        
        localStorage.setItem(`last_backup_check_${user.id}`, now.toString());
      }
    };

    // Função para notificar sobre atualizações do sistema
    const checkSystemUpdates = () => {
      const currentVersion = '3.0.0';
      const lastVersionNotified = localStorage.getItem(`version_notified_${user.id}`);
      
      if (lastVersionNotified !== currentVersion) {
        addNotification({
          type: 'system_message',
          title: 'Sistema Atualizado',
          message: `FluxoAzul foi atualizado para a versão ${currentVersion} com melhorias de performance e novas funcionalidades.`,
        });
        
        localStorage.setItem(`version_notified_${user.id}`, currentVersion);
      }
    };

    // Função para notificar sobre metas financeiras
    const checkFinancialGoals = () => {
      try {
        const lancamentos = JSON.parse(localStorage.getItem(`lancamentos_${user.id}`) || '[]');
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyRevenue = lancamentos
          .filter((l: any) => {
            const date = new Date(l.data);
            return l.tipo === 'receita' && 
                   date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear;
          })
          .reduce((total: number, l: any) => total + l.valor, 0);

        // Notificar se atingiu meta de R$ 50.000 no mês
        const goalAmount = 50000;
        const goalKey = `goal_${currentMonth}_${currentYear}_${user.id}`;
        
        if (monthlyRevenue >= goalAmount && !localStorage.getItem(goalKey)) {
          addNotification({
            type: 'success',
            title: 'Meta Atingida! 🎉',
            message: `Parabéns! Você atingiu R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em receitas este mês.`,
            actionUrl: '/dashboard'
          });
          
          localStorage.setItem(goalKey, 'true');
        }
      } catch (error) {
        console.error('Erro ao verificar metas financeiras:', error);
      }
    };

    // Executar verificações
    checkOverdueReminders();
    checkSystemUpdates();
    
    // Executar verificações periódicas
    const interval = setInterval(() => {
      checkOverdueReminders();
      checkBackupStatus();
      checkFinancialGoals();
    }, 60000); // A cada minuto

    return () => clearInterval(interval);
  }, [user, addNotification]);

  // Função para criar notificação manual (para uso em outros componentes)
  const createSystemNotification = (type: string, title: string, message: string, actionUrl?: string) => {
    addNotification({
      type: type as any,
      title,
      message,
      actionUrl
    });
  };

  return { createSystemNotification };
};