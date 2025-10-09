import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumberToDisplay } from "@/utils/currency";

interface SaldosBancariosSummaryProps {
  totalSaldo: number;
}

const SaldosBancariosSummary: React.FC<SaldosBancariosSummaryProps> = ({
  totalSaldo,
}) => {
  return (
    <Card className="saldos-summary-card bg-white border-0 shadow-lg mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1">Total Geral</h3>
            <p className="text-xs sm:text-sm text-gray-500">Saldo consolidado de todas as contas</p>
          </div>
          <div className="text-left sm:text-right">
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
              totalSaldo >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {formatNumberToDisplay(totalSaldo)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaldosBancariosSummary;