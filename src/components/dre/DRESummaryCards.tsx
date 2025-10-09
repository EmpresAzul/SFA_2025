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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {/* Card Receita Bruta */}
      <Card className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">Receita Bruta</p>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-white">
                {formatCurrency(dreData.receitaBrutaVendas)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Receita Líquida */}
      <Card className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">Receita Líquida</p>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-white">
                {formatCurrency(dreData.receitaLiquidaVendas)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Resultado Operacional */}
      <Card className={`bg-gradient-to-br ${
        dreData.resultadoOperacionalEBIT >= 0 
          ? "from-red-400 via-red-500 to-rose-600" 
          : "from-red-400 via-red-500 to-rose-600"
      } border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
        <CardContent className="p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">Resultado Operacional</p>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-white">
                {formatCurrency(dreData.resultadoOperacionalEBIT)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Lucro Líquido */}
      <Card className={`bg-gradient-to-br ${
        dreData.lucroLiquidoExercicio >= 0 
          ? "from-red-500 via-red-600 to-rose-700" 
          : "from-red-500 via-red-600 to-rose-700"
      } border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
        <CardContent className="p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2">Lucro Líquido</p>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-white">
                {formatCurrency(dreData.lucroLiquidoExercicio)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DRESummaryCards;
