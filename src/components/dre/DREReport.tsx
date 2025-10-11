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
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-4 sm:p-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg flex items-center gap-2 sm:gap-3 font-bold">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">Demonstração do Resultado do Exercício (DRE) - {periodoLabel}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {/* RECEITA BRUTA DE VENDAS */}
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-emerald-50 border-b border-emerald-200">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-emerald-800">
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
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-pink-50 border-b border-pink-200">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-red-700">
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
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-amber-50 border-b border-amber-200">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-orange-800">
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
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-blue-50 border-b border-blue-200">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-blue-800">
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
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-purple-50 border-b border-purple-200">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-purple-800">
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
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-slate-100 border-b border-slate-300">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-purple-800">
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
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-yellow-50 border-b border-yellow-200">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-yellow-800">
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
          <div className="py-2 sm:py-3 px-4 sm:px-6 bg-blue-50 border-b border-blue-200">
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-blue-800">
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
