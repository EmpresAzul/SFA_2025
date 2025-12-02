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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total de Itens */}
      <Card className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Total de Itens</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{totalItens}</p>
              <p className="text-xs text-white/80">Todos os itens cadastrados</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produtos */}
      <Card className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Produtos</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{totalProdutos}</p>
              <p className="text-xs text-white/80">Produtos cadastrados</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Serviços */}
      <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Serviços</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{totalServicos}</p>
              <p className="text-xs text-white/80">Serviços cadastrados</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Wrench className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horas */}
      <Card className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Horas</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{totalHoras}</p>
              <p className="text-xs text-white/80">Horas cadastradas</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrecificacaoSummaryCards;
