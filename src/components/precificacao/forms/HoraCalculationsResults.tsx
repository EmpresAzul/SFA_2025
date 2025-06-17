
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface HoraCalculationsResultsProps {
  diasTrabalhados: string;
  horasPorDia: string;
  horasTrabalhadasMes: number;
  valorHoraTrabalhada: number;
  valorTaxasHora?: number;
  valorHoraFinal: number;
  valorDiaTrabalhado: number;
  totalTaxasPercentual?: number;
}

const HoraCalculationsResults: React.FC<HoraCalculationsResultsProps> = ({
  diasTrabalhados,
  horasPorDia,
  horasTrabalhadasMes,
  valorHoraTrabalhada,
  valorTaxasHora = 0,
  valorHoraFinal,
  valorDiaTrabalhado,
  totalTaxasPercentual = 0,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-green-800">
          <Calculator className="w-5 h-5" />
          📊 Resultados dos Cálculos
        </CardTitle>
        <p className="text-sm text-green-600">
          Valores calculados automaticamente com base nos dados informados
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Horas trabalhadas/mês:</span>
              </div>
              <span className="font-semibold text-blue-600">
                {horasTrabalhadasMes.toFixed(1)}h
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Valor base da hora:</span>
              </div>
              <span className="font-semibold text-green-600">
                {formatCurrency(valorHoraTrabalhada)}
              </span>
            </div>

            {valorTaxasHora > 0 && totalTaxasPercentual > 0 && (
              <>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Taxas adicionais ({totalTaxasPercentual.toFixed(2)}%):</span>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {formatCurrency(valorTaxasHora)}
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border-2 border-emerald-300">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <span className="text-base font-semibold text-emerald-800">Valor final da hora:</span>
              </div>
              <span className="text-xl font-bold text-emerald-700">
                {formatCurrency(valorHoraFinal)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border-2 border-blue-300">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-700" />
                <span className="text-base font-semibold text-blue-800">Valor por dia trabalhado:</span>
              </div>
              <span className="text-xl font-bold text-blue-700">
                {formatCurrency(valorDiaTrabalhado)}
              </span>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 Composição do Valor:</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Valor base: {formatCurrency(valorHoraTrabalhada)}</li>
                {valorTaxasHora > 0 && (
                  <li>• Taxas adicionais: {formatCurrency(valorTaxasHora)} ({totalTaxasPercentual.toFixed(2)}%)</li>
                )}
                <li className="font-semibold">• Total: {formatCurrency(valorHoraFinal)}</li>
              </ul>
            </div>
          </div>
        </div>

        {(parseFloat(diasTrabalhados) === 0 || parseFloat(horasPorDia) === 0) && (
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              ⚠️ Preencha os dias trabalhados e horas por dia para ver os cálculos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HoraCalculationsResults;
