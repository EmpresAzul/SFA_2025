
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoriaData } from '@/types/fluxoCaixa';

interface CategoryChartProps {
  data: CategoriaData[];
  title: string;
  emptyMessage: string;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, title, emptyMessage }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="gradient-fluxo-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
