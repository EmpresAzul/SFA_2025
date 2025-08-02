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
      // Pipeline functionality disabled - no negocios table
      setNegocios([]);
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
    throw new Error("Pipeline functionality not available - negocios table doesn't exist");
  };

  const updateNegocio = async (id: string, updates: Partial<Negocio>) => {
    throw new Error("Pipeline functionality not available - negocios table doesn't exist");
  };

  const deleteNegocio = async (id: string) => {
    throw new Error("Pipeline functionality not available - negocios table doesn't exist");
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