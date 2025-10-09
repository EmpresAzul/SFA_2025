import React from "react";
import { FileText, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-white";

interface DREHeaderProps {
  periodo: string;
  setPeriodo: (periodo: string) => void;
  lancamentosCount: number;
}

const DREHeader: React.FC<DREHeaderProps> = ({
  periodo,
  setPeriodo,
  lancamentosCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-fluxo-black-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-fluxo-blue-600" />
          Demonstração do Resultado do Exercício (DRE)
        </h1>
        <p className="text-fluxo-black-600 mt-2">
          Análise baseada em {lancamentosCount} lançamentos do período
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-fluxo-blue-600" />
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes-atual">Mês Atual</SelectItem>
              <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
              <SelectItem value="ano-atual">Ano Atual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DREHeader;
