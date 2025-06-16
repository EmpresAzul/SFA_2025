
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, DollarSign, Calendar, FileText } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lancamento {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string;
  observacoes?: string;
}

interface DREData {
  receitaOperacionalBruta: number;
  deducoesReceitaBruta: number;
  receitaOperacionalLiquida: number;
  custosVendas: number;
  resultadoOperacionalBruto: number;
  despesasOperacionais: number;
  despesasFinanceiras: number;
  resultadoOperacional: number;
  outrasReceitasDespesas: number;
  resultadoAntesIR: number;
  provisaoIR: number;
  lucroLiquido: number;
}

const DRE: React.FC = () => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [dreData, setDreData] = useState<DREData>({
    receitaOperacionalBruta: 0,
    deducoesReceitaBruta: 0,
    receitaOperacionalLiquida: 0,
    custosVendas: 0,
    resultadoOperacionalBruto: 0,
    despesasOperacionais: 0,
    despesasFinanceiras: 0,
    resultadoOperacional: 0,
    outrasReceitasDespesas: 0,
    resultadoAntesIR: 0,
    provisaoIR: 0,
    lucroLiquido: 0
  });
  const [periodo, setPeriodo] = useState<string>('mes-atual');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLancamentos = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let dataInicio: Date;
      let dataFim: Date;

      const hoje = new Date();
      
      switch (periodo) {
        case 'mes-atual':
          dataInicio = startOfMonth(hoje);
          dataFim = endOfMonth(hoje);
          break;
        case 'mes-anterior':
          const mesAnterior = subMonths(hoje, 1);
          dataInicio = startOfMonth(mesAnterior);
          dataFim = endOfMonth(mesAnterior);
          break;
        case 'ano-atual':
          dataInicio = startOfYear(hoje);
          dataFim = endOfYear(hoje);
          break;
        default:
          dataInicio = startOfMonth(hoje);
          dataFim = endOfMonth(hoje);
      }

      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .eq('user_id', user.id)
        .gte('data', format(dataInicio, 'yyyy-MM-dd'))
        .lte('data', format(dataFim, 'yyyy-MM-dd'))
        .eq('status', 'ativo');

      if (error) throw error;

      const lancamentosFormatados = (data || []).map(item => ({
        ...item,
        tipo: item.tipo as 'receita' | 'despesa'
      }));

      setLancamentos(lancamentosFormatados);
      calcularDRE(lancamentosFormatados);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar lançamentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularDRE = (lancamentosData: Lancamento[]) => {
    // Categorização dos lançamentos
    const receitas = lancamentosData.filter(l => l.tipo === 'receita');
    const despesas = lancamentosData.filter(l => l.tipo === 'despesa');

    // RECEITA OPERACIONAL BRUTA
    const receitaVendas = receitas.filter(r => 
      ['vendas', 'produtos', 'serviços', 'receita operacional'].includes(r.categoria.toLowerCase())
    ).reduce((sum, r) => sum + r.valor, 0);

    const receitaMercadorias = receitas.filter(r => 
      ['mercadorias', 'revenda'].includes(r.categoria.toLowerCase())
    ).reduce((sum, r) => sum + r.valor, 0);

    const prestacaoServicos = receitas.filter(r => 
      ['prestação de serviços', 'serviços prestados'].includes(r.categoria.toLowerCase())
    ).reduce((sum, r) => sum + r.valor, 0);

    const receitaOperacionalBruta = receitaVendas + receitaMercadorias + prestacaoServicos;

    // DEDUÇÕES DA RECEITA BRUTA
    const devolucoes = despesas.filter(d => 
      ['devoluções', 'devolução de vendas'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const abatimentos = despesas.filter(d => 
      ['abatimentos', 'descontos'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const impostos = despesas.filter(d => 
      ['impostos', 'tributos', 'icms', 'ipi', 'pis', 'cofins'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const deducoesReceitaBruta = devolucoes + abatimentos + impostos;

    // RECEITA OPERACIONAL LÍQUIDA
    const receitaOperacionalLiquida = receitaOperacionalBruta - deducoesReceitaBruta;

    // CUSTOS DAS VENDAS
    const custoProdutos = despesas.filter(d => 
      ['custo dos produtos', 'cpm', 'cmv'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const custoMercadorias = despesas.filter(d => 
      ['custo das mercadorias', 'custo mercadorias'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const custoServicos = despesas.filter(d => 
      ['custo dos serviços', 'csp'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const custosVendas = custoProdutos + custoMercadorias + custoServicos;

    // RESULTADO OPERACIONAL BRUTO
    const resultadoOperacionalBruto = receitaOperacionalLiquida - custosVendas;

    // DESPESAS OPERACIONAIS
    const despesasComVendas = despesas.filter(d => 
      ['vendas', 'comissões', 'marketing', 'publicidade'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const despesasAdministrativas = despesas.filter(d => 
      ['administrativas', 'salários', 'aluguel', 'energia', 'telefone', 'material escritório'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const despesasOperacionais = despesasComVendas + despesasAdministrativas;

    // DESPESAS FINANCEIRAS
    const receitasFinanceiras = receitas.filter(r => 
      ['receitas financeiras', 'juros recebidos', 'aplicações'].includes(r.categoria.toLowerCase())
    ).reduce((sum, r) => sum + r.valor, 0);

    const variacoesMonetarias = receitas.filter(r => 
      ['variações monetárias', 'correção monetária'].includes(r.categoria.toLowerCase())
    ).reduce((sum, r) => sum + r.valor, 0);

    const despesasFinanceiras = (receitasFinanceiras + variacoesMonetarias) * -1; // Invertendo para despesa

    // RESULTADO OPERACIONAL
    const resultadoOperacional = resultadoOperacionalBruto - despesasOperacionais - Math.abs(despesasFinanceiras);

    // OUTRAS RECEITAS E DESPESAS
    const outrasReceitas = receitas.filter(r => 
      ['outras receitas', 'receitas extraordinárias'].includes(r.categoria.toLowerCase())
    ).reduce((sum, r) => sum + r.valor, 0);

    const custoVendaBens = despesas.filter(d => 
      ['custo venda bens', 'alienação'].includes(d.categoria.toLowerCase())
    ).reduce((sum, d) => sum + d.valor, 0);

    const outrasReceitasDespesas = outrasReceitas - custoVendaBens;

    // RESULTADO ANTES DO IR
    const resultadoAntesIR = resultadoOperacional + outrasReceitasDespesas;

    // PROVISÃO PARA IR E CSLL
    const provisaoIR = resultadoAntesIR > 0 ? resultadoAntesIR * 0.15 : 0; // 15% estimado

    // LUCRO LÍQUIDO
    const lucroLiquido = resultadoAntesIR - provisaoIR;

    setDreData({
      receitaOperacionalBruta,
      deducoesReceitaBruta,
      receitaOperacionalLiquida,
      custosVendas,
      resultadoOperacionalBruto,
      despesasOperacionais,
      despesasFinanceiras: Math.abs(despesasFinanceiras),
      resultadoOperacional,
      outrasReceitasDespesas,
      resultadoAntesIR,
      provisaoIR,
      lucroLiquido
    });
  };

  useEffect(() => {
    fetchLancamentos();
  }, [user, periodo]);

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
    level = 0 
  }: {
    label: string;
    value: number;
    isSubtotal?: boolean;
    isTotal?: boolean;
    isNegative?: boolean;
    level?: number;
  }) => (
    <div className={`
      flex justify-between items-center py-2 px-4
      ${isTotal ? 'bg-gradient-to-r from-fluxo-blue-50 to-fluxo-blue-100 border-t-2 border-fluxo-blue-300 font-bold text-lg' : ''}
      ${isSubtotal ? 'bg-gray-50 border-t border-gray-200 font-semibold' : ''}
      ${level > 0 ? `ml-${level * 4}` : ''}
    `}>
      <span className={`
        ${isTotal ? 'text-fluxo-blue-800' : ''}
        ${isSubtotal ? 'text-gray-700' : 'text-gray-600'}
        ${isNegative ? 'text-red-600' : ''}
      `}>
        {isNegative && '(-) '}{label}
      </span>
      <span className={`
        font-mono
        ${isTotal ? 'text-fluxo-blue-800 text-xl' : ''}
        ${isSubtotal ? 'text-gray-700 font-semibold' : 'text-gray-600'}
        ${value < 0 ? 'text-red-600' : value > 0 ? 'text-green-600' : 'text-gray-600'}
      `}>
        {formatCurrency(value)}
      </span>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-fluxo-blue-600" />
            Demonstração do Resultado do Exercício (DRE)
          </h1>
          <p className="text-fluxo-black-600 mt-2">
            Análise completa da performance financeira do período selecionado
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
          
          <Button 
            onClick={fetchLancamentos}
            disabled={loading}
            className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </Button>
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
            <DRELineItem label="Vendas de Produtos" value={dreData.receitaOperacionalBruta * 0.6} level={1} />
            <DRELineItem label="Vendas de Mercadorias" value={dreData.receitaOperacionalBruta * 0.3} level={1} />
            <DRELineItem label="Prestação de Serviços" value={dreData.receitaOperacionalBruta * 0.1} level={1} />

            {/* DEDUÇÕES */}
            <div className="bg-red-50 border-b border-red-200 p-4">
              <h3 className="font-bold text-red-800">(-) DEDUÇÕES DA RECEITA BRUTA</h3>
            </div>
            <DRELineItem label="Devoluções de Vendas" value={dreData.deducoesReceitaBruta * 0.2} isNegative level={1} />
            <DRELineItem label="Abatimentos" value={dreData.deducoesReceitaBruta * 0.1} isNegative level={1} />
            <DRELineItem label="Impostos e Contribuições Incidentes sobre Vendas" value={dreData.deducoesReceitaBruta * 0.7} isNegative level={1} />

            {/* RECEITA LÍQUIDA */}
            <DRELineItem label="= RECEITA OPERACIONAL LÍQUIDA" value={dreData.receitaOperacionalLiquida} isSubtotal />

            {/* CUSTOS */}
            <div className="bg-orange-50 border-b border-orange-200 p-4">
              <h3 className="font-bold text-orange-800">(-) CUSTOS DAS VENDAS</h3>
            </div>
            <DRELineItem label="Custo dos Produtos Vendidos" value={dreData.custosVendas * 0.5} isNegative level={1} />
            <DRELineItem label="Custo das Mercadorias" value={dreData.custosVendas * 0.3} isNegative level={1} />
            <DRELineItem label="Custo dos Serviços Prestados" value={dreData.custosVendas * 0.2} isNegative level={1} />

            {/* RESULTADO BRUTO */}
            <DRELineItem label="= RESULTADO OPERACIONAL BRUTO" value={dreData.resultadoOperacionalBruto} isSubtotal />

            {/* DESPESAS OPERACIONAIS */}
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <h3 className="font-bold text-blue-800">(-) DESPESAS OPERACIONAIS</h3>
            </div>
            <DRELineItem label="Despesas com Vendas" value={dreData.despesasOperacionais * 0.4} isNegative level={1} />
            <DRELineItem label="Despesas Administrativas" value={dreData.despesasOperacionais * 0.6} isNegative level={1} />

            {/* DESPESAS FINANCEIRAS */}
            <div className="bg-purple-50 border-b border-purple-200 p-4">
              <h3 className="font-bold text-purple-800">(-) DESPESAS FINANCEIRAS LÍQUIDAS</h3>
            </div>
            <DRELineItem label="(-) Receitas Financeiras" value={dreData.despesasFinanceiras * 0.3} level={1} />
            <DRELineItem label="(-) Variações Monetárias e Cambiais Ativas" value={dreData.despesasFinanceiras * 0.7} level={1} />

            {/* OUTRAS RECEITAS */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <h3 className="font-bold text-gray-800">OUTRAS RECEITAS E DESPESAS</h3>
            </div>
            <DRELineItem label="(-) Custo da Venda de Bens e Direitos do Ativo Não Circulante" value={dreData.outrasReceitasDespesas} level={1} />

            {/* RESULTADO ANTES IR */}
            <DRELineItem label="= RESULTADO OPERACIONAL ANTES DO IR E CSLL" value={dreData.resultadoAntesIR} isSubtotal />

            {/* PROVISÕES */}
            <div className="bg-yellow-50 border-b border-yellow-200 p-4">
              <h3 className="font-bold text-yellow-800">(-) Provisão para IR e CSLL</h3>
            </div>
            <DRELineItem label="(-) PRO LABORE" value={dreData.provisaoIR} isNegative level={1} />

            {/* LUCRO LÍQUIDO */}
            <DRELineItem label="= RESULTADO LÍQUIDO DO EXERCÍCIO" value={dreData.lucroLiquido} isTotal />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DRE;
