
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EnhancedCurrencyInput } from '@/components/ui/enhanced-currency-input';

interface HoraData {
  nome: string;
  proLabore: number;
  diasTrabalhados: string;
  horasPorDia: string;
}

interface HoraFormFieldsProps {
  horaData: HoraData;
  onUpdateHora: (updates: Partial<HoraData>) => void;
}

const HoraFormFields: React.FC<HoraFormFieldsProps> = ({
  horaData,
  onUpdateHora,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="nome-hora">Nome *</Label>
        <Input
          id="nome-hora"
          value={horaData.nome}
          onChange={(e) => onUpdateHora({ nome: e.target.value })}
          placeholder="Digite o nome"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pro-labore">Pró-labore *</Label>
        <EnhancedCurrencyInput
          id="pro-labore"
          value={horaData.proLabore}
          onChange={(numericValue) => onUpdateHora({ proLabore: numericValue })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dias-trabalhados">Qtde. dias trabalhados no mês *</Label>
        <Input
          id="dias-trabalhados"
          type="number"
          min="1"
          max="31"
          value={horaData.diasTrabalhados}
          onChange={(e) => onUpdateHora({ diasTrabalhados: e.target.value })}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="horas-por-dia">Qtde. horas trabalhadas por dia *</Label>
        <Input
          id="horas-por-dia"
          type="number"
          min="1"
          max="24"
          step="0.5"
          value={horaData.horasPorDia}
          onChange={(e) => onUpdateHora({ horasPorDia: e.target.value })}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default HoraFormFields;
