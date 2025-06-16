
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FluxoDiario } from '@/types/fluxoCaixa';

interface DailyFlowChartProps {
  data: FluxoDiario[];
  periodoLabel: string;
}

export const DailyFlowChart: React.FC<DailyFlowChartProps> = ({ data, periodoLabel }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="gradient-fluxo-text">Fluxo de Caixa Diário - {periodoLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
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
  );
};
