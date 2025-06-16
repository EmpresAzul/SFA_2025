
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import LembretesActiveCard from '@/components/dashboard/LembretesActiveCard';

const Dashboard: React.FC = () => {
  // Mock data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Fev', revenue: 52000, expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 33000 },
    { month: 'Abr', revenue: 61000, expenses: 38000 },
    { month: 'Mai', revenue: 55000, expenses: 36000 },
    { month: 'Jun', revenue: 67000, expenses: 42000 },
  ];

  const expenseDistribution = [
    { name: 'Pessoal', value: 45, color: '#1e3a8a' },
    { name: 'Fornecedores', value: 30, color: '#3b82f6' },
    { name: 'Marketing', value: 15, color: '#60a5fa' },
    { name: 'Outros', value: 10, color: '#93c5fd' },
  ];

  const cashFlow = [
    { day: '1', entrada: 2500, saida: 1800 },
    { day: '5', entrada: 3200, saida: 2100 },
    { day: '10', entrada: 2800, saida: 1900 },
    { day: '15', entrada: 4100, saida: 2400 },
    { day: '20', entrada: 3600, saida: 2200 },
    { day: '25', entrada: 3900, saida: 2600 },
    { day: '30', entrada: 4200, saida: 2800 },
  ];

  const kpiCards = [
    {
      title: 'Receita Mensal',
      value: 'R$ 67.000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Clientes Ativos',
      value: '1.234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Produtos Vendidos',
      value: '2.847',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Margem de Lucro',
      value: '32.4%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          📈 Dashboard Financeiro
        </h1>
        <p className="text-gray-600 text-sm">
          Visão geral dos principais indicadores do seu negócio
        </p>
      </div>

      {/* KPI Cards */}
      <div className="responsive-grid mb-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-colorful transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {kpi.value}
                  </p>
                  <div className={`flex items-center mt-2 text-xs sm:text-sm ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? 
                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : 
                      <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    }
                    {kpi.change}
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${kpi.gradient}`}>
                  <kpi.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lembretes Ativos */}
      <div className="mb-6">
        <LembretesActiveCard />
      </div>

      {/* Charts Row 1 */}
      <div className="responsive-grid-2 mb-6">
        {/* Revenue Chart */}
        <Card className="hover:shadow-colorful transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg">
              📊 Receita vs Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                  labelStyle={{ color: '#333' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card className="hover:shadow-colorful transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg">
              🥧 Distribuição de Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={10}
                >
                  {expenseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card className="hover:shadow-colorful transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg">
            📈 Fluxo de Caixa - Últimos 30 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="entrada" 
                stroke="#1e3a8a" 
                strokeWidth={3}
                dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="saida" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#f87171' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
