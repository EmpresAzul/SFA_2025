
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface Lancamento {
  id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  categoria: string;
  observacoes?: string;
}

const FluxoCaixa: React.FC = () => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodoFilter, setPeriodoFilter] = useState('mes-atual');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLancamentos();
    }
  }, [user, periodoFilter]);

  const fetchLancamentos = async () => {
    setLoading(true);
    try {
      let dataInicio: Date;
      let dataFim: Date;

      const hoje = new Date();

      switch (periodoFilter) {
        case 'mes-atual':
          dataInicio = startOfMonth(hoje);
          dataFim = endOfMonth(hoje);
          break;
        case 'mes-anterior':
          const mesAnterior = subMonths(hoje, 1);
          dataInicio = startOfMonth(mesAnterior);
          dataFim = endOfMonth(mesAnterior);
          break;
        case 'ultimos-3-meses':
          dataInicio = startOfMonth(subMonths(hoje, 2));
          dataFim = endOfMonth(hoje);
          break;
        case 'ultimos-6-meses':
          dataInicio = startOfMonth(subMonths(hoje, 5));
          dataFim = endOfMonth(hoje);
          break;
        default:
          dataInicio = startOfMonth(hoje);
          dataFim = endOfMonth(hoje);
      }

      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .eq('user_id', user?.id)
        .gte('data', format(dataInicio, 'yyyy-MM-dd'))
        .lte('data', format(dataFim, 'yyyy-MM-dd'))
        .order('data', { ascending: true });

      if (error) throw error;
      setLancamentos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar lançamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalReceitas = () => {
    return lancamentos
      .filter(l => l.tipo === 'receita')
      .reduce((sum, l) => sum + l.valor, 0);
  };

  const getTotalDespesas = () => {
    return lancamentos
      .filter(l => l.tipo === 'despesa')
      .reduce((sum, l) => sum + l.valor, 0);
  };

  const getSaldo = () => {
    return getTotalReceitas() - getTotalDespesas();
  };

  const getFluxoPorDia = () => {
    const fluxoPorDia: { [key: string]: { receitas: number; despesas: number; data: string } } = {};

    lancamentos.forEach(lancamento => {
      const data = lancamento.data;
      if (!fluxoPorDia[data]) {
        fluxoPorDia[data] = { receitas: 0, despesas: 0, data: format(new Date(data), 'dd/MM') };
      }

      if (lancamento.tipo === 'receita') {
        fluxoPorDia[data].receitas += lancamento.valor;
      } else {
        fluxoPorDia[data].despesas += lancamento.valor;
      }
    });

    return Object.values(fluxoPorDia).sort((a, b) => a.data.localeCompare(b.data));
  };

  const getReceitasPorCategoria = () => {
    const receitasPorCategoria: { [key: string]: number } = {};

    lancamentos
      .filter(l => l.tipo === 'receita')
      .forEach(lancamento => {
        if (!receitasPorCategoria[lancamento.categoria]) {
          receitasPorCategoria[lancamento.categoria] = 0;
        }
        receitasPorCategoria[lancamento.categoria] += lancamento.valor;
      });

    return Object.entries(receitasPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      color: '#10b981'
    }));
  };

  const getDespesasPorCategoria = () => {
    const despesasPorCategoria: { [key: string]: number } = {};

    lancamentos
      .filter(l => l.tipo === 'despesa')
      .forEach(lancamento => {
        if (!despesasPorCategoria[lancamento.categoria]) {
          despesasPorCategoria[lancamento.categoria] = 0;
        }
        despesasPorCategoria[lancamento.categoria] += lancamento.valor;
      });

    return Object.entries(despesasPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      color: '#ef4444'
    }));
  };

  const fluxoPorDia = getFluxoPorDia();
  const receitasPorCategoria = getReceitasPorCategoria();
  const despesasPorCategoria = getDespesasPorCategoria();

  const getPeriodoLabel = () => {
    switch (periodoFilter) {
      case 'mes-atual': return 'Mês Atual';
      case 'mes-anterior': return 'Mês Anterior';
      case 'ultimos-3-meses': return 'Últimos 3 Meses';
      case 'ultimos-6-meses': return 'Últimos 6 Meses';
      default: return 'Mês Atual';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-fluxo-text">Fluxo de Caixa</h1>
          <p className="text-gray-600 mt-2">Análise detalhada do movimento financeiro</p>
        </div>
        
        <div className="space-y-2">
          <Label>Período</Label>
          <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes-atual">Mês Atual</SelectItem>
              <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
              <SelectItem value="ultimos-3-meses">Últimos 3 Meses</SelectItem>
              <SelectItem value="ultimos-6-meses">Últimos 6 Meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Painéis de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-10 w-10 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-emerald-600">Total Receitas</p>
                <p className="text-2xl font-bold text-emerald-900">R$ {getTotalReceitas().toFixed(2)}</p>
                <p className="text-xs text-emerald-600 mt-1">{getPeriodoLabel()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-10 w-10 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-red-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-900">R$ {getTotalDespesas().toFixed(2)}</p>
                <p className="text-xs text-red-600 mt-1">{getPeriodoLabel()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${getSaldo() >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className={`h-10 w-10 ${getSaldo() >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              <div className="ml-4">
                <p className={`text-sm font-medium ${getSaldo() >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Saldo Líquido</p>
                <p className={`text-2xl font-bold ${getSaldo() >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                  R$ {getSaldo().toFixed(2)}
                </p>
                <p className={`text-xs ${getSaldo() >= 0 ? 'text-blue-600' : 'text-orange-600'} mt-1`}>
                  {getSaldo() >= 0 ? 'Superávit' : 'Déficit'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-10 w-10 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Total Transações</p>
                <p className="text-2xl font-bold text-purple-900">{lancamentos.length}</p>
                <p className="text-xs text-purple-600 mt-1">{getPeriodoLabel()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Fluxo Diário */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="gradient-fluxo-text">Fluxo de Caixa Diário - {getPeriodoLabel()}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={fluxoPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="data" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="receitas" fill="#10b981" radius={[4, 4, 0, 0]} name="Receitas" />
              <Bar dataKey="despesas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráficos de Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas por Categoria */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-fluxo-text">Receitas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {receitasPorCategoria.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={receitasPorCategoria}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {receitasPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhuma receita encontrada no período
              </div>
            )}
          </CardContent>
        </Card>

        {/* Despesas por Categoria */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="gradient-fluxo-text">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {despesasPorCategoria.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={despesasPorCategoria}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {despesasPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhuma despesa encontrada no período
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FluxoCaixa;
