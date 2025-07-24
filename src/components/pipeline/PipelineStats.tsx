import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign, Users } from "lucide-react";
import { Negocio } from "@/types/pipeline";
import { formatNumberToDisplay } from "@/utils/currency";

interface PipelineStatsProps {
  negocios: Negocio[];
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Total de Leads</CardTitle>
          <div className="p-2 bg-blue-500 rounded-lg">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Negócios Fechados</CardTitle>
          <div className="p-2 bg-green-500 rounded-lg">
            <Target className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.fechados}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Valor Total</CardTitle>
          <div className="p-2 bg-purple-500 rounded-lg">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{formatNumberToDisplay(stats.valorTotal)}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Taxa de Conversão</CardTitle>
          <div className="p-2 bg-orange-500 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            {stats.taxaConversao.toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};