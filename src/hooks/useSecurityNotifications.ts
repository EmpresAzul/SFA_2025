import { useToast } from '@/hooks/use-toast';

export interface SecurityNotification {
  id: string;
  alert_id: string;
  notification_type: string;
  status: 'pending' | 'sent' | 'failed';
  metadata?: any;
  created_at: string;
  sent_at?: string;
}

// Stub implementations for security notifications
export const useNotifications = () => ({
  data: [] as SecurityNotification[],
  loading: false,
  error: null,
});

export const usePendingNotificationsCount = () => ({
  data: 0,
  loading: false,
  error: null,
});

export const useMarkNotificationAsSent = () => {
  const { toast } = useToast();
  
  return {
    mutateAsync: async (id: string) => {
      console.log('Notification marked as sent (stub):', id);
      toast({
        title: "Notificação Enviada",
        description: "A notificação foi marcada como enviada.",
      });
    },
    isPending: false,
  };
};

export const useMarkNotificationAsFailed = () => {
  const { toast } = useToast();
  
  return {
    mutateAsync: async (id: string) => {
      console.log('Notification marked as failed (stub):', id);
      toast({
        title: "Notificação Falhou",
        description: "A notificação foi marcada como falha.",
      });
    },
    isPending: false,
  };
};

export const useSecurityNotifications = () => ({
  useNotifications,
  usePendingNotificationsCount,
  useMarkNotificationAsSent,
  useMarkNotificationAsFailed,
});
