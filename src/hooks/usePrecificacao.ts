import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


interface Precificacao {
  id: string;
  user_id: string;
  nome: string;
  tipo: string;
  preco_venda: number;
  [key: string]: any;
}

interface PrecificacaoInsert {
  user_id: string;
  nome: string;
  tipo: string;
  preco_venda?: number;
  [key: string]: any;
}

interface PrecificacaoUpdate {
  [key: string]: any;
}

export const usePrecificacao = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useQueryHook = () => {
    return useQuery({
      queryKey: ["precificacao"],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          return [];
        }

        const { data, error } = await supabase
          .from("precificacao")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Erro ao buscar precificação:", error.message);
          return [];
        }

        return data as Precificacao[];
      },
    });
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: async (data: PrecificacaoInsert) => {
        console.log("🚀 Criando item de precificação:", data);

        // Garantir que o user_id está presente
        if (!data.user_id) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error("Usuário não autenticado");
          }
          data.user_id = user.id;
        }

        // Preparar dados para inserção
        const dadosLimpos = {
          user_id: data.user_id,
          nome: data.nome,
          tipo: data.tipo,
          preco_venda: data.preco_venda || 0,
          custo_materia_prima: data.custo_materia_prima || 0,
          custo_mao_obra: data.custo_mao_obra || 0,
          despesas_fixas: data.despesas_fixas || 0,
          margem_lucro: data.margem_lucro || 0,
          dados_json: data.dados_json || {},
          observacoes: data.observacoes || null,
        };

        console.log("📦 Inserindo:", dadosLimpos);

        const { data: result, error } = await supabase
          .from("precificacao")
          .insert(dadosLimpos)
          .select()
          .single();

        if (error) {
          console.error("❌ Erro ao criar:", error.message);
          throw error;
        }

        console.log("✅ Item criado:", result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["precificacao"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      },
      onError: (error) => {
        console.error("❌ Erro ao criar:", error);
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: PrecificacaoUpdate;
      }) => {
        console.log("✏️ MUTATION UPDATE - Atualizando item:", id, data);
        const { data: result, error } = await supabase
          .from("precificacao")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("❌ Erro ao atualizar precificação:", error);
          throw error;
        }

        console.log("✅ Item atualizado com sucesso:", result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["precificacao"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        // Toast é mostrado no componente específico (useProdutoForm, etc)
      },
      onError: (error) => {
        console.error("❌ Erro na mutação de atualização:", error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar item. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        console.log("🗑️ MUTATION DELETE - Excluindo item:", id);
        const { error } = await supabase
          .from("precificacao")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("❌ Erro ao excluir precificação:", error);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["precificacao"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        toast({
          title: "Sucesso!",
          description: "Item excluído com êxito.",
        });
      },
      onError: (error) => {
        console.error("❌ Erro na mutação de exclusão:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir item. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery: useQueryHook,
    useCreate,
    useUpdate,
    useDelete,
  };
};
