import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { Estoque } from "@/types/estoque";

interface EstoqueSummaryCardsProps {
  filteredEstoques: Estoque[];
}

export const EstoqueSummaryCards: React.FC<EstoqueSummaryCardsProps> = ({
  filteredEstoques,
}) => {
  const getTotalValue = () => {
    return filteredEstoques.reduce(
      (sum, estoque) => sum + estoque.valor_total,
      0,
    );
  };

  const getTotalItems = () => {
    return filteredEstoques.reduce(
      (sum, estoque) => sum + estoque.quantidade,
      0,
    );
  };

  return (
    <div className="estoque-summary-cards">
      <Card className="estoque-card bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
        <CardContent className="estoque-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="estoque-card-title">Total de Itens</p>
              <p className="estoque-card-value">{filteredEstoques.length}</p>
              <p className="text-xs text-white/80">Itens no estoque</p>
            </div>
            <div className="estoque-card-icon">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="estoque-card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
        <CardContent className="estoque-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="estoque-card-title">Quantidade Total</p>
              <p className="estoque-card-value">{getTotalItems().toFixed(2)}</p>
              <p className="text-xs text-white/80">Unidades totais</p>
            </div>
            <div className="estoque-card-icon">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="estoque-card bg-gradient-to-br from-purple-400 to-purple-600 text-white">
        <CardContent className="estoque-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="estoque-card-title">Valor Total</p>
              <p className="estoque-card-value">R$ {getTotalValue().toFixed(2)}</p>
              <p className="text-xs text-white/80">Valor do estoque</p>
            </div>
            <div className="estoque-card-icon">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="estoque-card bg-gradient-to-br from-orange-400 to-orange-600 text-white">
        <CardContent className="estoque-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="estoque-card-title">Valor Médio</p>
              <p className="estoque-card-value">
                R$ {filteredEstoques.length > 0 ? (getTotalValue() / filteredEstoques.length).toFixed(2) : "0.00"}
              </p>
              <p className="text-xs text-white/80">Por item</p>
            </div>
            <div className="estoque-card-icon">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
