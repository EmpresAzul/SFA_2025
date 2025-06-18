
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SecurityLog {
  id: string;
  user_id: string;
  event_type: 'login_success' | 'login_failed' | 'logout' | 'password_change' | 'data_access' | 'suspicious_activity';
  ip_address?: string;
  user_agent?: string;
  details?: any;
  created_at: string;
}

export interface UserConsent {
  id: string;
  user_id: string;
  consent_type: 'data_processing' | 'marketing' | 'analytics';
  consent_given: boolean;
  consent_date?: string;
  ip_address?: string;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface DataDeletionRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reason?: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
}

export const useSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Log de evento de segurança
  const logSecurityEvent = async (eventType: SecurityLog['event_type'], details?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('security_logs')
        .insert({
          user_id: user.id,
          event_type: eventType,
          details,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao registrar log de segurança:', error);
    }
  };

  // Query para logs de segurança do usuário
  const useSecurityLogs = () => {
    return useQuery({
      queryKey: ['security_logs'],
      queryFn: async () => {
        if (!user?.id) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('security_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        return data as SecurityLog[];
      },
      enabled: !!user?.id,
    });
  };

  // Query para consentimentos do usuário
  const useUserConsents = () => {
    return useQuery({
      queryKey: ['user_consents'],
      queryFn: async () => {
        if (!user?.id) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('user_consents')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        return data as UserConsent[];
      },
      enabled: !!user?.id,
    });
  };

  // Mutation para atualizar consentimento
  const useUpdateConsent = () => {
    return useMutation({
      mutationFn: async ({ consentType, consentGiven }: { consentType: UserConsent['consent_type']; consentGiven: boolean }) => {
        if (!user?.id) throw new Error('User not authenticated');

        const { data, error } = await supabase
          .from('user_consents')
          .upsert({
            user_id: user.id,
            consent_type: consentType,
            consent_given: consentGiven,
            consent_date: consentGiven ? new Date().toISOString() : null,
            version: '1.0'
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user_consents'] });
        toast({
          title: "Consentimento atualizado",
          description: "Suas preferências de privacidade foram salvas.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Erro ao atualizar consentimento: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para solicitar exclusão de dados
  const useRequestDataDeletion = () => {
    return useMutation({
      mutationFn: async (reason?: string) => {
        if (!user?.id) throw new Error('User not authenticated');

        const { data, error } = await supabase
          .from('data_deletion_requests')
          .insert({
            user_id: user.id,
            reason,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['data_deletion_requests'] });
        toast({
          title: "Solicitação enviada",
          description: "Sua solicitação de exclusão de dados foi registrada e será processada em até 30 dias.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Erro ao solicitar exclusão: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    logSecurityEvent,
    useSecurityLogs,
    useUserConsents,
    useUpdateConsent,
    useRequestDataDeletion,
  };
};
