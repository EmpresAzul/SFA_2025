import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const DashboardChart: React.FC = () => {
  // Dados exatos da imagem do dashboard
  const monthlyRevenue = [
    { month: "Jan", receita: 4500, despesas: 3000 },
    { month: "Fev", receita: 5200, despesas: 3500 },
    { month: "Mar", receita: 4800, despesas: 3300 },
    { month: "Abr", receita: 6100, despesas: 3800 },
    { month: "Mai", receita: 5500, despesas: 3600 },
    { month: "Jun", receita: 6700, despesas: 4200 },
  ];

  const expenseDistribution = [
    { name: "Pessoal", value: 45, color: "#1e3a8a" },
    { name: "Fornecedores", value: 30, color: "#3b82f6" },
    { name: "Marketing", value: 15, color: "#60a5fa" },
    { name: "Outros", value: 10, color: "#93c5fd" },
  ];

  const cashFlow = [
    { day: "1", entrada: 2500, saida: 1800 },
    { day: "5", entrada: 3200, saida: 2100 },
    { day: "10", entrada: 2800, saida: 1900 },
    { day: "15", entrada: 4100, saida: 2400 },
    { day: "20", entrada: 3600, saida: 2200 },
    { day: "25", entrada: 3900, saida: 2600 },
    { day: "30", entrada: 4200, saida: 2800 },
  ];

  return (
    <>
      {/* Charts Row 1 - Gráficos 3D Menores */}
      <div className="responsive-grid-2 mb-6">
        {/* Revenue Chart 3D */}
        <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 backdrop-blur-sm transform perspective-1000">
          <CardHeader className="pb-2">
            <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm font-bold">
              📊 Receita vs Despesas
            </CardTitle>
            <p className="text-xs text-gray-500">Comparativo mensal de entradas e saídas</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-lg transform rotate-1 scale-105 blur-sm"></div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" opacity={0.6} />
                  <XAxis dataKey="month" stroke="#6366f1" fontSize={10} />
                  <YAxis stroke="#6366f1" fontSize={10} />
                  <Tooltip
                    formatter={(value, name) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      name === 'receita' ? 'Receita' : 'Despesas'
                    ]}
                    labelStyle={{ color: "#333", fontSize: "11px" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                      fontSize: "11px",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Bar
                    dataKey="receita"
                    fill="url(#revenue3DGradient)"
                    radius={[6, 6, 0, 0]}
                    className="drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300"
                  />
                  <Bar
                    dataKey="despesas"
                    fill="url(#expense3DGradient)"
                    radius={[6, 6, 0, 0]}
                    className="drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="revenue3DGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="50%" stopColor="#1d4ed8" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="expense3DGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                      <stop offset="50%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Distribution 3D */}
        <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white via-purple-50 to-pink-50 backdrop-blur-sm transform perspective-1000">
          <CardHeader className="pb-2">
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm font-bold">
              🥧 Distribuição de Despesas
            </CardTitle>
            <p className="text-xs text-gray-500">Categorização dos gastos por área</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-lg transform -rotate-1 scale-105 blur-sm"></div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={expenseDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={20}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fontSize={9}
                    className="drop-shadow-xl"
                  >
                    {expenseDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                        style={{
                          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))"
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                      fontSize: "11px",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart 3D */}
      <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white via-green-50 to-blue-50 backdrop-blur-sm transform perspective-1000">
        <CardHeader className="pb-2">
          <CardTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent text-sm font-bold">
            📈 Fluxo de Caixa - Últimos 30 Dias
          </CardTitle>
          <p className="text-xs text-gray-500">Evolução das entradas e saídas ao longo do mês</p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-lg transform rotate-0.5 scale-105 blur-sm"></div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cashFlow} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e0f2fe" opacity={0.6} />
                <XAxis dataKey="day" stroke="#0891b2" fontSize={10} />
                <YAxis stroke="#0891b2" fontSize={10} />
                <Tooltip
                  formatter={(value, name) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    name === 'entrada' ? 'Entrada' : 'Saída'
                  ]}
                  labelStyle={{ color: "#333", fontSize: "11px" }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                    fontSize: "11px",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="entrada"
                  stroke="url(#entrada3DGradient)"
                  strokeWidth={4}
                  dot={{ 
                    fill: "#059669", 
                    strokeWidth: 2, 
                    r: 4,
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: "#10b981",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
                  }}
                  className="drop-shadow-lg"
                />
                <Line
                  type="monotone"
                  dataKey="saida"
                  stroke="url(#saida3DGradient)"
                  strokeWidth={4}
                  dot={{ 
                    fill: "#dc2626", 
                    strokeWidth: 2, 
                    r: 4,
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: "#ef4444",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
                  }}
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id="entrada3DGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="50%" stopColor="#059669" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="saida3DGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="50%" stopColor="#dc2626" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardChart;