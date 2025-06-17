import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Package, Plus, Calculator, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import CadastrarHora from '@/components/precificacao/CadastrarHora';

const Precificacao: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [produtoData, setProdutoData] = useState({
    nome: '',
    categoria: '',
    custoProduto: 0,
    custoOperacional: 0,
    margemLucro: 0,
    precoVenda: 0,
    descricao: ''
  });

  const [servicoData, setServicoData] = useState({
    nome: '',
    categoria: '',
    custoHora: 0,
    tempoEstimado: 0,
    custoMaterial: 0,
    margemLucro: 0,
    precoVenda: 0,
    descricao: ''
  });

  const categoriasProduto = [
    'Eletrônicos',
    'Roupas e Acessórios',
    'Casa e Jardim',
    'Esportes e Lazer',
    'Livros e Mídia',
    'Saúde e Beleza',
    'Automotivo',
    'Outros'
  ];

  const categoriasServico = [
    'Consultoria',
    'Desenvolvimento',
    'Design',
    'Marketing',
    'Educação',
    'Saúde',
    'Manutenção',
    'Outros'
  ];

  const calcularPrecoProduto = () => {
    const custo = produtoData.custoProduto || 0;
    const operacional = produtoData.custoOperacional || 0;
    const margem = produtoData.margemLucro || 0;
    
    const custoTotal = custo + operacional;
    const precoCalculado = custoTotal * (1 + margem / 100);
    
    setProdutoData({ ...produtoData, precoVenda: precoCalculado });
  };

  const calcularPrecoServico = () => {
    const custoHora = servicoData.custoHora || 0;
    const tempo = servicoData.tempoEstimado || 0;
    const material = servicoData.custoMaterial || 0;
    const margem = servicoData.margemLucro || 0;
    
    const custoTotal = (custoHora * tempo) + material;
    const precoCalculado = custoTotal * (1 + margem / 100);
    
    setServicoData({ ...servicoData, precoVenda: precoCalculado });
  };

  const handleSubmitProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast({
        title: "Produto cadastrado com sucesso!",
        description: `Produto "${produtoData.nome}" foi cadastrado.`,
      });

      setProdutoData({
        nome: '',
        categoria: '',
        custoProduto: 0,
        custoOperacional: 0,
        margemLucro: 0,
        precoVenda: 0,
        descricao: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar produto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitServico = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast({
        title: "Serviço cadastrado com sucesso!",
        description: `Serviço "${servicoData.nome}" foi cadastrado.`,
      });

      setServicoData({
        nome: '',
        categoria: '',
        custoHora: 0,
        tempoEstimado: 0,
        custoMaterial: 0,
        margemLucro: 0,
        precoVenda: 0,
        descricao: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar serviço",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900">Precificação</h1>
          <p className="text-fluxo-black-600 mt-2">Gerencie a precificação de produtos, serviços e horas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-pink-500" />
            Cadastro de Produtos, Serviços e Horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="produto" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="produto" className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2 text-blue-500" />
                Cadastrar Produto
              </TabsTrigger>
              <TabsTrigger value="servico" className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-green-500" />
                Cadastrar Serviço
              </TabsTrigger>
              <TabsTrigger value="hora" className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-purple-500" />
                Cadastrar Hora
              </TabsTrigger>
            </TabsList>

            <TabsContent value="produto" className="space-y-6">
              <form onSubmit={handleSubmitProduto} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome-produto">Nome do Produto *</Label>
                    <Input
                      id="nome-produto"
                      value={produtoData.nome}
                      onChange={(e) => setProdutoData({ ...produtoData, nome: e.target.value })}
                      placeholder="Digite o nome do produto"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria-produto">Categoria *</Label>
                    <Select value={produtoData.categoria} onValueChange={(value) => setProdutoData({ ...produtoData, categoria: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasProduto.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custo-produto">Custo do Produto *</Label>
                    <CurrencyInput
                      id="custo-produto"
                      value={produtoData.custoProduto}
                      onChange={(value) => setProdutoData({ ...produtoData, custoProduto: value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custo-operacional">Custo Operacional *</Label>
                    <CurrencyInput
                      id="custo-operacional"
                      value={produtoData.custoOperacional}
                      onChange={(value) => setProdutoData({ ...produtoData, custoOperacional: value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="margem-lucro-produto">Margem de Lucro (%) *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="margem-lucro-produto"
                        type="number"
                        step="0.01"
                        value={produtoData.margemLucro}
                        onChange={(e) => setProdutoData({ ...produtoData, margemLucro: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                        required
                      />
                      <Button
                        type="button"
                        onClick={calcularPrecoProduto}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        <Calculator className="w-4 h-4 mr-1" />
                        Calcular
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preco-venda-produto">Preço de Venda</Label>
                    <CurrencyInput
                      id="preco-venda-produto"
                      value={produtoData.precoVenda}
                      onChange={(value) => setProdutoData({ ...produtoData, precoVenda: value })}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao-produto">Descrição</Label>
                  <Textarea
                    id="descricao-produto"
                    value={produtoData.descricao}
                    onChange={(e) => setProdutoData({ ...produtoData, descricao: e.target.value })}
                    placeholder="Descrição do produto..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? "Cadastrando..." : "Cadastrar Produto"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="servico" className="space-y-6">
              <form onSubmit={handleSubmitServico} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome-servico">Nome do Serviço *</Label>
                    <Input
                      id="nome-servico"
                      value={servicoData.nome}
                      onChange={(e) => setServicoData({ ...servicoData, nome: e.target.value })}
                      placeholder="Digite o nome do serviço"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria-servico">Categoria *</Label>
                    <Select value={servicoData.categoria} onValueChange={(value) => setServicoData({ ...servicoData, categoria: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasServico.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custo-hora">Custo por Hora *</Label>
                    <CurrencyInput
                      id="custo-hora"
                      value={servicoData.custoHora}
                      onChange={(value) => setServicoData({ ...servicoData, custoHora: value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempo-estimado">Tempo Estimado (horas) *</Label>
                    <Input
                      id="tempo-estimado"
                      type="number"
                      step="0.01"
                      value={servicoData.tempoEstimado}
                      onChange={(e) => setServicoData({ ...servicoData, tempoEstimado: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custo-material">Custo de Material</Label>
                    <CurrencyInput
                      id="custo-material"
                      value={servicoData.custoMaterial}
                      onChange={(value) => setServicoData({ ...servicoData, custoMaterial: value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="margem-lucro-servico">Margem de Lucro (%) *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="margem-lucro-servico"
                        type="number"
                        step="0.01"
                        value={servicoData.margemLucro}
                        onChange={(e) => setServicoData({ ...servicoData, margemLucro: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                        required
                      />
                      <Button
                        type="button"
                        onClick={calcularPrecoServico}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        <Calculator className="w-4 h-4 mr-1" />
                        Calcular
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preco-venda-servico">Preço de Venda</Label>
                    <CurrencyInput
                      id="preco-venda-servico"
                      value={servicoData.precoVenda}
                      onChange={(value) => setServicoData({ ...servicoData, precoVenda: value })}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao-servico">Descrição</Label>
                  <Textarea
                    id="descricao-servico"
                    value={servicoData.descricao}
                    onChange={(e) => setServicoData({ ...servicoData, descricao: e.target.value })}
                    placeholder="Descrição do serviço..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? "Cadastrando..." : "Cadastrar Serviço"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="hora" className="space-y-6">
              <CadastrarHora />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Precificacao;
