import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Negocio, PipelineFilters } from "@/types/pipeline";
import { useToast } from "@/hooks/use-toast";

export const usePipeline = () => {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PipelineFilters>({});
  const { toast } = useToast();

  const fetchNegocios = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("negocios")
        .select("*")
        .order("posicao", { ascending: true })
        .order("created_at", { ascending: false });

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.search) {
        query = query.ilike("nome_lead", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar negócios:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar negócios",
          variant: "destructive",
        });
        return;
      }

      setNegocios((data || []) as Negocio[]);
    } catch (error) {
      console.error("Erro ao buscar negócios:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar negócios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNegocio = async (negocio: Omit<Negocio, "id" | "created_at" | "updated_at" | "user_id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("negocios")
        .insert([{ ...negocio, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setNegocios(prev => [data as Negocio, ...prev]);
      toast({
        title: "Sucesso",
        description: "Negócio criado com sucesso",
      });

      return data;
    } catch (error) {
      console.error("Erro ao criar negócio:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar negócio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateNegocio = async (id: string, updates: Partial<Negocio>) => {
    try {
      const { data, error } = await supabase
        .from("negocios")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setNegocios(prev => prev.map(n => n.id === id ? data as Negocio : n));
      toast({
        title: "Sucesso",
        description: "Negócio atualizado com sucesso",
      });

      return data;
    } catch (error) {
      console.error("Erro ao atualizar negócio:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar negócio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteNegocio = async (id: string) => {
    try {
      const { error } = await supabase
        .from("negocios")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNegocios(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Sucesso",
        description: "Negócio excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir negócio:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir negócio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePosicao = async (id: string, newStatus: string, newPosition: number) => {
    try {
      await updateNegocio(id, { status: newStatus as any, posicao: newPosition });
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