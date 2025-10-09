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
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          <span className="break-words">Demonstração do Resultado do Exercício (DRE) - {periodoLabel}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {/* RECEITA BRUTA DE VENDAS */}
          <div className="bg-gradient-to-r from-emerald-100 to-green-100 border-b border-emerald-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-emerald-800 text-xs sm:text-sm lg:text-base">
              RECEITA BRUTA DE VENDAS
            </h3>
          </div>
          <DRELineItem
            label="Venda de Produtos"
            value={dreData.vendaProdutos}
            detalhes={dreData.detalhamento.vendaProdutos}
            level={1}
          />
          <DRELineItem
            label="Venda de Mercadorias"
            value={dreData.vendaMercadorias}
            detalhes={dreData.detalhamento.vendaMercadorias}
            level={1}
          />
          <DRELineItem
            label="Prestação de Serviços"
            value={dreData.prestacaoServicos}
            detalhes={dreData.detalhamento.prestacaoServicos}
            level={1}
          />

          {/* DEDUÇÕES DA RECEITA BRUTA */}
          <div className="bg-gradient-to-r from-red-100 to-rose-100 border-b border-red-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-red-800 text-xs sm:text-sm lg:text-base">
              (-) DEDUÇÕES DA RECEITA BRUTA
            </h3>
          </div>
          <DRELineItem
            label="(-) Devoluções e Abatimentos"
            value={dreData.devolucoes}
            isNegative
            detalhes={dreData.detalhamento.devolucoes}
            level={1}
          />
          <DRELineItem
            label="(-) Vendas Canceladas"
            value={dreData.vendasCanceladas}
            isNegative
            detalhes={dreData.detalhamento.vendasCanceladas}
            level={1}
          />
          <DRELineItem
            label="(-) Descontos Incondicionais Concedidos"
            value={dreData.descontosIncondicionais}
            isNegative
            detalhes={dreData.detalhamento.descontosIncondicionais}
            level={1}
          />
          <DRELineItem
            label="(-) Impostos sobre Vendas (ICMS, PIS, COFINS)"
            value={dreData.impostosVendas}
            isNegative
            detalhes={dreData.detalhamento.impostosVendas}
            level={1}
          />

          {/* RECEITA LÍQUIDA DE VENDAS */}
          <DRELineItem
            label="= RECEITA LÍQUIDA DE VENDAS"
            value={dreData.receitaLiquidaVendas}
            isSubtotal
          />

          {/* CUSTO DOS PRODUTOS/SERVIÇOS/MERCADORIAS VENDIDAS */}
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-orange-800 text-xs sm:text-sm lg:text-base">
              (-) CUSTO DOS PRODUTOS/SERVIÇOS/MERCADORIAS VENDIDAS (CPV/CSP/CMV)
            </h3>
          </div>
          <DRELineItem
            label="(-) Custo da Matéria-Prima / Mercadoria"
            value={dreData.custoMateriaPrima}
            isNegative
            detalhes={dreData.detalhamento.custoMateriaPrima}
            level={1}
          />
          <DRELineItem
            label="(-) Custo da Mão de Obra Direta"
            value={dreData.custoMaoObraDireta}
            isNegative
            detalhes={dreData.detalhamento.custoMaoObraDireta}
            level={1}
          />
          <DRELineItem
            label="(-) Custos Indiretos de Fabricação/Prestação (CIF/CIP)"
            value={dreData.custosIndiretosFabricacao}
            isNegative
            detalhes={dreData.detalhamento.custosIndiretosFabricacao}
            level={1}
          />
          <DRELineItem
            label="(-) Quebras e Perdas"
            value={dreData.quebrasEPerdas}
            isNegative
            detalhes={dreData.detalhamento.quebrasEPerdas}
            level={1}
          />

          {/* LUCRO BRUTO */}
          <DRELineItem
            label="= LUCRO BRUTO"
            value={dreData.lucroBruto}
            isSubtotal
          />

          {/* DESPESAS OPERACIONAIS */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-blue-800 text-xs sm:text-sm lg:text-base">
              (-) DESPESAS OPERACIONAIS
            </h3>
          </div>
          <DRELineItem
            label="(-) Despesas com Vendas"
            value={dreData.despesasVendas}
            isNegative
            detalhes={dreData.detalhamento.despesasVendas}
            level={1}
          />
          <DRELineItem
            label="(-) Despesas Administrativas"
            value={dreData.despesasAdministrativas}
            isNegative
            detalhes={dreData.detalhamento.despesasAdministrativas}
            level={1}
          />
          <DRELineItem
            label="(-) Outras Despesas Operacionais (ex: Depreciação/Amortização não produtiva, PCLD)"
            value={dreData.outrasDespesasOperacionais}
            isNegative
            detalhes={dreData.detalhamento.outrasDespesasOperacionais}
            level={1}
          />

          {/* EBIT */}
          <DRELineItem
            label="= RESULTADO OPERACIONAL ANTES DAS DESPESAS FINANCEIRAS E IMPOSTOS (EBIT)"
            value={dreData.resultadoOperacionalEBIT}
            isSubtotal
          />

          {/* RESULTADO FINANCEIRO */}
          <div className="bg-gradient-to-r from-purple-100 to-violet-100 border-b border-purple-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-purple-800 text-xs sm:text-sm lg:text-base">
              (+/-) RESULTADO FINANCEIRO
            </h3>
          </div>
          <DRELineItem
            label="Receitas Financeiras"
            value={dreData.receitasFinanceiras}
            detalhes={dreData.detalhamento.receitasFinanceiras}
            level={1}
          />
          <DRELineItem
            label="(-) Despesas Financeiras"
            value={dreData.despesasFinanceiras}
            isNegative
            detalhes={dreData.detalhamento.despesasFinanceiras}
            level={1}
          />

          {/* LAIR */}
          <DRELineItem
            label="= RESULTADO ANTES DOS IMPOSTOS SOBRE O LUCRO (LAIR)"
            value={dreData.resultadoAntesImpostosLAIR}
            isSubtotal
          />

          {/* OUTRAS RECEITAS E DESPESAS NÃO OPERACIONAIS */}
          <div className="bg-gradient-to-r from-slate-100 to-gray-100 border-b border-slate-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm lg:text-base">
              (+/-) OUTRAS RECEITAS E DESPESAS (NÃO OPERACIONAIS)
            </h3>
          </div>
          <DRELineItem
            label="Outras Receitas Não Operacionais (ex: Ganhos com venda de Imobilizado)"
            value={dreData.outrasReceitasNaoOperacionais}
            detalhes={dreData.detalhamento.outrasReceitasNaoOperacionais}
            level={1}
          />
          <DRELineItem
            label="(-) Outras Despesas Não Operacionais (ex: Perdas com venda de Imobilizado)"
            value={dreData.outrasDespesasNaoOperacionais}
            isNegative
            detalhes={dreData.detalhamento.outrasDespesasNaoOperacionais}
            level={1}
          />

          {/* RESULTADO AJUSTADO */}
          <DRELineItem
            label="= RESULTADO AJUSTADO ANTES DO IRPJ/CSLL"
            value={dreData.resultadoAjustadoAntesIRPJ}
            isSubtotal
          />

          {/* IRPJ E CSLL */}
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-b border-yellow-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-yellow-800 text-xs sm:text-sm lg:text-base">
              (-) IMPOSTO DE RENDA PESSOA JURÍDICA (IRPJ) E CONTRIBUIÇÃO SOCIAL SOBRE O LUCRO LÍQUIDO (CSLL)
            </h3>
          </div>
          <DRELineItem
            label="(-) Imposto de Renda Pessoa Jurídica (IRPJ)"
            value={dreData.impostoRenda}
            isNegative
            level={1}
          />
          <DRELineItem
            label="(-) Contribuição Social sobre o Lucro Líquido (CSLL)"
            value={dreData.contribuicaoSocial}
            isNegative
            level={1}
          />

          {/* PARTICIPAÇÕES */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-200 py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
            <h3 className="font-bold text-indigo-800 text-xs sm:text-sm lg:text-base">
              (-) PARTICIPAÇÕES
            </h3>
          </div>
          <DRELineItem
            label="(-) Participações de Empregados, Administradores, etc."
            value={dreData.participacoes}
            isNegative
            detalhes={dreData.detalhamento.participacoes}
            level={1}
          />

          {/* LUCRO LÍQUIDO DO EXERCÍCIO */}
          <DRELineItem
            label="= LUCRO LÍQUIDO DO EXERCÍCIO"
            value={dreData.lucroLiquidoExercicio}
            isTotal
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DREReport;
