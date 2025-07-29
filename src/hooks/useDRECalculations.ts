import { useMemo } from "react";
import type { Lancamento } from "@/hooks/useLancamentos";

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

export interface DREData {
  // Receita Bruta de Vendas
  receitaBrutaVendas: number;
  vendaProdutos: number;
  vendaMercadorias: number;
  prestacaoServicos: number;
  
  // Deduções da Receita Bruta
  deducoesReceitaBruta: number;
  devolucoes: number;
  vendasCanceladas: number;
  descontosIncondicionais: number;
  impostosVendas: number;
  
  // Receita Líquida
  receitaLiquidaVendas: number;
  
  // Custos
  custoProdutosServicosMercadorias: number;
  custoMateriaPrima: number;
  custoMaoObraDireta: number;
  custosIndiretosFabricacao: number;
  quebrasEPerdas: number;
  
  // Lucro Bruto
  lucroBruto: number;
  
  // Despesas Operacionais
  despesasOperacionais: number;
  despesasVendas: number;
  despesasAdministrativas: number;
  outrasDespesasOperacionais: number;
  
  // EBIT
  resultadoOperacionalEBIT: number;
  
  // Resultado Financeiro
  resultadoFinanceiro: number;
  receitasFinanceiras: number;
  despesasFinanceiras: number;
  
  // LAIR
  resultadoAntesImpostosLAIR: number;
  
  // Outras Receitas e Despesas
  outrasReceitasDespesas: number;
  outrasReceitasNaoOperacionais: number;
  outrasDespesasNaoOperacionais: number;
  
  // Resultado Ajustado
  resultadoAjustadoAntesIRPJ: number;
  
  // IRPJ e CSLL
  impostoRendaCSLL: number;
  impostoRenda: number;
  contribuicaoSocial: number;
  
  // Participações
  participacoes: number;
  
  // Lucro Líquido Final
  lucroLiquidoExercicio: number;
  
  detalhamento: {
    vendaProdutos: { [key: string]: number };
    vendaMercadorias: { [key: string]: number };
    prestacaoServicos: { [key: string]: number };
    devolucoes: { [key: string]: number };
    vendasCanceladas: { [key: string]: number };
    descontosIncondicionais: { [key: string]: number };
    impostosVendas: { [key: string]: number };
    custoMateriaPrima: { [key: string]: number };
    custoMaoObraDireta: { [key: string]: number };
    custosIndiretosFabricacao: { [key: string]: number };
    quebrasEPerdas: { [key: string]: number };
    despesasVendas: { [key: string]: number };
    despesasAdministrativas: { [key: string]: number };
    outrasDespesasOperacionais: { [key: string]: number };
    receitasFinanceiras: { [key: string]: number };
    despesasFinanceiras: { [key: string]: number };
    outrasReceitasNaoOperacionais: { [key: string]: number };
    outrasDespesasNaoOperacionais: { [key: string]: number };
    participacoes: { [key: string]: number };
  };
}

