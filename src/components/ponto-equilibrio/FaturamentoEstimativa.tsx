import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";

interface FaturamentoEstimativaProps {
  value: number;
  onChange: (value: number) => void;
}

const FaturamentoEstimativa: React.FC<FaturamentoEstimativaProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
  };

  return (
    <div className="ponto-equilibrio-step">
      <div className="ponto-equilibrio-step-header">
        <div className="ponto-equilibrio-step-number">1</div>
        <div>
          <div className="ponto-equilibrio-step-title">Estimativa do Faturamento</div>
          <div className="ponto-equilibrio-step-description">Faturamento Mensal Estimado</div>
        </div>
      </div>
      <div className="ponto-equilibrio-input-group">
        <div>
          <Label className="ponto-equilibrio-input-label">
            Faturamento Mensal Estimado
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <Input
              type="number"
              value={value}
              onChange={handleChange}
              className="ponto-equilibrio-input pl-10 text-right"
              placeholder="0,00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Insira o faturamento mensal estimado ou atual do seu negócio
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaturamentoEstimativa;
