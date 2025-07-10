import React from "react";
import { SelectItem } from "@/components/ui/select";

// Categorias específicas do DRE organizadas por tipo
const categoriasReceita = {
  "Receitas Operacionais": [
    "Vendas de Produtos",
    "Vendas de Mercadorias",
    "Prestação de Serviços",
    "Outras Receitas Operacionais",
  ],
  "Receitas Financeiras": [
    "Juros Recebidos",
    "Aplicações Financeiras",
    "Descontos Obtidos",
    "Variações Monetárias Ativas",
  ],
  "Outras Receitas": ["Receitas Extraordinárias", "Venda de Ativos"],
};

const categoriasDespesa = {
  "Deduções da Receita": [
    "Devoluções de Vendas",
    "Abatimentos sobre Vendas",
    "ICMS sobre Vendas",
    "PIS/COFINS",
    "ISS",
    "Outros Impostos sobre Vendas",
  ],
  Custos: [
    "Custo dos Produtos Vendidos (CPV)",
    "Custo das Mercadorias Vendidas (CMV)",
    "Custo dos Serviços Prestados (CSP)",
    "Matéria-Prima",
    "Mão de Obra Direta",
    "Custos Indiretos de Fabricação",
  ],
  "Despesas Operacionais": [
    "Despesas com Vendas",
    "Comissões sobre Vendas",
    "Marketing e Publicidade",
    "Fretes e Entregas",
    "Despesas Administrativas",
    "Salários e Encargos",
    "Aluguel e Condomínio",
    "Energia Elétrica",
    "Telefone e Internet",
    "Material de Escritório",
    "Contabilidade",
    "Honorários Profissionais",
    "Seguros",
    "Manutenção e Conservação",
    "Depreciação",
  ],
  "Despesas Financeiras": [
    "Juros Pagos",
    "Taxas Bancárias",
    "IOF",
    "Descontos Concedidos",
    "Variações Monetárias Passivas",
  ],
  "Outras Despesas": [
    "Despesas Extraordinárias",
    "Provisões para Contingências",
  ],
};

interface LancamentosFormCategoriesProps {
  tipo: "receita" | "despesa";
}

const LancamentosFormCategories: React.FC<LancamentosFormCategoriesProps> = ({
  tipo,
}) => {
  const categorias = tipo === "receita" ? categoriasReceita : categoriasDespesa;

  return (
    <>
      {Object.entries(categorias).map(([grupo, items]) => (
        <div key={grupo}>
          <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
            {grupo}
          </div>
          {items.map((categoria) => (
            <SelectItem key={categoria} value={categoria}>
              {categoria}
            </SelectItem>
          ))}
        </div>
      ))}
    </>
  );
};

export default LancamentosFormCategories;
