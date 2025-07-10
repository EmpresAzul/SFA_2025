import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";
import type { GastosFixos } from "@/hooks/usePontoEquilibrio";

interface GastosFixosEstimativaProps {
  values: GastosFixos;
  onChange: (values: GastosFixos) => void;
}

const GastosFixosEstimativa: React.FC<GastosFixosEstimativaProps> = ({
  values,
  onChange,
}) => {
  const handleChange = (field: keyof GastosFixos, newValue: number) => {
    onChange({
      ...values,
      [field]: newValue,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
          <Building className="w-5 h-5" />
          Passo 3: Estimativa dos Gastos Fixos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label
            htmlFor="gastosFixosMensais"
            className="text-sm font-medium text-gray-700"
          >
            Gastos Fixos Mensais (excluindo Pró-Labore)
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <Input
              id="gastosFixosMensais"
              type="number"
              value={values.gastosFixosMensais}
              onChange={(e) =>
                handleChange(
                  "gastosFixosMensais",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="pl-10 text-right"
              placeholder="8.000,00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Aluguel, funcionários, contabilidade, internet, etc.
          </p>
        </div>

        <div>
          <Label
            htmlFor="proLabore"
            className="text-sm font-medium text-gray-700"
          >
            Pró-labore Retirado
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <Input
              id="proLabore"
              type="number"
              value={values.proLabore}
              onChange={(e) =>
                handleChange("proLabore", parseFloat(e.target.value) || 0)
              }
              className="pl-10 text-right"
              placeholder="5.000,00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Valor atual do pró-labore dos sócios
          </p>
        </div>

        <div className="border-t pt-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">
              Total de Gastos Fixos:
            </span>
            <span className="font-bold text-lg text-blue-600">
              R${" "}
              {(values.gastosFixosMensais + values.proLabore).toLocaleString(
                "pt-BR",
                { minimumFractionDigits: 2 },
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GastosFixosEstimativa;
