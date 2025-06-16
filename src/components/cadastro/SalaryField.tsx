
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';

interface SalaryFieldProps {
  salario: number;
  onSalaryChange: (value: string) => void;
  showSalary: boolean;
}

export const SalaryField: React.FC<SalaryFieldProps> = ({
  salario,
  onSalaryChange,
  showSalary
}) => {
  if (!showSalary) return null;

  return (
    <div>
      <Label htmlFor="salario" className="text-fluxo-blue-900 font-medium">
        Salário
      </Label>
      <Input
        id="salario"
        value={formatCurrency(salario)}
        onChange={(e) => onSalaryChange(e.target.value)}
        placeholder="R$ 0,00"
      />
    </div>
  );
};
