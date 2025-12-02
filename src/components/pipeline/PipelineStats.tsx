import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign, Users } from "lucide-react";
import { Lead } from "@/types/pipeline";
import { formatNumberToDisplay } from "@/utils/currency";

interface PipelineStatsProps {
  negocios: Lead[];
}

export const PipelineStats: React.FC<PipelineStatsProps> = ({ negocios }) => {
  const stats = React.useMemo(() => {
    const total = negocios.length;
    const fechados = negocios.filter(n => n.status === 'fechado').length;
    
    // Valor total é rigorosamente a soma de TODOS os leads cadastrados
    const valorTotal = negocios.reduce((sum, negocio) => {
      const valor = negocio.valor_negocio || 0;
      return sum + valor;
    }, 0);
    
    const valorFechado = negocios
      .filter(n => n.status === 'fechado')
      .reduce((sum, n) => sum + (n.valor_negocio || 0), 0);
    
    const taxaConversao = total > 0 ? (fechados / total) * 100 : 0;

    return {
      total,
      fechados,
      valorTotal,
      valorFechado,
      taxaConversao,
    };
  }, [negocios]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Total de Leads</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-xs text-white/80">Leads cadastrados</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Negócios Fechados</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.fechados}</p>
              <p className="text-xs text-white/80">Vendas concluídas</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Valor Total</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{formatNumberToDisplay(stats.valorTotal)}</p>
              <p className="text-xs text-white/80">Valor dos negócios</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Taxa de Conversão</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.taxaConversao.toFixed(1)}%</p>
              <p className="text-xs text-white/80">Eficiência de vendas</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};