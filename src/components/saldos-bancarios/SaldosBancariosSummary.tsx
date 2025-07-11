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
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Geral</h3>
            <p className="text-sm text-gray-500">Saldo consolidado de todas as contas</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${
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