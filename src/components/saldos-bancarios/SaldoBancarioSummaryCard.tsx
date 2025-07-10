
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useSaldosBancarios } from "@/hooks/useSaldosBancarios";
import { formatNumberToDisplay } from "@/utils/currency";

const SaldoBancarioSummaryCard: React.FC = () => {
  const { loading, saldos } = useSaldosBancarios();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calcular métricas
  const saldoTotal = saldos.reduce((total, saldo) => total + saldo.saldo, 0);
  const totalBancos = saldos.length;
  
  // Encontrar maior e menor saldo
  const maiorSaldo = saldos.length > 0 ? Math.max(...saldos.map(s => s.saldo)) : 0;
  const menorSaldo = saldos.length > 0 ? Math.min(...saldos.map(s => s.saldo)) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatNumberToDisplay(saldoTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            Em {totalBancos} banco{totalBancos !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Bancos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBancos}</div>
          <p className="text-xs text-muted-foreground">
            Contas cadastradas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maior Saldo</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatNumberToDisplay(maiorSaldo)}
          </div>
          <p className="text-xs text-muted-foreground">
            Melhor posição
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menor Saldo</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatNumberToDisplay(menorSaldo)}
          </div>
          <p className="text-xs text-muted-foreground">
            Posição crítica
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaldoBancarioSummaryCard;
