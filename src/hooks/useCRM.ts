import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  CRMLead, 
  CRMInteraction, 
  CreateLeadData, 
  UpdateLeadData, 
  CreateInteractionData 
} from '@/types/crm';

export const useCRMLeads = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['crm-leads', user?.id],
    queryFn: async (): Promise<CRMLead[]> => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar leads:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCRMInteractions = (leadId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['crm-interactions', user?.id, leadId],
    queryFn: async (): Promise<CRMInteraction[]> => {
      if (!user) throw new Error('Usuário não autenticado');
      
      let query = supabase
        .from('crm_interactions')
        .select('*')
        .eq('user_id', user.id);

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar interações:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCreateLead = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadData: CreateLeadData): Promise<CRMLead> => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('crm_leads')
        .insert({
          ...leadData,
          user_id: user.id,
          source: leadData.source || 'Website',
          value: leadData.value || 0,
          probability: leadData.probability || 25,
          next_follow_up: leadData.next_follow_up || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar lead:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
    },
  });
};

export const useUpdateLead = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & UpdateLeadData): Promise<CRMLead> => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar lead:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
    },
  });
};

export const useDeleteLead = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadId: string): Promise<void> => {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('crm_leads')
        .delete()
        .eq('id', leadId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar lead:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-interactions'] });
    },
  });
};

export const useCreateInteraction = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interactionData: CreateInteractionData): Promise<CRMInteraction> => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('crm_interactions')
        .insert({
          ...interactionData,
          user_id: user.id,
          interaction_date: interactionData.interaction_date || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar interação:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-interactions'] });
    },
  });
};

export const useDeleteInteraction = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interactionId: string): Promise<void> => {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('crm_interactions')
        .delete()
        .eq('id', interactionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar interação:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-interactions'] });
    },
  });
}; 