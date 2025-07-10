import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, DollarSign, Users } from "lucide-react";
import { Negocio } from "@/types/pipeline";
import { formatCurrency } from "@/utils/currency";

interface PipelineStatsProps {
  negocios: Negocio[];
}

export const PipelineStats: React.FC<PipelineStatsProps> = ({ negocios }) => {
  const stats = React.useMemo(() => {
    const total = negocios.length;
    const fechados = negocios.filter(n => n.status === 'fechado').length;
    const valorTotal = negocios.reduce((sum, n) => sum + (n.valor_negocio || 0), 0);
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Negócios Fechados</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.fechados}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.valorTotal)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.taxaConversao.toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};