
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Calendar, FileText } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLancamentos } from '@/hooks/useLancamentos';
import { useDRECalculations, DREData } from '@/hooks/useDRECalculations';

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

  const DRELineItem = ({ 
    label, 
    value, 
    isSubtotal = false, 
    isTotal = false, 
    isNegative = false,
    level = 0,
    detalhes = null
  }: {
    label: string;
    value: number;
    isSubtotal?: boolean;
    isTotal?: boolean;
    isNegative?: boolean;
    level?: number;
    detalhes?: { [key: string]: number } | null;
  }) => (
    <div className={`
      flex justify-between items-center py-2 px-4
      ${isTotal ? 'bg-gradient-to-r from-fluxo-blue-50 to-fluxo-blue-100 border-t-2 border-fluxo-blue-300 font-bold text-lg' : ''}
      ${isSubtotal ? 'bg-gray-50 border-t border-gray-200 font-semibold' : ''}
      ${level > 0 ? `ml-${level * 4}` : ''}
    `}>
      <div className="flex-1">
        <span className={`
          ${isTotal ? 'text-fluxo-blue-800' : ''}
          ${isSubtotal ? 'text-gray-700' : 'text-gray-600'}
          ${isNegative ? 'text-red-600' : ''}
        `}>
          {isNegative && '(-) '}{label}
        </span>
        {detalhes && Object.keys(detalhes).length > 0 && (
          <div className="text-xs text-gray-500 mt-1 ml-4">
            {Object.entries(detalhes).map(([cat, val]) => (
              <div key={cat} className="flex justify-between">
                <span>{cat}</span>
                <span>{formatCurrency(val)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <span className={`
        font-mono ml-4
        ${isTotal ? 'text-fluxo-blue-800 text-xl' : ''}
        ${isSubtotal ? 'text-gray-700 font-semibold' : 'text-gray-600'}
        ${value < 0 ? 'text-red-600' : value > 0 ? 'text-green-600' : 'text-gray-600'}
      `}>
        {formatCurrency(value)}
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando dados do DRE...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-fluxo-blue-600" />
            Demonstração do Resultado do Exercício (DRE)
          </h1>
          <p className="text-fluxo-black-600 mt-2">
            Análise baseada em {lancamentosFiltrados.length} lançamentos do período
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fluxo-blue-600" />
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes-atual">Mês Atual</SelectItem>
                <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
                <SelectItem value="ano-atual">Ano Atual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Bruta</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(dreData.receitaOperacionalBruta)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Líquida</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(dreData.receitaOperacionalLiquida)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resultado Operacional</p>
                <p className={`text-2xl font-bold ${dreData.resultadoOperacional >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dreData.resultadoOperacional)}
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 ${dreData.resultadoOperacional >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lucro Líquido</p>
                <p className={`text-2xl font-bold ${dreData.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dreData.lucroLiquido)}
                </p>
              </div>
              <DollarSign className={`w-8 h-8 ${dreData.lucroLiquido >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DRE Detalhada */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 text-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            DRE - {getPeriodoLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {/* RECEITA OPERACIONAL BRUTA */}
            <div className="bg-green-50 border-b-2 border-green-200 p-4">
              <h3 className="font-bold text-green-800 text-lg mb-2">RECEITA OPERACIONAL BRUTA</h3>
            </div>
            <DRELineItem 
              label="Receitas Operacionais" 
              value={dreData.receitaOperacionalBruta} 
              detalhes={dreData.detalhamento.receitasOperacionais}
              level={1} 
            />

            {/* DEDUÇÕES */}
            <div className="bg-red-50 border-b border-red-200 p-4">
              <h3 className="font-bold text-red-800">(-) DEDUÇÕES DA RECEITA BRUTA</h3>
            </div>
            <DRELineItem 
              label="Deduções e Impostos" 
              value={dreData.deducoesReceitaBruta} 
              isNegative 
              detalhes={dreData.detalhamento.deducoes}
              level={1} 
            />

            {/* RECEITA LÍQUIDA */}
            <DRELineItem label="= RECEITA OPERACIONAL LÍQUIDA" value={dreData.receitaOperacionalLiquida} isSubtotal />

            {/* CUSTOS */}
            <div className="bg-orange-50 border-b border-orange-200 p-4">
              <h3 className="font-bold text-orange-800">(-) CUSTOS DAS VENDAS</h3>
            </div>
            <DRELineItem 
              label="Custos Diretos" 
              value={dreData.custosVendas} 
              isNegative 
              detalhes={dreData.detalhamento.custos}
              level={1} 
            />

            {/* RESULTADO BRUTO */}
            <DRELineItem label="= RESULTADO OPERACIONAL BRUTO" value={dreData.resultadoOperacionalBruto} isSubtotal />

            {/* DESPESAS OPERACIONAIS */}
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <h3 className="font-bold text-blue-800">(-) DESPESAS OPERACIONAIS</h3>
            </div>
            <DRELineItem 
              label="Despesas Operacionais" 
              value={dreData.despesasOperacionais} 
              isNegative 
              detalhes={dreData.detalhamento.despesasOperacionais}
              level={1} 
            />

            {/* DESPESAS FINANCEIRAS */}
            <div className="bg-purple-50 border-b border-purple-200 p-4">
              <h3 className="font-bold text-purple-800">(-) DESPESAS FINANCEIRAS</h3>
            </div>
            <DRELineItem 
              label="Despesas Financeiras" 
              value={dreData.despesasFinanceiras} 
              isNegative 
              detalhes={dreData.detalhamento.despesasFinanceiras}
              level={1} 
            />

            {/* RESULTADO OPERACIONAL */}
            <DRELineItem label="= RESULTADO OPERACIONAL" value={dreData.resultadoOperacional} isSubtotal />

            {/* OUTRAS RECEITAS */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <h3 className="font-bold text-gray-800">OUTRAS RECEITAS E DESPESAS</h3>
            </div>
            <DRELineItem 
              label="Outras Receitas" 
              value={Object.values(dreData.detalhamento.outrasReceitas).reduce((a, b) => a + b, 0)} 
              detalhes={dreData.detalhamento.outrasReceitas}
              level={1} 
            />
            <DRELineItem 
              label="(-) Outras Despesas" 
              value={Object.values(dreData.detalhamento.outrasDespesas).reduce((a, b) => a + b, 0)} 
              isNegative 
              detalhes={dreData.detalhamento.outrasDespesas}
              level={1} 
            />

            {/* RESULTADO ANTES IR */}
            <DRELineItem label="= RESULTADO ANTES DO IR E CSLL" value={dreData.resultadoAntesIR} isSubtotal />

            {/* PROVISÕES */}
            <div className="bg-yellow-50 border-b border-yellow-200 p-4">
              <h3 className="font-bold text-yellow-800">(-) Provisão para IR e CSLL</h3>
            </div>
            <DRELineItem label="(-) Provisão IR/CSLL (15%)" value={dreData.provisaoIR} isNegative level={1} />

            {/* LUCRO LÍQUIDO */}
            <DRELineItem label="= RESULTADO LÍQUIDO DO EXERCÍCIO" value={dreData.lucroLiquido} isTotal />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DRE;

