import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import type { DREData } from "@/hooks/useDRECalculations";

interface DRESummaryCardsProps {
  dreData: DREData;
}

const DRESummaryCards: React.FC<DRESummaryCardsProps> = ({
  dreData,
}) => {
  return (
    <div className="dre-summary-cards">
      {/* Card Receita Bruta */}
      <Card className="dre-card bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600">
        <CardContent className="dre-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="dre-card-title">Receita Bruta</p>
              <p className="dre-card-value">
                {formatCurrency(dreData.receitaBrutaVendas)}
              </p>
            </div>
            <div className="dre-card-icon">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Receita Líquida */}
      <Card className="dre-card bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600">
        <CardContent className="dre-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="dre-card-title">Receita Líquida</p>
              <p className="dre-card-value">
                {formatCurrency(dreData.receitaLiquidaVendas)}
              </p>
            </div>
            <div className="dre-card-icon">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Resultado Operacional */}
      <Card className="dre-card bg-gradient-to-br from-red-400 via-red-500 to-rose-600">
        <CardContent className="dre-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="dre-card-title">Resultado Operacional</p>
              <p className="dre-card-value">
                {formatCurrency(dreData.resultadoOperacionalEBIT)}
              </p>
            </div>
            <div className="dre-card-icon">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Lucro Líquido */}
      <Card className="dre-card bg-gradient-to-br from-red-500 via-red-600 to-rose-700">
        <CardContent className="dre-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="dre-card-title">Lucro Líquido</p>
              <p className="dre-card-value">
                {formatCurrency(dreData.lucroLiquidoExercicio)}
              </p>
            </div>
            <div className="dre-card-icon">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DRESummaryCards;
