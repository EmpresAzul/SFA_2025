import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { FluxoDiario } from "@/types/fluxoCaixa";

interface DailyFlowChartProps {
  data: FluxoDiario[];
  periodoLabel: string;
}

export const DailyFlowChart: React.FC<DailyFlowChartProps> = ({
  data,
  periodoLabel,
}) => {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 mb-8">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Fluxo de Caixa Diário - {periodoLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="receitasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
              </linearGradient>
              <linearGradient id="despesasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
            <XAxis 
              dataKey="data" 
              stroke="#64748b" 
              fontSize={12}
              fontWeight={500}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              fontWeight={500}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                name === 'receitas' ? '💚 Receitas' : '❤️ Despesas'
              ]}
              labelStyle={{ color: "#1e293b", fontWeight: 600 }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                backdropFilter: "blur(10px)",
              }}
            />
            <Bar
              dataKey="receitas"
              fill="url(#receitasGradient)"
              radius={[6, 6, 0, 0]}
              name="receitas"
            />
            <Bar
              dataKey="despesas"
              fill="url(#despesasGradient)"
              radius={[6, 6, 0, 0]}
              name="despesas"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
