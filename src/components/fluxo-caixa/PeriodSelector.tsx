import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Período</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mes-atual">Mês Atual</SelectItem>
          <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
          <SelectItem value="ultimos-3-meses">Últimos 3 Meses</SelectItem>
          <SelectItem value="ultimos-6-meses">Últimos 6 Meses</SelectItem>
          <SelectItem value="proximos-30-dias">Próximos 30 Dias</SelectItem>
          <SelectItem value="proximos-60-dias">Próximos 60 Dias</SelectItem>
          <SelectItem value="personalizado">Período Personalizado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
