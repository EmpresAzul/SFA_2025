import { supabase } from "@/integrations/supabase/client";
import { addMonths, format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";
import type { LancamentoCreateData } from "@/types/lancamentos";

type Lancamento = Database["public"]["Tables"]["lancamentos"]["Row"];
type LancamentoInsert = Database["public"]["Tables"]["lancamentos"]["Insert"];

export const criarLancamentosRecorrentes = async (
  lancamentoData: LancamentoCreateData,
  mesesRecorrencia: number,
) => {
  const lancamentosParaCriar = [];
  const dataInicial = new Date(lancamentoData.data);

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
    recorrente: true,
    meses_recorrencia: mesesRecorrencia,
    lancamento_pai_id: null,
  };

  // Criar o lançamento principal
  const { data: lancamentoPrincipal, error: erroLancamentoPrincipal } =
    await supabase
      .from("lancamentos")
      .insert([insertData])
      .select()
      .single();

  if (erroLancamentoPrincipal) {
    throw erroLancamentoPrincipal;
  }

  console.log("Lançamento principal criado:", lancamentoPrincipal);

  // Criar os lançamentos futuros
  for (let i = 1; i <= mesesRecorrencia; i++) {
    const dataFutura = addMonths(dataInicial, i);
    lancamentosParaCriar.push({
      ...insertData,
      data: format(dataFutura, "yyyy-MM-dd"),
      recorrente: false,
      meses_recorrencia: null,
      lancamento_pai_id: lancamentoPrincipal.id,
    });
  }

  if (lancamentosParaCriar.length > 0) {
    const { error: erroLancamentosFuturos } = await supabase
      .from("lancamentos")
      .insert(lancamentosParaCriar);

    if (erroLancamentosFuturos) {
      console.error(
        "Erro ao criar lançamentos futuros:",
        erroLancamentosFuturos,
      );
      throw erroLancamentosFuturos;
    }

    console.log(`${lancamentosParaCriar.length} lançamentos futuros criados`);
  }

  return lancamentoPrincipal;
};

export const formatLancamentoForDisplay = (lancamento: Lancamento): Record<string, unknown> => {
  return {
    id: lancamento.id,
    descricao: lancamento.observacoes,
    valor: lancamento.valor,
    data: lancamento.data,
    categoria: lancamento.categoria,
    tipo: lancamento.tipo,
    recorrente: lancamento.recorrente,
    meses_recorrencia: lancamento.meses_recorrencia,
    lancamento_pai_id: lancamento.lancamento_pai_id,
  };
};