export const useDRECalculations = (
  lancamentos: LancamentoComRelacoes[],
): DREData => {
  return useMemo(() => {
    // Inicialização das categorias
    const vendaProdutos: { [key: string]: number } = {};
    const vendaMercadorias: { [key: string]: number } = {};
    const prestacaoServicos: { [key: string]: number } = {};
    const devolucoes: { [key: string]: number } = {};
    const vendasCanceladas: { [key: string]: number } = {};
    const descontosIncondicionais: { [key: string]: number } = {};
    const impostosVendas: { [key: string]: number } = {};
    const custoMateriaPrima: { [key: string]: number } = {};
    const custoMaoObraDireta: { [key: string]: number } = {};
    const custosIndiretosFabricacao: { [key: string]: number } = {};
    const quebrasEPerdas: { [key: string]: number } = {};
    const despesasVendas: { [key: string]: number } = {};
    const despesasAdministrativas: { [key: string]: number } = {};
    const outrasDespesasOperacionais: { [key: string]: number } = {};
    const receitasFinanceiras: { [key: string]: number } = {};
    const despesasFinanceiras: { [key: string]: number } = {};
    const outrasReceitasNaoOperacionais: { [key: string]: number } = {};
    const outrasDespesasNaoOperacionais: { [key: string]: number } = {};
    const participacoes: { [key: string]: number } = {};

    // Processamento dos lançamentos
    lancamentos.forEach((lancamento) => {
      const categoria = lancamento.categoria;
      const valor = lancamento.valor;

      if (lancamento.tipo === "receita") {
        // RECEITA BRUTA DE VENDAS
        if (categoria === "Venda de Produtos") {
          vendaProdutos[categoria] = (vendaProdutos[categoria] || 0) + valor;
        } else if (categoria === "Venda de Mercadorias") {
          vendaMercadorias[categoria] = (vendaMercadorias[categoria] || 0) + valor;
        } else if (categoria === "Prestação de Serviços") {
          prestacaoServicos[categoria] = (prestacaoServicos[categoria] || 0) + valor;
        }
        // RECEITAS FINANCEIRAS
        else if (categoria === "Receitas Financeiras") {
          receitasFinanceiras[categoria] = (receitasFinanceiras[categoria] || 0) + valor;
        }
        // OUTRAS RECEITAS NÃO OPERACIONAIS
        else if (categoria === "Outras Receitas Não Operacionais") {
          outrasReceitasNaoOperacionais[categoria] = (outrasReceitasNaoOperacionais[categoria] || 0) + valor;
        }
        // Demais receitas vão para vendas de produtos por padrão
        else {
          vendaProdutos[categoria] = (vendaProdutos[categoria] || 0) + valor;
        }
      } else {
        // DEDUÇÕES DA RECEITA BRUTA
        if (categoria === "Devoluções e Abatimentos") {
          devolucoes[categoria] = (devolucoes[categoria] || 0) + valor;
        } else if (categoria === "Vendas Canceladas") {
          vendasCanceladas[categoria] = (vendasCanceladas[categoria] || 0) + valor;
        } else if (categoria === "Descontos Incondicionais Concedidos") {
          descontosIncondicionais[categoria] = (descontosIncondicionais[categoria] || 0) + valor;
        } else if (categoria === "Impostos sobre Vendas (ICMS, PIS, COFINS)") {
          impostosVendas[categoria] = (impostosVendas[categoria] || 0) + valor;
        }
        // CUSTOS DOS PRODUTOS/SERVIÇOS/MERCADORIAS
        else if (categoria === "Custo da Matéria-Prima / Mercadoria") {
          custoMateriaPrima[categoria] = (custoMateriaPrima[categoria] || 0) + valor;
        } else if (categoria === "Custo da Mão de Obra Direta") {
          custoMaoObraDireta[categoria] = (custoMaoObraDireta[categoria] || 0) + valor;
        } else if (categoria === "Custos Indiretos de Fabricação/Prestação (CIF/CIP)") {
          custosIndiretosFabricacao[categoria] = (custosIndiretosFabricacao[categoria] || 0) + valor;
        } else if (categoria === "Quebras e Perdas") {
          quebrasEPerdas[categoria] = (quebrasEPerdas[categoria] || 0) + valor;
        }
        // DESPESAS COM VENDAS
        else if ([
          "Comissões de Vendas", "Marketing e Publicidade", "Fretes e Entregas",
          "Promoções e Eventos", "Material de Vendas"
        ].includes(categoria)) {
          despesasVendas[categoria] = (despesasVendas[categoria] || 0) + valor;
        }
        // DESPESAS ADMINISTRATIVAS
        else if ([
          "Salários Administrativos", "Encargos Sociais", "Aluguel", "Energia Elétrica",
          "Telefone e Internet", "Material de Escritório", "Contabilidade",
          "Honorários Profissionais", "Seguros", "Manutenção e Conservação",
          "Limpeza e Conservação", "Viagens e Hospedagem"
        ].includes(categoria)) {
          despesasAdministrativas[categoria] = (despesasAdministrativas[categoria] || 0) + valor;
        }
        // OUTRAS DESPESAS OPERACIONAIS
        else if ([
          "Depreciação", "Amortização", "PCLD (Provisão para Créditos de Liquidação Duvidosa)",
          "Provisões Diversas"
        ].includes(categoria)) {
          outrasDespesasOperacionais[categoria] = (outrasDespesasOperacionais[categoria] || 0) + valor;
        }
        // DESPESAS FINANCEIRAS
        else if ([
          "Juros Pagos", "Taxas Bancárias", "IOF", "Descontos Concedidos",
          "Variações Monetárias Passivas"
        ].includes(categoria)) {
          despesasFinanceiras[categoria] = (despesasFinanceiras[categoria] || 0) + valor;
        }
        // OUTRAS DESPESAS NÃO OPERACIONAIS
        else if ([
          "Perdas com Venda de Imobilizado", "Multas e Penalidades", "Despesas Extraordinárias"
        ].includes(categoria)) {
          outrasDespesasNaoOperacionais[categoria] = (outrasDespesasNaoOperacionais[categoria] || 0) + valor;
        }
        // IRPJ E CSLL
        else if (categoria === "Imposto de Renda Pessoa Jurídica (IRPJ)") {
          // Tratado separadamente no cálculo automático
        } else if (categoria === "Contribuição Social sobre o Lucro Líquido (CSLL)") {
          // Tratado separadamente no cálculo automático
        }
        // PARTICIPAÇÕES
        else if ([
          "Participações de Empregados", "Participações de Administradores", "Participações Estatutárias"
        ].includes(categoria)) {
          participacoes[categoria] = (participacoes[categoria] || 0) + valor;
        }
        // Demais despesas vão para despesas administrativas por padrão
        else {
          despesasAdministrativas[categoria] = (despesasAdministrativas[categoria] || 0) + valor;
        }
      }
    });

    // CÁLCULOS DO DRE
    
    // 1. RECEITA BRUTA DE VENDAS
    const vendaProdutosTotal = Object.values(vendaProdutos).reduce((sum, val) => sum + val, 0);
    const vendaMercadoriasTotal = Object.values(vendaMercadorias).reduce((sum, val) => sum + val, 0);
    const prestacaoServicosTotal = Object.values(prestacaoServicos).reduce((sum, val) => sum + val, 0);
    const receitaBrutaVendas = vendaProdutosTotal + vendaMercadoriasTotal + prestacaoServicosTotal;

    // 2. DEDUÇÕES DA RECEITA BRUTA
    const devolucoesTotal = Object.values(devolucoes).reduce((sum, val) => sum + val, 0);
    const vendasCanceladasTotal = Object.values(vendasCanceladas).reduce((sum, val) => sum + val, 0);
    const descontosIncondicionaisTotal = Object.values(descontosIncondicionais).reduce((sum, val) => sum + val, 0);
    const impostosVendasTotal = Object.values(impostosVendas).reduce((sum, val) => sum + val, 0);
    const deducoesReceitaBrutaTotal = devolucoesTotal + vendasCanceladasTotal + descontosIncondicionaisTotal + impostosVendasTotal;

    // 3. RECEITA LÍQUIDA DE VENDAS
    const receitaLiquidaVendas = receitaBrutaVendas - deducoesReceitaBrutaTotal;

    // 4. CUSTO DOS PRODUTOS/SERVIÇOS/MERCADORIAS
    const custoMateriaPrimaTotal = Object.values(custoMateriaPrima).reduce((sum, val) => sum + val, 0);
    const custoMaoObraDiretaTotal = Object.values(custoMaoObraDireta).reduce((sum, val) => sum + val, 0);
    const custosIndiretosFabricacaoTotal = Object.values(custosIndiretosFabricacao).reduce((sum, val) => sum + val, 0);
    const quebrasEPerdasTotal = Object.values(quebrasEPerdas).reduce((sum, val) => sum + val, 0);
    const custoProdutosServicosMercadorias = custoMateriaPrimaTotal + custoMaoObraDiretaTotal + custosIndiretosFabricacaoTotal + quebrasEPerdasTotal;

    // 5. LUCRO BRUTO
    const lucroBruto = receitaLiquidaVendas - custoProdutosServicosMercadorias;

    // 6. DESPESAS OPERACIONAIS
    const despesasVendasTotal = Object.values(despesasVendas).reduce((sum, val) => sum + val, 0);
    const despesasAdministrativasTotal = Object.values(despesasAdministrativas).reduce((sum, val) => sum + val, 0);
    const outrasDespesasOperacionaisTotal = Object.values(outrasDespesasOperacionais).reduce((sum, val) => sum + val, 0);
    const despesasOperacionaisTotal = despesasVendasTotal + despesasAdministrativasTotal + outrasDespesasOperacionaisTotal;

    // 7. EBIT (Resultado Operacional antes das Despesas Financeiras e Impostos)
    const resultadoOperacionalEBIT = lucroBruto - despesasOperacionaisTotal;

    // 8. RESULTADO FINANCEIRO
    const receitasFinanceirasTotal = Object.values(receitasFinanceiras).reduce((sum, val) => sum + val, 0);
    const despesasFinanceirasTotal = Object.values(despesasFinanceiras).reduce((sum, val) => sum + val, 0);
    const resultadoFinanceiro = receitasFinanceirasTotal - despesasFinanceirasTotal;

    // 9. LAIR (Resultado antes dos Impostos sobre o Lucro)
    const resultadoAntesImpostosLAIR = resultadoOperacionalEBIT + resultadoFinanceiro;

    // 10. OUTRAS RECEITAS E DESPESAS (NÃO OPERACIONAIS)
    const outrasReceitasNaoOperacionaisTotal = Object.values(outrasReceitasNaoOperacionais).reduce((sum, val) => sum + val, 0);
    const outrasDespesasNaoOperacionaisTotal = Object.values(outrasDespesasNaoOperacionais).reduce((sum, val) => sum + val, 0);
    const outrasReceitasDespesasTotal = outrasReceitasNaoOperacionaisTotal - outrasDespesasNaoOperacionaisTotal;

    // 11. RESULTADO AJUSTADO ANTES DO IRPJ/CSLL
    const resultadoAjustadoAntesIRPJ = resultadoAntesImpostosLAIR + outrasReceitasDespesasTotal;

    // 12. IRPJ E CSLL
    const impostoRenda = resultadoAjustadoAntesIRPJ > 0 ? resultadoAjustadoAntesIRPJ * 0.15 : 0; // 15% IRPJ
    const contribuicaoSocial = resultadoAjustadoAntesIRPJ > 0 ? resultadoAjustadoAntesIRPJ * 0.09 : 0; // 9% CSLL
    const impostoRendaCSLL = impostoRenda + contribuicaoSocial;

    // 13. PARTICIPAÇÕES
    const participacoesTotal = Object.values(participacoes).reduce((sum, val) => sum + val, 0);

    // 14. LUCRO LÍQUIDO DO EXERCÍCIO
    const lucroLiquidoExercicio = resultadoAjustadoAntesIRPJ - impostoRendaCSLL - participacoesTotal;

    return {
      receitaBrutaVendas,
      vendaProdutos: vendaProdutosTotal,
      vendaMercadorias: vendaMercadoriasTotal,
      prestacaoServicos: prestacaoServicosTotal,
      deducoesReceitaBruta: deducoesReceitaBrutaTotal,
      devolucoes: devolucoesTotal,
      vendasCanceladas: vendasCanceladasTotal,
      descontosIncondicionais: descontosIncondicionaisTotal,
      impostosVendas: impostosVendasTotal,
      receitaLiquidaVendas,
      custoProdutosServicosMercadorias,
      custoMateriaPrima: custoMateriaPrimaTotal,
      custoMaoObraDireta: custoMaoObraDiretaTotal,
      custosIndiretosFabricacao: custosIndiretosFabricacaoTotal,
      quebrasEPerdas: quebrasEPerdasTotal,
      lucroBruto,
      despesasOperacionais: despesasOperacionaisTotal,
      despesasVendas: despesasVendasTotal,
      despesasAdministrativas: despesasAdministrativasTotal,
      outrasDespesasOperacionais: outrasDespesasOperacionaisTotal,
      resultadoOperacionalEBIT,
      resultadoFinanceiro,
      receitasFinanceiras: receitasFinanceirasTotal,
      despesasFinanceiras: despesasFinanceirasTotal,
      resultadoAntesImpostosLAIR,
      outrasReceitasDespesas: outrasReceitasDespesasTotal,
      outrasReceitasNaoOperacionais: outrasReceitasNaoOperacionaisTotal,
      outrasDespesasNaoOperacionais: outrasDespesasNaoOperacionaisTotal,
      resultadoAjustadoAntesIRPJ,
      impostoRendaCSLL,
      impostoRenda,
      contribuicaoSocial,
      participacoes: participacoesTotal,
      lucroLiquidoExercicio,
      detalhamento: {
        vendaProdutos,
        vendaMercadorias,
        prestacaoServicos,
        devolucoes,
        vendasCanceladas,
        descontosIncondicionais,
        impostosVendas,
        custoMateriaPrima,
        custoMaoObraDireta,
        custosIndiretosFabricacao,
        quebrasEPerdas,
        despesasVendas,
        despesasAdministrativas,
        outrasDespesasOperacionais,
        receitasFinanceiras,
        despesasFinanceiras,
        outrasReceitasNaoOperacionais,
        outrasDespesasNaoOperacionais,
        participacoes,
      },
    };
  }, [lancamentos]);
};
