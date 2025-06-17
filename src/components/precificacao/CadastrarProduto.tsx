
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrecificacao } from '@/hooks/usePrecificacao';
import { supabase } from '@/integrations/supabase/client';
import ProdutoFormFields from './forms/ProdutoFormFields';
import CustosManager from './forms/CustosManager';
import PrecificacaoCalculations from './forms/PrecificacaoCalculations';

interface CustoProduto {
  id: string;
  descricao: string;
  valor: number;
}

const CadastrarProduto: React.FC = () => {
  const { toast } = useToast();
  const { useCreate } = usePrecificacao();
  const createPrecificacao = useCreate();
  const [loading, setLoading] = useState(false);

  const [produtoData, setProdutoData] = useState({
    nome: '',
    categoria: '',
    margemLucro: 30,
  });

  const [custos, setCustos] = useState<CustoProduto[]>([
    { id: '1', descricao: '', valor: 0 }
  ]);

  const handleUpdateProduto = (updates: Partial<typeof produtoData>) => {
    setProdutoData(prev => ({ ...prev, ...updates }));
  };

  // Cálculos automáticos
  const custoTotal = custos.reduce((total, custo) => total + custo.valor, 0);
  const margemDecimal = produtoData.margemLucro / 100;
  const precoFinal = custoTotal > 0 ? custoTotal / (1 - margemDecimal) : 0;
  const lucroValor = precoFinal - custoTotal;

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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const custosSerializados = custos
        .filter(c => c.descricao && c.valor > 0)
        .map(custo => ({
          id: custo.id,
          descricao: custo.descricao,
          valor: custo.valor
        }));

      const dadosPrecificacao = {
        nome: produtoData.nome,
        categoria: produtoData.categoria,
        tipo: 'Produto' as const,
        preco_final: precoFinal,
        margem_lucro: produtoData.margemLucro,
        user_id: user.id,
        dados_json: JSON.parse(JSON.stringify({
          custos: custosSerializados,
          custo_total: custoTotal,
          lucro_valor: lucroValor
        }))
      };

      console.log('Cadastrando produto:', dadosPrecificacao);
      await createPrecificacao.mutateAsync(dadosPrecificacao);

      // Reset form
      setProdutoData({
        nome: '',
        categoria: '',
        margemLucro: 30,
      });
      setCustos([{ id: '1', descricao: '', valor: 0 }]);
      
      toast({
        title: "Sucesso!",
        description: "Produto cadastrado com êxito.",
      });
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProdutoFormFields
        produtoData={produtoData}
        onUpdateProduto={handleUpdateProduto}
      />

      <CustosManager
        custos={custos}
        onUpdateCustos={setCustos}
      />

      <PrecificacaoCalculations
        custoTotal={custoTotal}
        margemLucro={produtoData.margemLucro}
        precoFinal={precoFinal}
        lucroValor={lucroValor}
      />

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        {loading ? "Cadastrando..." : "Cadastrar Produto"}
      </Button>
    </form>
  );
};

export default CadastrarProduto;
