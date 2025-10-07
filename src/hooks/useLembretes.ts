import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Lembrete {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string | null;
  data_vencimento: string;
  prioridade: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LembreteFormData {
  titulo: string;
  descricao?: string;
  data_vencimento: string;
  prioridade?: string;
}

export const useLembretes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: lembretes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lembretes", user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("useLembretes: Usuário não autenticado");
        return [];
      }

      console.log(
        "useLembretes: Iniciando busca de lembretes para usuário:",
        user.id,
      );

      const { data, error } = await supabase
        .from("lembretes")
        .select("*")
        .eq("user_id", user.id)
        .order("data_vencimento", { ascending: true });

      if (error) {
        console.error("useLembretes: Erro ao buscar lembretes:", error);
        throw error;
      }

      console.log("useLembretes: Query executada com sucesso");
      console.log("useLembretes: Dados retornados:", data);
      console.log(
        "useLembretes: Total de lembretes encontrados:",
        data?.length || 0,
      );

      // Log detalhado de cada lembrete
      if (data && data.length > 0) {
        data.forEach((lembrete, index) => {
          console.log(`useLembretes: Lembrete ${index + 1}:`, {
            id: lembrete.id,
            titulo: lembrete.titulo,
            status: lembrete.status,
            data_vencimento: lembrete.data_vencimento,
            user_id: lembrete.user_id,
          });
        });
      } else {
        console.log("useLembretes: Nenhum lembrete encontrado");
      }

      return data as Lembrete[];
    },
    enabled: !!user,
  });

  const createLembrete = useMutation({
    mutationFn: async (data: LembreteFormData) => {
      if (!user) throw new Error("Usuário não autenticado");

      console.log("useLembretes: Criando lembrete:", data);

      const { error } = await supabase.from("lembretes").insert({
        ...data,
        user_id: user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lembretes"] });
      toast({
        title: "Lembrete criado!",
        description: "O lembrete foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao criar lembrete:", error);
      toast({
        title: "Erro ao criar lembrete",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const updateLembrete = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Lembrete> & { id: string }) => {
      console.log("useLembretes: Atualizando lembrete:", id, data);

      const { error } = await supabase
        .from("lembretes")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lembretes"] });
      toast({
        title: "Lembrete atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar lembrete:", error);
      toast({
        title: "Erro ao atualizar lembrete",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const deleteLembrete = useMutation({
    mutationFn: async (id: string) => {
      console.log("useLembretes: Deletando lembrete:", id);

      const { error } = await supabase.from("lembretes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lembretes"] });
      toast({
        title: "Lembrete excluído!",
        description: "O lembrete foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao excluir lembrete:", error);
      toast({
        title: "Erro ao excluir lembrete",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  console.log("useLembretes: Estado final do hook:", {
    loading: isLoading,
    totalLembretes: lembretes.length,
    userId: user?.id,
    hasError: !!error,
  });

  return {
    lembretes,
    isLoading,
    error,
    refetch,
    createLembrete,
    updateLembrete,
    deleteLembrete,
  };
};
