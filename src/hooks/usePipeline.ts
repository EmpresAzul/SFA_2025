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
      
      // Usar a tabela cadastros existente, filtrando apenas leads (tipo = 'lead')
      let query = supabase
        .from('cadastros')
        .select('*')
        .eq('tipo', 'lead')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Converter dados da tabela cadastros para o formato esperado pelo frontend
      const leadsMapeados: Lead[] = (data || []).map(cadastro => ({
        id: cadastro.id,
        nome_lead: cadastro.nome,
        email: cadastro.email || '',
        whatsapp: cadastro.telefone || '',
        valor_negocio: 0, // Será armazenado nas observações por enquanto
        status: (cadastro.status as any) || 'prospeccao',
        observacoes: cadastro.observacoes || '',
        created_at: cadastro.created_at || new Date().toISOString(),
        updated_at: cadastro.updated_at || new Date().toISOString(),
        user_id: cadastro.user_id
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

      // Converter dados do frontend para o formato da tabela cadastros
      const leadData = {
        nome: negocio.nome_lead,
        email: negocio.email || '',
        telefone: negocio.whatsapp || '',
        tipo: 'lead', // Identificar como lead
        status: negocio.status,
        observacoes: `${negocio.observacoes || ''}\nValor: R$ ${negocio.valor_negocio || 0}`,
        user_id: user.id,
        ativo: true
      };

      const { data, error } = await supabase
        .from('cadastros')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Lead criado com sucesso!",
      });

      await fetchNegocios();
      return data;
    } catch (error) {
      console.error("Erro ao criar negócio:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar lead",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateNegocio = async (id: string, updates: Partial<Lead>) => {
    try {
      // Converter dados do frontend para o formato da tabela cadastros
      const updateData: any = {};
      
      if (updates.nome_lead) updateData.nome = updates.nome_lead;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.whatsapp !== undefined) updateData.telefone = updates.whatsapp;
      if (updates.status) updateData.status = updates.status;
      if (updates.observacoes !== undefined || updates.valor_negocio !== undefined) {
        const obs = updates.observacoes || '';
        const valor = updates.valor_negocio || 0;
        updateData.observacoes = `${obs}\nValor: R$ ${valor}`;
      }

      const { error } = await supabase
        .from('cadastros')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Lead atualizado com sucesso!",
      });

      await fetchNegocios();
    } catch (error) {
      console.error("Erro ao atualizar negócio:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar lead",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteNegocio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cadastros')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Lead excluído com sucesso!",
      });

      await fetchNegocios();
    } catch (error) {
      console.error("Erro ao excluir negócio:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir lead",
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