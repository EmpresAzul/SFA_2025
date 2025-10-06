
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { createNotificationFromEvent, shouldNotify } from "@/utils/notificationHelpers";
import { criarLancamentosRecorrentes } from "./lancamentosUtils";
import { useSecurity } from "@/hooks/useSecurity";
import type {
  LancamentoCreateData,
  LancamentoUpdateData,
} from "@/types/lancamentos";

export const useLancamentosMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { logDataModification } = useSecurity();

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

        // Lançamento simples - preparar dados corretamente
        const insertData = {
          data: lancamentoData.data,
          tipo: lancamentoData.tipo,
          categoria: lancamentoData.categoria,
          valor: lancamentoData.valor,
          descricao: lancamentoData.descricao || lancamentoData.observacoes || `${lancamentoData.tipo} - ${lancamentoData.categoria}`,
          cliente_id: lancamentoData.cliente_id || null,
          fornecedor_id: lancamentoData.fornecedor_id || null,
          observacoes: lancamentoData.observacoes || null,
          user_id: lancamentoData.user_id,
          status: lancamentoData.status || 'ativo',
          recorrente: lancamentoData.recorrente || false,
          meses_recorrencia: lancamentoData.meses_recorrencia || null,
        };

        console.log("📦 Dados preparados para inserção:", insertData);

        const { data, error } = await supabase
          .from("lancamentos")
          .insert([insertData])
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

        // Criar notificação para transações de alto valor
        if (user?.id && shouldNotify('large_transaction', data, user.id)) {
          const notification = createNotificationFromEvent('large_transaction', data, user.id);
          if (notification) {
            addNotification(notification);
          }
        }

        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        console.log("✅ useLancamentosMutations: Lançamento criado e queries invalidadas");
        
        // Log security event for data creation
        logDataModification("lancamentos", "INSERT", data.id, {
          tipo: data.tipo,
          categoria: data.categoria,
          valor: data.valor,
        });
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
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        console.log("✅ useLancamentosMutations: Lançamento atualizado e queries invalidadas");
        
        // Log security event for data update
        logDataModification("lancamentos", "UPDATE", data.id, {
          updated_fields: Object.keys(data).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at'),
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
      onSuccess: (_data, id) => {
        queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        
        // Log security event for data deletion
        logDataModification("lancamentos", "DELETE", id, {
          deleted_at: new Date().toISOString(),
        });
        
        toast({
          title: "✅ Lançamento Excluído!",
          description: "O lançamento foi removido com sucesso do sistema.",
          duration: 3000,
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
    useCreate,
    useUpdate,
    useDelete,
  };
};
