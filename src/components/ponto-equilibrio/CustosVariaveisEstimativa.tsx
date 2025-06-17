
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Percent } from 'lucide-react';
import type { CustosVariaveis } from '@/hooks/usePontoEquilibrio';

interface CustosVariaveisEstimativaProps {
  values: CustosVariaveis;
  onChange: (values: CustosVariaveis) => void;
}

const CustosVariaveisEstimativa: React.FC<CustosVariaveisEstimativaProps> = ({ values, onChange }) => {
  const handleChange = (field: keyof CustosVariaveis, newValue: number) => {
    onChange({
      ...values,
      [field]: newValue
    });
  };

  const totalPercentual = Object.values(values).reduce((sum, value) => sum + value, 0);

  const campos = [
    { key: 'fornecedores' as keyof CustosVariaveis, label: 'Custo Fornecedores / Matéria-Prima / Terceirizações', placeholder: '25,0' },
    { key: 'impostos' as keyof CustosVariaveis, label: 'Impostos s/ Nota Fiscal', placeholder: '8,5' },
    { key: 'comissoes' as keyof CustosVariaveis, label: 'Comissão de Vendas', placeholder: '5,0' },
    { key: 'taxaCartao' as keyof CustosVariaveis, label: 'Taxa Cartão', placeholder: '3,0' },
    { key: 'outros' as keyof CustosVariaveis, label: 'Outros', placeholder: '2,0' },
    { key: 'lucratividade' as keyof CustosVariaveis, label: 'Lucratividade Desejada', placeholder: '15,0' }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
          <Percent className="w-5 h-5" />
          Passo 2: Estimativa dos percentuais de Custos Variáveis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {campos.map((campo) => (
          <div key={campo.key}>
            <Label htmlFor={campo.key} className="text-sm font-medium text-gray-700">
              {campo.label}
            </Label>
            <div className="relative mt-1">
              <Input
                id={campo.key}
                type="number"
                step="0.1"
                value={values[campo.key]}
                onChange={(e) => handleChange(campo.key, parseFloat(e.target.value) || 0)}
                className="pr-8 text-right"
                placeholder={campo.placeholder}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
        ))}
        
        <div className="border-t pt-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total de Custos Variáveis:</span>
            <span className={`font-bold text-lg ${totalPercentual > 100 ? 'text-red-600' : 'text-green-600'}`}>
              {totalPercentual.toFixed(1)}%
            </span>
          </div>
          {totalPercentual > 100 && (
            <p className="text-xs text-red-500 mt-1">
              ⚠️ Total de custos variáveis não pode exceder 100%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustosVariaveisEstimativa;
