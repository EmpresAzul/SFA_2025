
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
        console.log("🚀 useCreate: Iniciando criação de lançamento");
        console.log("📦 useCreate: Dados recebidos:", lancamentoData);
        
        // Validar dados obrigatórios
        if (
          !lancamentoData.data ||
          !lancamentoData.tipo ||
          !lancamentoData.categoria ||
          !lancamentoData.valor
        ) {
          console.error("❌ useCreate: Validação falhou - campos obrigatórios faltando");
          throw new Error("Data, tipo, categoria e valor são obrigatórios");
        }

        if (!lancamentoData.user_id) {
          console.error("❌ useCreate: User ID não fornecido");
          throw new Error("User ID é obrigatório");
        }

        // Preparar dados para inserção - SIMPLIFICADO
        const insertData: any = {
          data: lancamentoData.data,
          tipo: lancamentoData.tipo,
          categoria: lancamentoData.categoria,
          valor: lancamentoData.valor,
          user_id: lancamentoData.user_id,
          status: 'confirmado',
        };

        // Campos opcionais
        if (lancamentoData.descricao) insertData.descricao = lancamentoData.descricao;
        if (lancamentoData.observacoes) insertData.observacoes = lancamentoData.observacoes;
        if (lancamentoData.cliente_id) insertData.cliente_id = lancamentoData.cliente_id;
        if (lancamentoData.fornecedor_id) insertData.fornecedor_id = lancamentoData.fornecedor_id;

        console.log("📤 useCreate: Enviando para Supabase:", insertData);

        const { data, error } = await supabase
          .from("lancamentos")
          .insert([insertData])
          .select()
          .single();

        if (error) {
          console.error("❌ useCreate: Erro do Supabase:", error);
          console.error("❌ useCreate: Detalhes:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          
          // Mensagem de erro mais amigável
          let errorMessage = "Erro ao salvar lançamento. ";
          if (error.message.includes("violates")) {
            errorMessage += "Verifique se todos os campos obrigatórios estão preenchidos.";
          } else if (error.message.includes("permission")) {
            errorMessage += "Você não tem permissão para criar lançamentos.";
          } else {
            errorMessage += error.message;
          }
          
          throw new Error(errorMessage);
        }

        console.log("✅ useCreate: Lançamento criado com sucesso:", data);

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
        console.log("✅ useCreate onSuccess: Invalidando queries");
        queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        
        // Log security event for data creation
        logDataModification("lancamentos", "INSERT", data.id, {
          tipo: data.tipo,
          categoria: data.categoria,
          valor: data.valor,
        });
        
        console.log("✅ useCreate onSuccess: Concluído");
      },
      onError: (error: unknown) => {
        console.error("❌ useCreate onError: Erro ao criar lançamento:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao criar lançamento";
        console.error("❌ useCreate onError: Mensagem:", errorMessage);
        
        toast({
          title: "❌ Erro ao Salvar",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, ...updateData }: LancamentoUpdateData) => {
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
          recorrente,
          meses_recorrencia,
          ...dataToUpdate
        } = updateData;

        const { data, error } = await supabase
          .from("lancamentos")
          .update(dataToUpdate)
          .eq("id", id)
          .select(
            `
            *,
            cliente:cadastros!cliente_id(id, nome),
            fornecedor:cadastros!fornecedor_id(id, nome)
          `,
          )
          .single();

        if (error) {
          console.error("❌ Erro ao atualizar lançamento:", error.message);
          throw error;
        }

        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        
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
        const { error } = await supabase
          .from("lancamentos")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("❌ Erro ao excluir lançamento:", error.message);
          throw error;
        }
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
        console.error("❌ Erro ao excluir lançamento:", error);
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
