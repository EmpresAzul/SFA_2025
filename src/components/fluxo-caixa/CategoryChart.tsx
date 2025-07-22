import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategoriaData } from "@/types/fluxoCaixa";

interface CategoryChartProps {
  data: CategoriaData[];
  title: string;
  emptyMessage: string;
}

// Paleta de cores vibrantes para os gráficos
const VIBRANT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF'
];

export const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  title,
  emptyMessage,
}) => {
  // Adicionar cores vibrantes aos dados se não tiverem
  const coloredData = data.map((item, index) => ({
    ...item,
    color: item.color || VIBRANT_COLORS[index % VIBRANT_COLORS.length]
  }));

  const isReceitas = title.includes('Receitas');
  const headerGradient = isReceitas 
    ? "bg-gradient-to-r from-emerald-500 to-green-600" 
    : "bg-gradient-to-r from-red-500 to-rose-600";

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className={`${headerGradient} text-white rounded-t-lg`}>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span className="text-2xl">{isReceitas ? '💚' : '❤️'}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {coloredData.length > 0 ? (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  {coloredData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.8}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={coloredData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={3}
                  label={({ name, percent }) =>
                    percent > 5 ? `${(percent * 100).toFixed(0)}%` : ''
                  }
                  labelLine={false}
                >
                  {coloredData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index})`}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legenda personalizada */}
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {coloredData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                    {entry.name}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    R$ {Number(entry.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-gray-500">
            <div className="text-6xl mb-4 opacity-20">
              {isReceitas ? '💚' : '❤️'}
            </div>
            <p className="text-center font-medium">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
