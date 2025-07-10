
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { CRMLead, CRMInteraction, CreateLeadData, UpdateLeadData, CreateInteractionData } from "@/types/crm";

// Hook para buscar leads
export const useCRMLeads = () => {
  return useQuery({
    queryKey: ["crm-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CRMLead[];
    },
  });
};

// Hook para buscar interações de um lead
export const useCRMInteractions = (leadId?: string) => {
  return useQuery({
    queryKey: ["crm-interactions", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      
      const { data, error } = await supabase
        .from("crm_interactions")
        .select("*")
        .eq("lead_id", leadId)
        .order("interaction_date", { ascending: false });

      if (error) throw error;
      return data as CRMInteraction[];
    },
    enabled: !!leadId,
  });
};

// Hook para criar lead
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (leadData: CreateLeadData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("crm_leads")
        .insert([{ ...leadData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      toast({
        title: "Lead criado",
        description: "Lead criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar lead: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar lead
export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & UpdateLeadData) => {
      const { data, error } = await supabase
        .from("crm_leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      toast({
        title: "Lead atualizado",
        description: "Lead atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar lead: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar lead
export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase
        .from("crm_leads")
        .delete()
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      toast({
        title: "Lead excluído",
        description: "Lead excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir lead: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para criar interação
export const useCreateInteraction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (interactionData: CreateInteractionData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("crm_interactions")
        .insert([{ ...interactionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crm-interactions", variables.lead_id] });
      toast({
        title: "Interação criada",
        description: "Interação registrada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar interação: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar interação
export const useDeleteInteraction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (interactionId: string) => {
      const { error } = await supabase
        .from("crm_interactions")
        .delete()
        .eq("id", interactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-interactions"] });
      toast({
        title: "Interação excluída",
        description: "Interação excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir interação: " + error.message,
        variant: "destructive",
      });
    },
  });
};
