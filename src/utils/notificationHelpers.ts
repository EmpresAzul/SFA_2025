import { Notification } from '@/types/notifications';

export const createNotificationFromEvent = (
  eventType: string,
  data: any,
  userId: string
): Notification | null => {
  const now = new Date().toISOString();
  const id = `${eventType}_${Date.now()}`;

  switch (eventType) {
    case 'large_transaction':
      if (data.valor >= 10000) {
        return {
          id,
          type: 'warning',
          title: 'Transação de Alto Valor',
          message: `${data.tipo === 'receita' ? 'Receita' : 'Despesa'} de R$ ${data.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi registrada.`,
          isRead: false,
          createdAt: now,
          actionUrl: '/lancamentos'
        };
      }
      break;

    case 'low_balance':
      if (data.saldo < 1000) {
        return {
          id,
          type: 'warning',
          title: 'Saldo Baixo',
          message: `Saldo da conta ${data.banco} está baixo: R$ ${data.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          isRead: false,
          createdAt: now,
          actionUrl: '/saldos-bancarios'
        };
      }
      break;

    case 'stock_low':
      if (data.quantidade <= 5) {
        return {
          id,
          type: 'warning',
          title: 'Estoque Baixo',
          message: `Produto "${data.nome_produto}" com apenas ${data.quantidade} unidades em estoque.`,
          isRead: false,
          createdAt: now,
          actionUrl: '/estoque'
        };
      }
      break;

    case 'reminder_due':
      return {
        id,
        type: 'reminder',
        title: 'Lembrete',
        message: `${data.titulo}: ${data.descricao || 'Sem descrição'}`,
        isRead: false,
        createdAt: now,
        actionUrl: '/lembretes'
      };

    case 'monthly_goal_reached':
      return {
        id,
        type: 'success',
        title: 'Meta Mensal Atingida! 🎉',
        message: `Parabéns! Você atingiu R$ ${data.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em receitas este mês.`,
        isRead: false,
        createdAt: now,
        actionUrl: '/dashboard'
      };

    case 'backup_completed':
      return {
        id,
        type: 'info',
        title: 'Backup Realizado',
        message: 'Backup automático dos seus dados foi realizado com sucesso.',
        isRead: false,
        createdAt: now
      };

    case 'system_update':
      return {
        id,
        type: 'system_message',
        title: 'Sistema Atualizado',
        message: `FluxoAzul foi atualizado para a versão ${data.version} com melhorias de performance.`,
        isRead: false,
        createdAt: now
      };

    default:
      return null;
  }

  return null;
};

export const shouldNotify = (eventType: string, data: any, userId: string): boolean => {
  const notificationKey = `notification_${eventType}_${userId}`;
  const lastNotified = localStorage.getItem(notificationKey);
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // Para alguns tipos, evitar spam de notificações
  switch (eventType) {
    case 'low_balance':
    case 'stock_low':
      // Notificar apenas uma vez por hora para o mesmo item
      const itemKey = `${notificationKey}_${data.id || data.banco || data.nome_produto}`;
      const lastItemNotified = localStorage.getItem(itemKey);
      
      if (lastItemNotified && (now - parseInt(lastItemNotified)) < oneHour) {
        return false;
      }
      
      localStorage.setItem(itemKey, now.toString());
      return true;

    case 'monthly_goal_reached':
      // Notificar apenas uma vez por mês
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      const monthKey = `${notificationKey}_${month}_${year}`;
      
      if (localStorage.getItem(monthKey)) {
        return false;
      }
      
      localStorage.setItem(monthKey, 'true');
      return true;

    case 'backup_completed':
      // Notificar apenas uma vez por dia
      const today = new Date().toDateString();
      const dayKey = `${notificationKey}_${today}`;
      
      if (localStorage.getItem(dayKey)) {
        return false;
      }
      
      localStorage.setItem(dayKey, 'true');
      return true;

    default:
      return true;
  }
};