
import React from 'react';
import { formatNumberToDisplay } from '@/utils/currency';

interface PrecificacaoCalculationsProps {
  custoTotal: number;
  margemLucro: number;
  precoFinal: number;
  lucroValor: number;
}

const PrecificacaoCalculations: React.FC<PrecificacaoCalculationsProps> = ({
  custoTotal,
  margemLucro,
  precoFinal,
  lucroValor,
}) => {
  return (
    <div className="border-t pt-3 space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">Custo Total:</span>
        <span className="text-lg font-semibold">{formatNumberToDisplay(custoTotal)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Margem de Lucro ({margemLucro}%):</span>
        <span className="text-lg font-semibold text-green-600">{formatNumberToDisplay(lucroValor)}</span>
      </div>
      <div className="flex justify-between items-center border-t pt-2">
        <span className="font-bold">Preço Final:</span>
        <span className="text-xl font-bold text-blue-600">{formatNumberToDisplay(precoFinal)}</span>
      </div>
    </div>
  );
};

export default PrecificacaoCalculations;
