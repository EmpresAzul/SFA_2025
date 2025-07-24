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
                  formatter={(value, name) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    name === 'receita' ? 'Receita' : 'Despesas'
                  ]}
                  labelStyle={{ color: "#333" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="receita"
                  fill="url(#revenueGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="despesas"
                  fill="url(#expenseGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.6} />
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  fontSize={10}
                >
                  {expenseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
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
                formatter={(value, name) => [
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  name === 'entrada' ? 'Entrada' : 'Saída'
                ]}
                labelStyle={{ color: "#333" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="entrada"
                stroke="#1e3a8a"
                strokeWidth={3}
                dot={{ fill: "#1e3a8a", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="saida"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: "#f87171" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardChart;