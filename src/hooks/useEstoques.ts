
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

// Use the actual database schema type
type EstoqueRow = Database['public']['Tables']['estoques']['Row'];
type EstoqueInsert = Database['public']['Tables']['estoques']['Insert'];

export const useEstoques = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [estoques, setEstoques] = useState<EstoqueRow[]>([]);

  // Query para estoques
  const useEstoquesQuery = () => {
    return useQuery({
      queryKey: ["estoques"],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("estoques")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as EstoqueRow[];
      },
      enabled: !!session?.user?.id,
    });
  };

  // Mutation para criar estoque
  const useEstoquesCreate = () => {
    return useMutation({
      mutationFn: async (data: Omit<EstoqueInsert, 'user_id'>) => {
        if (!session?.user?.id) throw new Error("User not authenticated");

        const insertData: EstoqueInsert = {
          ...data,
          user_id: session.user.id
        };

        const { data: result, error } = await supabase
          .from("estoques")
          .insert([insertData])
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["estoques"] });
        toast({
          title: "Sucesso",
          description: "Estoque criado com sucesso!",
        });
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao criar estoque';
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar estoque
  const useEstoquesDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error("User not authenticated");

        const { error } = await supabase
          .from("estoques")
          .delete()
          .eq("id", id)
          .eq("user_id", session.user.id);

        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["estoques"] });
        toast({
          title: "Sucesso",
          description: "Estoque excluído com sucesso!",
        });
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir estoque';
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  const fetchEstoques = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('estoques')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstoques(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar estoques';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    useQuery: useEstoquesQuery,
    useCreate: useEstoquesCreate,
    useDelete: useEstoquesDelete,
    loading,
    estoques,
    fetchEstoques,
  };
};
