import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Usando o mesmo tipo Lancamento do sistema
export interface Lancamento {
  id: string;
  data: string;
  tipo: "receita" | "despesa";
  categoria: string;
  valor: number;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  status: string;
  user_id: string;
  recorrente: boolean;
  meses_recorrencia?: number | null;
  lancamento_pai_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const useFluxoCaixaData = (periodoFilter: string, startDate?: string, endDate?: string) => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLancamentos();
    }
  }, [user, periodoFilter, startDate, endDate]);

  const getDateRange = () => {
    const hoje = new Date();
    let dataInicio: Date;
    let dataFim: Date;

    switch (periodoFilter) {
      case "mes-anterior":
        dataInicio = startOfMonth(subMonths(hoje, 1));
        dataFim = endOfMonth(subMonths(hoje, 1));
        break;
      case "ultimos-3-meses":
        dataInicio = startOfMonth(subMonths(hoje, 2));
        dataFim = endOfMonth(hoje);
        break;
      case "ultimos-6-meses":
        dataInicio = startOfMonth(subMonths(hoje, 5));
        dataFim = endOfMonth(hoje);
        break;
      case "proximos-30-dias":
        dataInicio = hoje;
        dataFim = new Date(hoje);
        dataFim.setDate(dataFim.getDate() + 30);
        break;
      case "proximos-60-dias":
        dataInicio = hoje;
        dataFim = new Date(hoje);
        dataFim.setDate(dataFim.getDate() + 60);
        break;
      case "personalizado":
        if (startDate && endDate) {
          dataInicio = new Date(startDate);
          dataFim = new Date(endDate);
        } else {
          // Fallback para mês atual se as datas não estiverem definidas
          dataInicio = startOfMonth(hoje);
          dataFim = endOfMonth(hoje);
        }
        break;
      default: // mes-atual
        dataInicio = startOfMonth(hoje);
        dataFim = endOfMonth(hoje);
    }

    return { dataInicio, dataFim };
  };

  const fetchLancamentos = async () => {
    setLoading(true);
    try {
      const { dataInicio, dataFim } = getDateRange();

      console.log("Buscando lançamentos para fluxo de caixa:", {
        periodo: periodoFilter,
        dataInicio: format(dataInicio, "yyyy-MM-dd"),
        dataFim: format(dataFim, "yyyy-MM-dd"),
      });

      const { data, error } = await supabase
        .from("lancamentos")
        .select("*")
        .eq("user_id", user?.id)
        .gte("data", format(dataInicio, "yyyy-MM-dd"))
        .lte("data", format(dataFim, "yyyy-MM-dd"))
        .order("data", { ascending: true });

      if (error) {
        console.error(
          "Erro ao carregar lançamentos para fluxo de caixa:",
          error,
        );
        setLancamentos([]);
      } else {
        console.log("Lançamentos carregados para fluxo de caixa:", data);
        // Type assertion para garantir compatibilidade com nosso tipo Lancamento
        setLancamentos((data || []) as Lancamento[]);
      }
    } catch (error) {
      console.error("Erro ao carregar lançamentos para fluxo de caixa:", error);
      setLancamentos([]);
    } finally {
      setLoading(false);
    }
  };

  return { lancamentos, loading, refetch: fetchLancamentos };
};
