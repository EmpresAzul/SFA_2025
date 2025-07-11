import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import DRELineItem from "./DRELineItem";
import type { DREData } from "@/hooks/useDRECalculations";

interface DREReportProps {
  dreData: DREData;
  periodoLabel: string;
}

const DREReport: React.FC<DREReportProps> = ({
  dreData,
  periodoLabel,
}) => {
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="w-6 h-6" />
          DRE - {periodoLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {/* RECEITA OPERACIONAL BRUTA */}
          <div className="bg-green-50 border-b-2 border-green-200 p-4">
            <h3 className="font-bold text-green-800 text-lg mb-2">
              RECEITA OPERACIONAL BRUTA
            </h3>
          </div>
          <DRELineItem
            label="Receitas Operacionais"
            value={dreData.receitaOperacionalBruta}
            detalhes={dreData.detalhamento.receitasOperacionais}
            level={1}
          />

          {/* DEDUÇÕES */}
          <div className="bg-red-50 border-b border-red-200 p-4">
            <h3 className="font-bold text-red-800">
              (-) DEDUÇÕES DA RECEITA BRUTA
            </h3>
          </div>
          <DRELineItem
            label="Deduções e Impostos"
            value={dreData.deducoesReceitaBruta}
            isNegative
            detalhes={dreData.detalhamento.deducoes}
            level={1}
          />

          {/* RECEITA LÍQUIDA */}
          <DRELineItem
            label="= RECEITA OPERACIONAL LÍQUIDA"
            value={dreData.receitaOperacionalLiquida}
            isSubtotal
          />

          {/* CUSTOS */}
          <div className="bg-orange-50 border-b border-orange-200 p-4">
            <h3 className="font-bold text-orange-800">(-) CUSTOS DAS VENDAS</h3>
          </div>
          <DRELineItem
            label="Custos Diretos"
            value={dreData.custosVendas}
            isNegative
            detalhes={dreData.detalhamento.custos}
            level={1}
          />

          {/* RESULTADO BRUTO */}
          <DRELineItem
            label="= RESULTADO OPERACIONAL BRUTO"
            value={dreData.resultadoOperacionalBruto}
            isSubtotal
          />

          {/* DESPESAS OPERACIONAIS */}
          <div className="bg-blue-50 border-b border-blue-200 p-4">
            <h3 className="font-bold text-blue-800">
              (-) DESPESAS OPERACIONAIS
            </h3>
          </div>
          <DRELineItem
            label="Despesas Operacionais"
            value={dreData.despesasOperacionais}
            isNegative
            detalhes={dreData.detalhamento.despesasOperacionais}
            level={1}
          />

          {/* DESPESAS FINANCEIRAS */}
          <div className="bg-purple-50 border-b border-purple-200 p-4">
            <h3 className="font-bold text-purple-800">
              (-) DESPESAS FINANCEIRAS
            </h3>
          </div>
          <DRELineItem
            label="Despesas Financeiras"
            value={dreData.despesasFinanceiras}
            isNegative
            detalhes={dreData.detalhamento.despesasFinanceiras}
            level={1}
          />

          {/* RESULTADO OPERACIONAL */}
          <DRELineItem
            label="= RESULTADO OPERACIONAL"
            value={dreData.resultadoOperacional}
            isSubtotal
          />

          {/* OUTRAS RECEITAS */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <h3 className="font-bold text-gray-800">
              OUTRAS RECEITAS E DESPESAS
            </h3>
          </div>
          <DRELineItem
            label="Outras Receitas"
            value={Object.values(dreData.detalhamento.outrasReceitas).reduce(
              (a, b) => a + b,
              0,
            )}
            detalhes={dreData.detalhamento.outrasReceitas}
            level={1}
          />
          <DRELineItem
            label="(-) Outras Despesas"
            value={Object.values(dreData.detalhamento.outrasDespesas).reduce(
              (a, b) => a + b,
              0,
            )}
            isNegative
            detalhes={dreData.detalhamento.outrasDespesas}
            level={1}
          />

          {/* RESULTADO ANTES IR */}
          <DRELineItem
            label="= RESULTADO ANTES DO IR E CSLL"
            value={dreData.resultadoAntesIR}
            isSubtotal
          />

          {/* PROVISÕES */}
          <div className="bg-yellow-50 border-b border-yellow-200 p-4">
            <h3 className="font-bold text-yellow-800">
              (-) Provisão para IR e CSLL
            </h3>
          </div>
          <DRELineItem
            label="(-) Provisão IR/CSLL (15%)"
            value={dreData.provisaoIR}
            isNegative
            level={1}
          />

          {/* LUCRO LÍQUIDO */}
          <DRELineItem
            label="= RESULTADO LÍQUIDO DO EXERCÍCIO"
            value={dreData.lucroLiquido}
            isTotal
            
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DREReport;
