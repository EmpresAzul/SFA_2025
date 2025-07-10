import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";
import { useSaldosBancarios } from "@/hooks/useSaldosBancarios";

const SaldoBancarioSummaryCard: React.FC = () => {
  const { useQuery: useSaldosQuery } = useSaldosBancarios();
  const { data: saldos, isLoading } = useSaldosQuery();

  const saldoTotal =
    (saldos as any[])?.reduce((total, saldo) => total + (saldo.saldo || 0), 0) || 0;
  const quantidadeBancos = (saldos as any[])?.length || 0;

  if (isLoading) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg animate-pulse">
        <CardContent className="p-6">
          <div className="h-24 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          <Wallet className="w-5 h-5 text-blue-600" />
          💰 Resumo dos Saldos Bancários
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 mb-1">
              Saldo Total Consolidado
            </p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              R${" "}
              {saldoTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">Distribuído em</p>
            </div>
            <p className="text-xl font-semibold text-blue-600">
              {quantidadeBancos} {quantidadeBancos === 1 ? "banco" : "bancos"}
            </p>
          </div>
        </div>

        {saldoTotal > 0 && (
          <div className="mt-4 p-3 bg-white/60 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              💡 Saldo atualizado com base nos registros mais recentes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SaldoBancarioSummaryCard;
