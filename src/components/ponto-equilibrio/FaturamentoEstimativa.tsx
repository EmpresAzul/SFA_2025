
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TrendingUp } from 'lucide-react';

interface FaturamentoEstimativaProps {
  value: number;
  onChange: (value: number) => void;
}

const FaturamentoEstimativa: React.FC<FaturamentoEstimativaProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
          <TrendingUp className="w-5 h-5" />
          Passo 1: Estimativa do Faturamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="faturamento" className="text-sm font-medium text-gray-700">
            Faturamento Mensal Estimado
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
            <Input
              id="faturamento"
              type="number"
              value={value}
              onChange={handleChange}
              className="pl-10 text-right"
              placeholder="0,00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Insira o faturamento mensal estimado ou atual do seu negócio
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaturamentoEstimativa;
