
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface ProLaboreCalculadoProps {
  value: number;
}

const ProLaboreCalculado: React.FC<ProLaboreCalculadoProps> = ({ value }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
          <Calculator className="w-5 h-5" />
          Passo 5: Cálculo automático de pró-labore
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Pró-labore máximo possível com o faturamento atual:</p>
          <div className="text-3xl font-bold text-green-600">
            R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Calculado automaticamente com base nos parâmetros informados
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProLaboreCalculado;
