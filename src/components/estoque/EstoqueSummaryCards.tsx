
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { Estoque } from '@/types/estoque';

interface EstoqueSummaryCardsProps {
  filteredEstoques: Estoque[];
}

export const EstoqueSummaryCards: React.FC<EstoqueSummaryCardsProps> = ({ filteredEstoques }) => {
  const getTotalValue = () => {
    return filteredEstoques.reduce((sum, estoque) => sum + estoque.valor_total, 0);
  };

  const getTotalItems = () => {
    return filteredEstoques.reduce((sum, estoque) => sum + estoque.quantidade, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total de Itens</p>
              <p className="text-xl font-bold">{filteredEstoques.length}</p>
            </div>
            <Package className="h-8 w-8 text-emerald-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Quantidade Total</p>
              <p className="text-xl font-bold">{getTotalItems().toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Valor Total</p>
              <p className="text-xl font-bold">R$ {getTotalValue().toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Valor Médio</p>
              <p className="text-xl font-bold">
                R$ {filteredEstoques.length > 0 ? (getTotalValue() / filteredEstoques.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
