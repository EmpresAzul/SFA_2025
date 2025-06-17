
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedCurrencyInput } from '@/components/ui/enhanced-currency-input';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrecificacao } from '@/hooks/usePrecificacao';
import { supabase } from '@/integrations/supabase/client';

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

  const adicionarCusto = () => {
    if (custos.length < 20) {
      const novoCusto: CustoProduto = {
        id: Date.now().toString(),
        descricao: '',
        valor: 0
      };
      setCustos([...custos, novoCusto]);
    }
  };

  const removerCusto = (id: string) => {
    if (custos.length > 1) {
      setCustos(custos.filter(custo => custo.id !== id));
    }
  };

  const atualizarCusto = (id: string, campo: 'descricao' | 'valor', valor: string | number) => {
    setCustos(custos.map(custo => 
      custo.id === id ? { ...custo, [campo]: valor } : custo
    ));
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
      // Obter o user_id atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Converter objetos complexos para JSON compatível
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome-produto">Nome do Produto *</Label>
          <Input
            id="nome-produto"
            value={produtoData.nome}
            onChange={(e) => setProdutoData({ ...produtoData, nome: e.target.value })}
            placeholder="Digite o nome do produto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria-produto">Categoria *</Label>
          <Input
            id="categoria-produto"
            value={produtoData.categoria}
            onChange={(e) => setProdutoData({ ...produtoData, categoria: e.target.value })}
            placeholder="Ex: Eletrônicos, Roupas, Alimentação"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="margem-lucro">Margem de Lucro (%) *</Label>
          <Input
            id="margem-lucro"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={produtoData.margemLucro}
            onChange={(e) => setProdutoData({ ...produtoData, margemLucro: parseFloat(e.target.value) || 0 })}
            placeholder="30"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Custos do Produto</CardTitle>
            <Button
              type="button"
              onClick={adicionarCusto}
              disabled={custos.length >= 20}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Custo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600">
              <div className="col-span-6">Descrição do Custo</div>
              <div className="col-span-4">Valor</div>
              <div className="col-span-2">Ação</div>
            </div>
            
            {custos.map((custo) => (
              <div key={custo.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <Input
                    value={custo.descricao}
                    onChange={(e) => atualizarCusto(custo.id, 'descricao', e.target.value)}
                    placeholder="Descrição do custo"
                  />
                </div>
                <div className="col-span-4">
                  <EnhancedCurrencyInput
                    value={custo.valor}
                    onChange={(numericValue) => atualizarCusto(custo.id, 'valor', numericValue)}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    onClick={() => removerCusto(custo.id)}
                    disabled={custos.length <= 1}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Custo Total:</span>
                <span className="text-lg font-semibold">R$ {custoTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Margem de Lucro ({produtoData.margemLucro}%):</span>
                <span className="text-lg font-semibold text-green-600">R$ {lucroValor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-bold">Preço Final:</span>
                <span className="text-xl font-bold text-blue-600">R$ {precoFinal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
