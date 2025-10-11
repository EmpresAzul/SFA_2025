import React, { useState, useEffect } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLancamentos } from "@/hooks/useLancamentos";
import { useDRECalculations } from "@/hooks/useDRECalculations";
import { formatCurrency } from "@/utils/currency";
import DREHeader from "@/components/dre/DREHeader";
import DRESummaryCards from "@/components/dre/DRESummaryCards";
import DREReport from "@/components/dre/DREReport";
import { PeriodSelector } from "@/components/dre/PeriodSelector";
import { DateRangeFilter } from "@/components/dre/DateRangeFilter";

const DRE: React.FC = () => {
  const [periodo, setPeriodo] = useState<string>("mes-atual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { useQuery } = useLancamentos();
  const { data: lancamentos = [], isLoading } = useQuery();

  // Definir datas padrão quando selecionar período personalizado
  useEffect(() => {
    if (periodo === "personalizado" && !startDate && !endDate) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
      setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
    }
  }, [periodo, startDate, endDate]);

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
      case "ultimos-3-meses":
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        break;
      case "ultimos-6-meses":
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        break;
      case "ano-atual":
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        dataFim = new Date(hoje.getFullYear(), 11, 31);
        break;
      case "personalizado":
        if (startDate && endDate) {
          dataInicio = new Date(startDate);
          dataFim = new Date(endDate);
        } else {
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        }
        break;
      default: // mes-atual
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    }

    return lancamentos.filter((l) => {
      const dataLancamento = new Date(l.data);
      return dataLancamento >= dataInicio && dataLancamento <= dataFim;
    });
  }, [lancamentos, periodo, startDate, endDate]);

  const dreData = useDRECalculations(lancamentosFiltrados);


  const getPeriodoLabel = () => {
    switch (periodo) {
      case "mes-atual":
        return format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
      case "mes-anterior":
        return format(subMonths(new Date(), 1), "MMMM 'de' yyyy", {
          locale: ptBR,
        });
      case "ultimos-3-meses":
        return "Últimos 3 Meses";
      case "ultimos-6-meses":
        return "Últimos 6 Meses";
      case "ano-atual":
        return format(new Date(), "yyyy", { locale: ptBR });
      case "personalizado":
        if (startDate && endDate) {
          const start = new Date(startDate).toLocaleDateString('pt-BR');
          const end = new Date(endDate).toLocaleDateString('pt-BR');
          return `${start} - ${end}`;
        }
        return "Período Personalizado";
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
    <div className="fluxo-container fluxo-section bg-gradient-to-br from-slate-50 to-green-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-2 flex items-center gap-2">
            <span className="flex-shrink-0">📊</span>
            <span className="truncate">Demonstração do Resultado do Exercício (DRE)</span>
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Análise financeira completa baseada em {lancamentosFiltrados.length}{" "}
            lançamentos do período
          </p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[200px]">
          <div className="dre-period-selector">
            <PeriodSelector value={periodo} onChange={setPeriodo} />
          </div>
        </div>
      </div>

      {/* Filtro por período personalizado */}
      {periodo === "personalizado" && (
        <div className="mb-6">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      )}

      <DRESummaryCards dreData={dreData} />

      <DREReport
        dreData={dreData}
        periodoLabel={getPeriodoLabel()}
      />
    </div>
  );
};

export default DRE;
