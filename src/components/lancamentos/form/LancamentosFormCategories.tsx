import React from "react";
import { SelectItem } from "@/components/ui/select";

// Categorias do DRE organizadas conforme estrutura oficial
const categoriasReceita = {
  "RECEITA BRUTA DE VENDAS": [
    "Venda de Produtos",
    "Venda de Mercadorias",
    "Prestação de Serviços",
  ],
  "RESULTADO FINANCEIRO": [
    "Receitas Financeiras",
  ],
  "OUTRAS RECEITAS E DESPESAS (NÃO OPERACIONAIS)": [
    "Outras Receitas Não Operacionais",
  ],
};

const categoriasDespesa = {
  "DEDUÇÕES DA RECEITA BRUTA": [
    "Devoluções e Abatimentos",
    "Vendas Canceladas", 
    "Descontos Incondicionais Concedidos",
    "Impostos sobre Vendas (ICMS, PIS, COFINS)",
  ],
  "CUSTO DOS PRODUTOS/SERVIÇOS/MERCADORIAS VENDIDAS": [
    "Custo da Matéria-Prima / Mercadoria",
    "Custo da Mão de Obra Direta",
    "Custos Indiretos de Fabricação/Prestação (CIF/CIP)",
    "Quebras e Perdas",
  ],
  "DESPESAS COM VENDAS": [
    "Comissões de Vendas",
    "Marketing e Publicidade",
    "Fretes e Entregas",
    "Promoções e Eventos",
    "Material de Vendas",
  ],
  "DESPESAS ADMINISTRATIVAS": [
    "Salários Administrativos",
    "Encargos Sociais",
    "Aluguel",
    "Energia Elétrica",
    "Telefone e Internet",
    "Material de Escritório",
    "Contabilidade",
    "Honorários Profissionais",
    "Seguros",
    "Manutenção e Conservação",
    "Limpeza e Conservação",
    "Viagens e Hospedagem",
  ],
  "OUTRAS DESPESAS OPERACIONAIS": [
    "Depreciação",
    "Amortização",
    "PCLD (Provisão para Créditos de Liquidação Duvidosa)",
    "Provisões Diversas",
  ],
  "DESPESAS FINANCEIRAS": [
    "Juros Pagos",
    "Taxas Bancárias",
    "IOF",
    "Descontos Concedidos",
    "Variações Monetárias Passivas",
  ],
  "OUTRAS DESPESAS NÃO OPERACIONAIS": [
    "Perdas com Venda de Imobilizado",
    "Multas e Penalidades",
    "Despesas Extraordinárias",
  ],
  "IMPOSTO DE RENDA E CONTRIBUIÇÃO SOCIAL": [
    "Imposto de Renda Pessoa Jurídica (IRPJ)",
    "Contribuição Social sobre o Lucro Líquido (CSLL)",
  ],
  "PARTICIPAÇÕES": [
    "Participações de Empregados",
    "Participações de Administradores",
    "Participações Estatutárias",
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
