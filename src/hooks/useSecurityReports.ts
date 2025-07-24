import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SecurityReport {
  type: 'user' | 'system';
  user_id?: string;
  period: string;
  security_score?: number;
  total_alerts: number;
  critical_alerts: number;
  unresolved_alerts: number;
  recent_events: number;
  generated_at: string;
}

export const useSecurityReports = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Generate user security report
  const useUserSecurityReport = (targetUserId?: string) => {
    return useQuery({
      queryKey: ['security-report', targetUserId || user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User not authenticated');

        const { data, error } = await supabase.rpc('generate_security_report', {
          target_user_id: targetUserId || user.id
        });

        if (error) throw error;
        return data as SecurityReport;
      },
      enabled: !!user?.id,
      refetchInterval: 300000, // Refetch every 5 minutes
    });
  };

  // Generate system-wide security report (admin only)
  const useSystemSecurityReport = () => {
    return useQuery({
      queryKey: ['security-report', 'system'],
      queryFn: async () => {
        if (!user?.id) throw new Error('User not authenticated');

        const { data, error } = await supabase.rpc('generate_security_report');

        if (error) throw error;
        return data as SecurityReport;
      },
      enabled: !!user?.id,
      refetchInterval: 300000, // Refetch every 5 minutes
    });
  };

  // Cleanup old security alerts
  const useCleanupSecurityAlerts = () => {
    return useMutation({
      mutationFn: async () => {
        const { error } = await supabase.rpc('cleanup_old_security_alerts');
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
        queryClient.invalidateQueries({ queryKey: ['security-report'] });
        toast.success('Alertas antigos foram automaticamente resolvidos');
      },
      onError: (error) => {
        console.error('Erro ao limpar alertas:', error);
        toast.error('Erro ao limpar alertas antigos');
      },
    });
  };

  // Enhanced security event logging
  const useLogSecurityEvent = () => {
    return useMutation({
      mutationFn: async (params: {
        eventType: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
        description?: string;
        userId?: string;
        metadata?: Record<string, any>;
        autoCreateAlert?: boolean;
      }) => {
        const { data, error } = await supabase.rpc('log_enhanced_security_event', {
          event_type_param: params.eventType,
          severity_param: params.severity || 'low',
          description_param: params.description || '',
          user_id_param: params.userId || user?.id,
          metadata_param: params.metadata || {},
          auto_create_alert: params.autoCreateAlert || false
        });

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['security-events'] });
        queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
        queryClient.invalidateQueries({ queryKey: ['security-report'] });
      },
      onError: (error) => {
        console.error('Erro ao registrar evento de segurança:', error);
      },
    });
  };

  return {
    useUserSecurityReport,
    useSystemSecurityReport,
    useCleanupSecurityAlerts,
    useLogSecurityEvent,
  };
};