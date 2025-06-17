
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumberToDisplay } from '@/utils/currency';

interface HoraCalculationsResultsProps {
  diasTrabalhados: string;
  horasPorDia: string;
  horasTrabalhadasMes: number;
  valorHoraTrabalhada: number;
  valorDiaTrabalhado: number;
}

const HoraCalculationsResults: React.FC<HoraCalculationsResultsProps> = ({
  diasTrabalhados,
  horasPorDia,
  horasTrabalhadasMes,
  valorHoraTrabalhada,
  valorDiaTrabalhado,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resumo dos Cálculos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Quantidade de dias trabalhados no mês:</span>
              <span className="font-semibold">{diasTrabalhados} dias</span>
            </div>
            <div className="flex justify-between">
              <span>Quantidade de horas trabalhadas no mês:</span>
              <span className="font-semibold">{horasTrabalhadasMes} horas</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Valor da hora trabalhada:</span>
              <span className="font-semibold text-green-600">{formatNumberToDisplay(valorHoraTrabalhada)}</span>
            </div>
            <div className="flex justify-between">
              <span>Valor do dia trabalhado:</span>
              <span className="font-semibold text-green-600">{formatNumberToDisplay(valorDiaTrabalhado)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HoraCalculationsResults;
