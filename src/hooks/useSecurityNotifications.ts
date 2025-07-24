import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SecurityNotification {
  id: string;
  alert_id: string | null;
  notification_type: string;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
  sent_at: string | null;
}

export const useSecurityNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all security notifications (admin only)
  const useNotifications = () => {
    return useQuery({
      queryKey: ['security-notifications'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('security_notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as SecurityNotification[];
      },
      enabled: !!user,
      refetchInterval: 30000, // Refetch every 30 seconds
    });
  };

  // Get pending notifications count
  const usePendingNotificationsCount = () => {
    return useQuery({
      queryKey: ['security-notifications-pending-count'],
      queryFn: async () => {
        const { count, error } = await supabase
          .from('security_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (error) throw error;
        return count || 0;
      },
      enabled: !!user,
      refetchInterval: 15000, // Check more frequently for pending items
    });
  };

  // Mark notification as sent
  const useMarkNotificationAsSent = () => {
    return useMutation({
      mutationFn: async (notificationId: string) => {
        const { data, error } = await supabase
          .from('security_notifications')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString() 
          })
          .eq('id', notificationId)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['security-notifications'] });
        queryClient.invalidateQueries({ queryKey: ['security-notifications-pending-count'] });
        toast.success('Notificação marcada como enviada');
      },
      onError: (error) => {
        console.error('Erro ao marcar notificação:', error);
        toast.error('Erro ao marcar notificação como enviada');
      },
    });
  };

  // Mark notification as failed
  const useMarkNotificationAsFailed = () => {
    return useMutation({
      mutationFn: async (notificationId: string) => {
        const { data, error } = await supabase
          .from('security_notifications')
          .update({ status: 'failed' })
          .eq('id', notificationId)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['security-notifications'] });
        queryClient.invalidateQueries({ queryKey: ['security-notifications-pending-count'] });
        toast.success('Notificação marcada como falhada');
      },
      onError: (error) => {
        console.error('Erro ao marcar notificação:', error);
        toast.error('Erro ao marcar notificação como falhada');
      },
    });
  };

  return {
    useNotifications,
    usePendingNotificationsCount,
    useMarkNotificationAsSent,
    useMarkNotificationAsFailed,
  };
};