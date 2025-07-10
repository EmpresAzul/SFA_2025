import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { criarLancamentosRecorrentes } from "./lancamentosUtils";
import type {
  LancamentoCreateData,
  LancamentoUpdateData,
} from "@/types/lancamentos";

export const useLancamentosMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useCreate = () => {
    return useMutation({
      mutationFn: async (lancamentoData: LancamentoCreateData) => {
        console.log(
          "useLancamentosMutations: Criando lançamento:",
          lancamentoData,
        );

        // Validar dados obrigatórios
        if (
          !lancamentoData.data ||
          !lancamentoData.tipo ||
          !lancamentoData.categoria ||
          !lancamentoData.valor
        ) {
          throw new Error("Data, tipo, categoria e valor são obrigatórios");
        }

        if (!lancamentoData.user_id) {
          throw new Error("User ID é obrigatório");
        }

        // Se for recorrente, usar função especial
        if (
          lancamentoData.recorrente &&
          lancamentoData.meses_recorrencia &&
          lancamentoData.meses_recorrencia > 0
        ) {
          return await criarLancamentosRecorrentes(
            lancamentoData,
            lancamentoData.meses_recorrencia,
          );
        }

        // Lançamento simples - usar apenas campos aceitos pela tabela
        const { data, error } = await supabase
          .from("lancamentos")
          .insert({
            data: lancamentoData.data,
            tipo: lancamentoData.tipo,
            categoria: lancamentoData.categoria,
            valor: lancamentoData.valor,
            cliente_id: lancamentoData.cliente_id || null,
            fornecedor_id: lancamentoData.fornecedor_id || null,
            observacoes: lancamentoData.observacoes || null,
            user_id: lancamentoData.user_id,
            status: lancamentoData.status || 'ativo',
            recorrente: false,
            meses_recorrencia: null,
            lancamento_pai_id: null,
          })
          .select()
          .single();

        if (error) {
          console.error(
            "useLancamentosMutations: Erro ao criar lançamento:",
            error,
          );
          throw error;
        }

        console.log(
          "useLancamentosMutations: Lançamento criado com sucesso:",
          data,
        );
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
        console.log("useLancamentosMutations: Query invalidada após criação");
      },
      onError: (error: unknown) => {
        console.error(
          "useLancamentosMutations: Erro na mutation de criação:",
          error,
        );
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, ...updateData }: LancamentoUpdateData) => {
        console.log(
          "useLancamentosMutations: Iniciando atualização do lançamento ID:",
          id,
        );
        console.log(
          "useLancamentosMutations: Dados recebidos para atualização:",
          updateData,
        );

        if (!id) {
          throw new Error("ID do lançamento é obrigatório para atualização");
        }

        // Remove campos que não devem ser atualizados diretamente
        const {
          created_at,
          updated_at,
          user_id,
          status,
          lancamento_pai_id,
          ...dataToUpdate
        } = updateData;

        console.log(
          "useLancamentosMutations: Dados limpos para atualização:",
          dataToUpdate,
        );

        const { data, error } = await supabase
          .from("lancamentos")
          .update(dataToUpdate)
          .eq("id", id)
          .select(
            `
            *,
            cliente:cadastros!cliente_id(nome),
            fornecedor:cadastros!fornecedor_id(nome)
          `,
          )
          .single();

        if (error) {
          console.error(
            "useLancamentosMutations: Erro ao atualizar lançamento:",
            error,
          );
          console.error("useLancamentosMutations: Detalhes do erro:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          throw error;
        }

        console.log(
          "useLancamentosMutations: Lançamento atualizado com sucesso:",
          data,
        );
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
        console.log(
          "useLancamentosMutations: Query invalidada após atualização, dados:",
          data,
        );
        toast({
          title: "Sucesso",
          description: "Lançamento atualizado com sucesso!",
        });
      },
      onError: (error: unknown) => {
        console.error(
          "useLancamentosMutations: Erro na mutation de atualização:",
          error,
        );
        const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar lançamento. Tente novamente.";
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        console.log("useLancamentosMutations: Excluindo lançamento:", id);

        const { error } = await supabase
          .from("lancamentos")
          .delete()
          .eq("id", id);

        if (error) {
          console.error(
            "useLancamentosMutations: Erro ao excluir lançamento:",
            error,
          );
          throw error;
        }

        console.log("useLancamentosMutations: Lançamento excluído com sucesso");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
        toast({
          title: "Sucesso",
          description: "Lançamento excluído com sucesso!",
        });
      },
      onError: (error: unknown) => {
        console.error(
          "useLancamentosMutations: Erro ao excluir lançamento:",
          error,
        );
        const errorMessage = error instanceof Error ? error.message : "Erro ao excluir lançamento. Tente novamente.";
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useCreate: () => ({
      mutateAsync: useCreate().mutateAsync,
      isPending: useCreate().isPending,
    }),
    useUpdate: () => ({
      mutateAsync: useUpdate().mutateAsync,
      isPending: useUpdate().isPending,
    }),
    useDelete: () => ({
      mutateAsync: useDelete().mutateAsync,
      isPending: useDelete().isPending,
    }),
  };
};
