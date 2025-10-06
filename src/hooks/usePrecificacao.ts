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
        console.log("🔍 Buscando dados de precificação...");

        // Obter o usuário atual
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.log("❌ Usuário não autenticado na query");
          return [];
        }

        console.log("👤 Usuário autenticado na query:", user.id);

        const { data, error } = await supabase
          .from("precificacao")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Erro ao buscar precificação:", error);
          console.error("❌ Detalhes do erro:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          throw error;
        }

        console.log("✅ Dados de precificação carregados:", data?.length || 0, "itens");
        if (data && data.length > 0) {
          console.log("📋 Primeiros itens:", data.slice(0, 3));
        }
        return data as Precificacao[];
      },
    });
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: async (data: PrecificacaoInsert) => {
        console.log("🚀 MUTATION CREATE - Iniciando criação de item:", data);

        // Garantir que o user_id está presente
        if (!data.user_id) {
          console.log("⚠️ user_id não fornecido, buscando...");
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            console.log("❌ Usuário não autenticado na mutation create");
            throw new Error("Usuário não autenticado");
          }
          data.user_id = user.id;
          console.log("✅ user_id definido:", user.id);
        }

        // Garantir que preco_venda seja definido
        if (!data.preco_venda && data.preco_final) {
          data.preco_venda = data.preco_final;
        } else if (!data.preco_venda) {
          data.preco_venda = 0;
        }

        // Garantir que campos obrigatórios estejam presentes
        const dadosLimpos = {
          user_id: data.user_id,
          nome: data.nome,
          tipo: data.tipo,
          preco_venda: data.preco_venda,
          custo_materia_prima: data.custo_materia_prima || 0,
          custo_mao_obra: data.custo_mao_obra || 0,
          despesas_fixas: data.despesas_fixas || 0,
          margem_lucro: data.margem_lucro || 0,
          dados_json: data.dados_json || {},
          observacoes: data.observacoes || null,
        };

        // Adicionar categoria aos dados_json se fornecida
        if (data.categoria) {
          dadosLimpos.dados_json = {
            ...dadosLimpos.dados_json,
            categoria: data.categoria,
          };
        }

        console.log("📦 Dados limpos para inserir:", dadosLimpos);

        const { data: result, error } = await supabase
          .from("precificacao")
          .insert(dadosLimpos)
          .select()
          .single();

        if (error) {
          console.error("❌ Erro no Supabase ao criar precificação:", error);
          console.error("❌ Detalhes do erro:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          throw error;
        }

        console.log("✅ Item de precificação criado com sucesso:", result);
        return result;
      },
      onSuccess: (data) => {
        console.log("🎉 Mutation CREATE bem-sucedida, invalidando queries...");
        queryClient.invalidateQueries({ queryKey: ["precificacao"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        console.log("✅ Queries invalidadas após criação");
        
        // Não mostrar toast aqui pois já é mostrado nos componentes específicos
      },
      onError: (error) => {
        console.error("💥 Erro na mutation de criação:", error);
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
        toast({
          title: "Sucesso!",
          description: "Item atualizado com êxito.",
        });
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
