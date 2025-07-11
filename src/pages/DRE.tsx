import React, { useState } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLancamentos } from "@/hooks/useLancamentos";
import { useDRECalculations } from "@/hooks/useDRECalculations";
import { formatCurrency } from "@/utils/currency";
import DREHeader from "@/components/dre/DREHeader";
import DRESummaryCards from "@/components/dre/DRESummaryCards";
import DREReport from "@/components/dre/DREReport";

const DRE: React.FC = () => {
  const [periodo, setPeriodo] = useState<string>("mes-atual");

  const { useQuery } = useLancamentos();
  const { data: lancamentos = [], isLoading } = useQuery();

  // Filtrar lançamentos por período
  const lancamentosFiltrados = React.useMemo(() => {
    const hoje = new Date();
    let dataInicio: Date;
    let dataFim: Date;

    switch (periodo) {
      case "mes-anterior":
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
        break;
      case "ano-atual":
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        dataFim = new Date(hoje.getFullYear(), 11, 31);
        break;
      default: // mes-atual
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    }

    return lancamentos.filter((l) => {
      const dataLancamento = new Date(l.data);
      return dataLancamento >= dataInicio && dataLancamento <= dataFim;
    });
  }, [lancamentos, periodo]);

  const dreData = useDRECalculations(lancamentosFiltrados);


  const getPeriodoLabel = () => {
    switch (periodo) {
      case "mes-atual":
        return format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
      case "mes-anterior":
        return format(subMonths(new Date(), 1), "MMMM 'de' yyyy", {
          locale: ptBR,
        });
      case "ano-atual":
        return format(new Date(), "yyyy", { locale: ptBR });
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="responsive-padding bg-gradient-to-br from-slate-50 to-green-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do DRE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-green-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          📊 Demonstração do Resultado do Exercício (DRE)
        </h1>
        <p className="text-gray-600 text-sm">
          Análise financeira completa baseada em {lancamentosFiltrados.length}{" "}
          lançamentos do período
        </p>
      </div>

      <DREHeader
        periodo={periodo}
        setPeriodo={setPeriodo}
        lancamentosCount={lancamentosFiltrados.length}
      />

      <DRESummaryCards dreData={dreData} />

      <DREReport
        dreData={dreData}
        periodoLabel={getPeriodoLabel()}
      />
    </div>
  );
};

export default DRE;
