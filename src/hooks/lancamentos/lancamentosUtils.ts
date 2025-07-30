import { supabase } from "@/integrations/supabase/client";
import { addMonths, format } from "date-fns";


interface LancamentoRecorrenteData {
  data: string;
  tipo: "receita" | "despesa";
  categoria: string;
  valor: number;
  descricao: string;
  cliente_id?: string | null;
  fornecedor_id?: string | null;
  observacoes?: string | null;
  user_id: string;
  status: string;
  recorrente?: boolean;
  meses_recorrencia?: number | null;
}

interface Lancamento {
  id: string;
  [key: string]: any;
}

export const criarLancamentosRecorrentes = async (
  lancamentoData: LancamentoRecorrenteData,
  mesesRecorrencia: number,
) => {
  const lancamentosParaCriar = [];
  const dataInicial = new Date(lancamentoData.data);

  // Criar o lançamento principal
  const { data: lancamentoPrincipal, error: erroLancamentoPrincipal } =
    await supabase
      .from("lancamentos")
      .insert([
        {
          ...lancamentoData,
          recorrente: true,
          meses_recorrencia: mesesRecorrencia,
          lancamento_pai_id: null,
        },
      ])
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
      ...lancamentoData,
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
