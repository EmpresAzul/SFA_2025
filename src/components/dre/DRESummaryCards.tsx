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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card Receita Bruta */}
      <Card className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Receita Bruta</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(dreData.receitaBrutaVendas)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Receita Líquida */}
      <Card className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Receita Líquida</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(dreData.receitaLiquidaVendas)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Resultado Operacional */}
      <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Resultado Operacional</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(dreData.resultadoOperacionalEBIT)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Lucro Líquido */}
      <Card className="bg-gradient-to-br from-red-400 via-red-500 to-rose-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Lucro Líquido</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(dreData.lucroLiquidoExercicio)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DRESummaryCards;
