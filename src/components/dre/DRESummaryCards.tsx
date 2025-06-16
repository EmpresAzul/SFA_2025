
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';
import type { DREData } from '@/hooks/useDRECalculations';

interface DRESummaryCardsProps {
  dreData: DREData;
  formatCurrency: (value: number) => string;
}

const DRESummaryCards: React.FC<DRESummaryCardsProps> = ({
  dreData,
  formatCurrency,
}) => {
  return (
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
  );
};

export default DRESummaryCards;
