import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrecificacao } from "@/hooks/usePrecificacao";
import { supabase } from "@/integrations/supabase/client";

import type { TaxaAdicional } from "@/components/precificacao/forms/TaxasAdicionaisManager";

interface Precificacao {
  id: string;
  [key: string]: any;
}

interface CustoProduto {
  id: string;
  descricao: string;
  valor: number;
}

interface ProdutoData {
  nome: string;
  categoria: string;
  margemLucro: number;
}

export const useProdutoForm = (
  editingItem?: Precificacao | null,
  onCancelEdit?: () => void,
  onSaveSuccess?: () => void,
) => {
  const { toast } = useToast();
  const { useCreate, useUpdate } = usePrecificacao();
  const createPrecificacao = useCreate();
  const updatePrecificacao = useUpdate();
  const [loading, setLoading] = useState(false);

  const [produtoData, setProdutoData] = useState<ProdutoData>({
    nome: "",
    categoria: "",
    margemLucro: 30,
  });

  const [custos, setCustos] = useState<Array<{ id: string; descricao: string; valor: number }>>([
    { id: "1", descricao: "", valor: 0 },
  ]);

  const [taxasAdicionais, setTaxasAdicionais] = useState<Array<{ id: string; descricao: string; percentual: number }>>([
    { id: "1", descricao: "", percentual: 0 },
  ]);

  const [despesasFixas, setDespesasFixas] = useState<Array<{ id: string; descricao: string; valor: number }>>([
    { id: "1", descricao: "", valor: 0 },
  ]);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingItem) {
      setProdutoData({
        nome: editingItem.nome || "",
        categoria: editingItem.categoria || "",
        margemLucro: editingItem.margem_lucro || 30,
      });

      // Carregar custos se existirem
      if (editingItem.dados_json) {
        const dados = editingItem.dados_json as Record<string, unknown>;
        
        if (dados.custos_materiais) {
          const custosCarregados = (dados.custos_materiais as Array<Record<string, unknown>>).map((custo) => ({
            id: (custo.id as string) || Date.now().toString(),
            descricao: custo.descricao as string,
            valor: custo.valor as number,
          }));
          setCustos(custosCarregados);
        }

        if (dados.taxas_adicionais) {
          const taxasCarregadas = (dados.taxas_adicionais as Array<Record<string, unknown>>).map((taxa) => ({
            id: (taxa.id as string) || Date.now().toString(),
            descricao: taxa.descricao as string,
            percentual: taxa.percentual as number,
          }));
          setTaxasAdicionais(taxasCarregadas);
        }

        if (dados.despesas_fixas) {
          const despesasCarregadas = (dados.despesas_fixas as Array<Record<string, unknown>>).map((despesa) => ({
            id: (despesa.id as string) || Date.now().toString(),
            descricao: despesa.descricao as string,
            valor: despesa.valor as number,
          }));
          setDespesasFixas(despesasCarregadas);
        }
      }
    }
  }, [editingItem]);

  const handleUpdateProduto = (updates: Partial<ProdutoData>) => {
    setProdutoData((prev) => ({ ...prev, ...updates }));
  };

  // Cálculos automáticos com taxas adicionais
  const custoTotal = custos.reduce((total, custo) => total + custo.valor, 0);
  const totalTaxasPercentual = taxasAdicionais.reduce(
    (total, taxa) => total + taxa.percentual,
    0,
  );
  const percentualTotal = produtoData.margemLucro + totalTaxasPercentual;
  const margemDecimal = percentualTotal / 100;
  const precoFinal = custoTotal > 0 ? custoTotal / (1 - margemDecimal) : 0;
  const lucroValor = precoFinal - custoTotal;
  const valorTaxas = (custoTotal * totalTaxasPercentual) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produtoData.nome) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!produtoData.categoria) {
      toast({
        title: "Erro",
        description: "Categoria é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    if (custoTotal <= 0) {
      toast({
        title: "Erro",
        description: "Pelo menos um custo deve ser informado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const custosSerializados = custos
        .filter((c) => c.descricao && c.valor > 0)
        .map((custo) => ({
          id: custo.id,
          descricao: custo.descricao,
          valor: custo.valor,
        }));

      const taxasSerializadas = taxasAdicionais
        .filter((t) => t.descricao && t.percentual > 0)
        .map((taxa) => ({
          id: taxa.id,
          descricao: taxa.descricao,
          percentual: taxa.percentual,
        }));

      const dadosPrecificacao = {
        nome: produtoData.nome,
        categoria: produtoData.categoria,
        tipo: "Produto" as const,
        preco_final: precoFinal,
        preco_venda: precoFinal, // Manter compatibilidade
        margem_lucro: produtoData.margemLucro,
        dados_json: JSON.parse(
          JSON.stringify({
            custos_materiais: custosSerializados,
            taxas_adicionais: taxasSerializadas,
            custo_total: custoTotal,
            total_taxas_percentual: totalTaxasPercentual,
            percentual_total: percentualTotal,
            lucro_valor: lucroValor,
            valor_taxas: valorTaxas,
          }),
        ),
      };

      if (editingItem) {
        // Atualizar item existente
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }
        
        await updatePrecificacao.mutateAsync({
          id: editingItem.id,
          data: { ...dadosPrecificacao, user_id: user.id },
        });
        toast({
          title: "Sucesso!",
          description: "Produto atualizado com êxito.",
        });
      } else {
        // Criar novo item
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        console.log("🔄 Dados que serão enviados para precificação:", {
          ...dadosPrecificacao,
          user_id: user.id,
        });

        await createPrecificacao.mutateAsync({
          ...dadosPrecificacao,
          user_id: user.id,
        });
        toast({
          title: "Sucesso!",
          description: "Produto cadastrado com êxito.",
        });
      }

      // Reset form
      resetForm();

      // Chamar callback de sucesso
      onSaveSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProdutoData({
      nome: "",
      categoria: "",
      margemLucro: 30,
    });
    setCustos([{ id: "1", descricao: "", valor: 0 }]);
    setTaxasAdicionais([{ id: "1", descricao: "", percentual: 0 }]);
    setDespesasFixas([{ id: "1", descricao: "", valor: 0 }]);
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return {
    produtoData,
    setProdutoData,
    custos,
    setCustos,
    taxasAdicionais,
    setTaxasAdicionais,
    loading,
    custoTotal,
    totalTaxasPercentual,
    precoFinal,
    lucroValor,
    valorTaxas,
    handleUpdateProduto,
    handleSubmit,
    handleCancel,
  };
};
