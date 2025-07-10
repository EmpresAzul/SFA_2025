import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { criarLancamentosRecorrentes } from "../lancamentosUtils";
import type { LancamentoCreateData } from "@/types/lancamentos";
import type { Database } from "@/integrations/supabase/types";

type LancamentoInsert = Database['public']['Tables']['lancamentos']['Insert'];

export const useLancamentoCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lancamentoData: LancamentoCreateData) => {
      console.log(
        "useLancamentoCreateMutation: Criando lançamento:",
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

      // Preparar dados para inserção conforme schema do Supabase
      const insertData: LancamentoInsert = {
        data: lancamentoData.data,
        tipo: lancamentoData.tipo,
        categoria: lancamentoData.categoria,
        valor: lancamentoData.valor,
        cliente_id: lancamentoData.cliente_id || null,
        fornecedor_id: lancamentoData.fornecedor_id || null,
        observacoes: lancamentoData.observacoes || null,
        user_id: lancamentoData.user_id,
        status: lancamentoData.status || 'ativo',
        recorrente: lancamentoData.recorrente || false,
        meses_recorrencia: lancamentoData.recorrente ? lancamentoData.meses_recorrencia || null : null,
        lancamento_pai_id: null,
      };

      const { data, error } = await supabase
        .from("lancamentos")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error(
          "useLancamentoCreateMutation: Erro ao criar lançamento:",
          error,
        );
        throw error;
      }

      console.log(
        "useLancamentoCreateMutation: Lançamento criado com sucesso:",
        data,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
      console.log("useLancamentoCreateMutation: Query invalidada após criação");
    },
    onError: (error: unknown) => {
      console.error(
        "useLancamentoCreateMutation: Erro na mutation de criação:",
        error,
      );
    },
  });
};