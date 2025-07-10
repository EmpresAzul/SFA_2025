import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { LancamentoUpdateData } from "@/types/lancamentos";

export const useLancamentoUpdateMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: LancamentoUpdateData) => {
      console.log(
        "useLancamentoUpdateMutation: Iniciando atualização do lançamento ID:",
        id,
      );
      console.log(
        "useLancamentoUpdateMutation: Dados recebidos para atualização:",
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
        "useLancamentoUpdateMutation: Dados limpos para atualização:",
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
          "useLancamentoUpdateMutation: Erro ao atualizar lançamento:",
          error,
        );
        console.error("useLancamentoUpdateMutation: Detalhes do erro:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      console.log(
        "useLancamentoUpdateMutation: Lançamento atualizado com sucesso:",
        data,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
      console.log(
        "useLancamentoUpdateMutation: Query invalidada após atualização, dados:",
        data,
      );
      toast({
        title: "Sucesso",
        description: "Lançamento atualizado com sucesso!",
      });
    },
    onError: (error: unknown) => {
      console.error(
        "useLancamentoUpdateMutation: Erro na mutation de atualização:",
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