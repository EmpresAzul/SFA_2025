
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp } from 'lucide-react';
import { formatNumberToDisplay } from '@/utils/currency';

interface ProdutoCalculationsResultsProps {
  custoTotal: number;
  margemLucro: number;
  totalTaxasPercentual: number;
  precoFinal: number;
  lucroValor: number;
  valorTaxas: number;
}

const ProdutoCalculationsResults: React.FC<ProdutoCalculationsResultsProps> = ({
  custoTotal,
  margemLucro,
  totalTaxasPercentual,
  precoFinal,
  lucroValor,
  valorTaxas,
}) => {
  const percentualTotal = margemLucro + totalTaxasPercentual;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
          <Calculator className="w-5 h-5" />
          📊 Resultado dos Cálculos - Produto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
              <span className="text-gray-700">Custo Total:</span>
              <span className="font-semibold text-gray-900">{formatNumberToDisplay(custoTotal)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
              <span className="text-gray-700">Margem de Lucro ({margemLucro}%):</span>
              <span className="font-semibold text-green-600">{formatNumberToDisplay(lucroValor - valorTaxas)}</span>
            </div>
            
            {totalTaxasPercentual > 0 && (
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="text-gray-700">Valor das Taxas ({totalTaxasPercentual.toFixed(2)}%):</span>
                <span className="font-semibold text-purple-600">{formatNumberToDisplay(valorTaxas)}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
              <span className="text-gray-700">Percentual Total:</span>
              <span className="font-semibold text-blue-600">{percentualTotal.toFixed(2)}%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-300">
              <span className="text-green-800 font-medium">💰 Preço Final:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-700">{formatNumberToDisplay(precoFinal)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-300">
              <span className="text-blue-800 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Lucro Total:
              </span>
              <span className="text-xl font-bold text-blue-700">{formatNumberToDisplay(lucroValor)}</span>
            </div>
          </div>
        </div>

        {totalTaxasPercentual > 0 && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 text-center">
              💡 Margem de lucro ({margemLucro}%) + Taxas adicionais ({totalTaxasPercentual.toFixed(2)}%) = {percentualTotal.toFixed(2)}% total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProdutoCalculationsResults;
