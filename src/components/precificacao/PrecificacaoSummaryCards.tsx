import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wrench, Clock, TrendingUp } from "lucide-react";

interface PrecificacaoSummaryCardsProps {
  totalItens: number;
  totalProdutos: number;
  totalServicos: number;
  totalHoras: number;
}

const PrecificacaoSummaryCards: React.FC<PrecificacaoSummaryCardsProps> = ({
  totalItens,
  totalProdutos,
  totalServicos,
  totalHoras,
}) => {
  return (
    <div className="precificacao-summary-cards">
      {/* Total de Itens */}
      <Card className="precificacao-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardContent className="precificacao-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="precificacao-card-title">Total de Itens</p>
              <p className="precificacao-card-value">{totalItens}</p>
              <p className="text-xs text-white/80">Todos os itens cadastrados</p>
            </div>
            <div className="precificacao-card-icon">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produtos */}
      <Card className="precificacao-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="precificacao-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="precificacao-card-title">Produtos</p>
              <p className="precificacao-card-value">{totalProdutos}</p>
              <p className="text-xs text-white/80">Produtos cadastrados</p>
            </div>
            <div className="precificacao-card-icon">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Serviços */}
      <Card className="precificacao-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="precificacao-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="precificacao-card-title">Serviços</p>
              <p className="precificacao-card-value">{totalServicos}</p>
              <p className="text-xs text-white/80">Serviços cadastrados</p>
            </div>
            <div className="precificacao-card-icon">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horas */}
      <Card className="precificacao-card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardContent className="precificacao-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="precificacao-card-title">Horas</p>
              <p className="precificacao-card-value">{totalHoras}</p>
              <p className="text-xs text-white/80">Horas cadastradas</p>
            </div>
            <div className="precificacao-card-icon">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrecificacaoSummaryCards;
