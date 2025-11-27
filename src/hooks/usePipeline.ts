import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lead, PipelineFilters } from "@/types/pipeline";
import { useToast } from "@/hooks/use-toast";

export const usePipeline = () => {
  const [negocios, setNegocios] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PipelineFilters>({});
  const { toast } = useToast();

  const fetchNegocios = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNegocios([]);
        setLoading(false);
        return;
      }

      // Usar a tabela crm_leads
      let query = (supabase as any)
        .from('crm_leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar leads:", error);
        throw error;
      }

      // Converter dados da tabela crm_leads para o formato esperado pelo frontend
      const leadsMapeados: Lead[] = (data || []).map(lead => ({
        id: lead.id,
        nome_lead: lead.name,
        email: lead.email,
        whatsapp: lead.phone || '',
        valor_negocio: parseFloat(String(lead.value)) || 0,
        status: lead.status as any,
        observacoes: lead.notes || '',
        created_at: lead.created_at,
        updated_at: lead.updated_at,
        user_id: lead.user_id
      }));

      setNegocios(leadsMapeados);
    } catch (error) {
      console.error("Erro ao buscar negócios:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar leads",
        variant: "destructive",
      });
      setNegocios([]);
    } finally {
      setLoading(false);
    }
  };

  const createNegocio = async (negocio: Omit<Lead, "id" | "created_at" | "updated_at" | "user_id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Converter dados do frontend para o formato da tabela crm_leads
      const leadData = {
        name: negocio.nome_lead,
        company: negocio.nome_lead, // Usar o nome como empresa por padrão
        email: negocio.email || '',
        phone: negocio.whatsapp || null,
        source: 'Manual',
        status: negocio.status,
        value: negocio.valor_negocio || 0,
        probability: 25,
        notes: negocio.observacoes || null,
        user_id: user.id
      };

      console.log("📝 Criando lead:", leadData);

      const { data, error } = await (supabase as any)
        .from('crm_leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao criar lead:", error);
        throw error;
      }

      console.log("✅ Lead criado:", data);

      toast({
        title: "✅ Lead Criado!",
        description: "Lead adicionado ao pipeline com sucesso.",
        duration: 4000,
      });

      await fetchNegocios();
      return data;
    } catch (error) {
      console.error("Erro ao criar negócio:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar lead",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateNegocio = async (id: string, updates: Partial<Lead>) => {
    try {
      // Converter dados do frontend para o formato da tabela crm_leads
      const updateData: any = {};
      
      if (updates.nome_lead) {
        updateData.name = updates.nome_lead;
        updateData.company = updates.nome_lead;
      }
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.whatsapp !== undefined) updateData.phone = updates.whatsapp || null;
      if (updates.status) updateData.status = updates.status;
      if (updates.valor_negocio !== undefined) updateData.value = updates.valor_negocio;
      if (updates.observacoes !== undefined) updateData.notes = updates.observacoes || null;

      console.log("📝 Atualizando lead:", id, updateData);

      const { error } = await (supabase as any)
        .from('crm_leads')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error("❌ Erro ao atualizar lead:", error);
        throw error;
      }

      console.log("✅ Lead atualizado");

      toast({
        title: "✅ Lead Atualizado!",
        description: "Lead atualizado com sucesso.",
        duration: 3000,
      });

      await fetchNegocios();
    } catch (error) {
      console.error("Erro ao atualizar negócio:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar lead",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteNegocio = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('crm_leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("❌ Erro ao excluir lead:", error);
        throw error;
      }

      toast({
        title: "✅ Lead Excluído!",
        description: "Lead removido do pipeline.",
        duration: 3000,
      });

      await fetchNegocios();
    } catch (error) {
      console.error("Erro ao excluir negócio:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir lead",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePosicao = async (id: string, newStatus: string, newPosition: number) => {
    try {
      await updateNegocio(id, { status: newStatus as any });
    } catch (error) {
      console.error("Erro ao atualizar posição:", error);
    }
  };

  useEffect(() => {
    fetchNegocios();
  }, [filters]);

  return {
    negocios,
    loading,
    filters,
    setFilters,
    createNegocio,
    updateNegocio,
    deleteNegocio,
    updatePosicao,
    refetch: fetchNegocios,
  };
};