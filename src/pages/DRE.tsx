
import React, { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLancamentos } from '@/hooks/useLancamentos';
import { useDRECalculations } from '@/hooks/useDRECalculations';
import DREHeader from '@/components/dre/DREHeader';
import DRESummaryCards from '@/components/dre/DRESummaryCards';
import DREReport from '@/components/dre/DREReport';

const DRE: React.FC = () => {
  const [periodo, setPeriodo] = useState<string>('mes-atual');
  
  const { useQuery } = useLancamentos();
  const { data: lancamentos = [], isLoading } = useQuery();
  
  // Filtrar lançamentos por período
  const lancamentosFiltrados = React.useMemo(() => {
    const hoje = new Date();
    let dataInicio: Date;
    let dataFim: Date;

    switch (periodo) {
      case 'mes-anterior':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
        break;
      case 'ano-atual':
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        dataFim = new Date(hoje.getFullYear(), 11, 31);
        break;
      default: // mes-atual
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    }

    return lancamentos.filter(l => {
      const dataLancamento = new Date(l.data);
      return dataLancamento >= dataInicio && dataLancamento <= dataFim;
    });
  }, [lancamentos, periodo]);

  const dreData = useDRECalculations(lancamentosFiltrados);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPeriodoLabel = () => {
    switch (periodo) {
      case 'mes-atual':
        return format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
      case 'mes-anterior':
        return format(subMonths(new Date(), 1), "MMMM 'de' yyyy", { locale: ptBR });
      case 'ano-atual':
        return format(new Date(), "yyyy", { locale: ptBR });
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando dados do DRE...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DREHeader
        periodo={periodo}
        setPeriodo={setPeriodo}
        lancamentosCount={lancamentosFiltrados.length}
      />

      <DRESummaryCards
        dreData={dreData}
        formatCurrency={formatCurrency}
      />

      <DREReport
        dreData={dreData}
        periodoLabel={getPeriodoLabel()}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default DRE;
