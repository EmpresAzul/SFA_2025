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
    <div className="crm-summary-cards">
      <Card className="crm-card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
        <CardContent className="crm-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="crm-card-title">Total de Leads</p>
              <p className="crm-card-value">{stats.total}</p>
              <p className="text-xs text-white/80">Leads cadastrados</p>
            </div>
            <div className="crm-card-icon">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="crm-card bg-gradient-to-br from-green-400 to-green-600 text-white">
        <CardContent className="crm-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="crm-card-title">Negócios Fechados</p>
              <p className="crm-card-value">{stats.fechados}</p>
              <p className="text-xs text-white/80">Vendas concluídas</p>
            </div>
            <div className="crm-card-icon">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="crm-card bg-gradient-to-br from-purple-400 to-purple-600 text-white">
        <CardContent className="crm-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="crm-card-title">Valor Total</p>
              <p className="crm-card-value">{formatNumberToDisplay(stats.valorTotal)}</p>
              <p className="text-xs text-white/80">Valor dos negócios</p>
            </div>
            <div className="crm-card-icon">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="crm-card bg-gradient-to-br from-orange-400 to-orange-600 text-white">
        <CardContent className="crm-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="crm-card-title">Taxa de Conversão</p>
              <p className="crm-card-value">{stats.taxaConversao.toFixed(1)}%</p>
              <p className="text-xs text-white/80">Eficiência de vendas</p>
            </div>
            <div className="crm-card-icon">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};