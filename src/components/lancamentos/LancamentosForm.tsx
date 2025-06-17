import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CurrencyInput } from '@/components/ui/currency-input';
import type { Cadastro } from '@/hooks/useCadastros';
import type { Lancamento } from '@/hooks/useLancamentos';

// Categorias específicas do DRE organizadas por tipo
const categoriasReceita = {
  'Receitas Operacionais': [
    'Vendas de Produtos',
    'Vendas de Mercadorias',
    'Prestação de Serviços',
    'Outras Receitas Operacionais'
  ],
  'Receitas Financeiras': [
    'Juros Recebidos',
    'Aplicações Financeiras',
    'Descontos Obtidos',
    'Variações Monetárias Ativas'
  ],
  'Outras Receitas': [
    'Receitas Extraordinárias',
    'Venda de Ativos'
  ]
};

const categoriasDespesa = {
  'Deduções da Receita': [
    'Devoluções de Vendas',
    'Abatimentos sobre Vendas',
    'ICMS sobre Vendas',
    'PIS/COFINS',
    'ISS',
    'Outros Impostos sobre Vendas'
  ],
  'Custos': [
    'Custo dos Produtos Vendidos (CPV)',
    'Custo das Mercadorias Vendidas (CMV)',
    'Custo dos Serviços Prestados (CSP)',
    'Matéria-Prima',
    'Mão de Obra Direta',
    'Custos Indiretos de Fabricação'
  ],
  'Despesas Operacionais': [
    'Despesas com Vendas',
    'Comissões sobre Vendas',
    'Marketing e Publicidade',
    'Fretes e Entregas',
    'Despesas Administrativas',
    'Salários e Encargos',
    'Aluguel e Condomínio',
    'Energia Elétrica',
    'Telefone e Internet',
    'Material de Escritório',
    'Contabilidade',
    'Honorários Profissionais',
    'Seguros',
    'Manutenção e Conservação',
    'Depreciação'
  ],
  'Despesas Financeiras': [
    'Juros Pagos',
    'Taxas Bancárias',
    'IOF',
    'Descontos Concedidos',
    'Variações Monetárias Passivas'
  ],
  'Outras Despesas': [
    'Despesas Extraordinárias',
    'Provisões para Contingências'
  ]
};

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

interface FormData {
  data: string;
  tipo: 'receita' | 'despesa';
  valor: string;
  cliente_id: string;
  fornecedor_id: string;
  categoria: string;
  observacoes: string;
}

interface LancamentosFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  editingLancamento: LancamentoComRelacoes | null;
  loading: boolean;
  clientes: Cadastro[] | undefined;
  fornecedores: Cadastro[] | undefined;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const LancamentosForm: React.FC<LancamentosFormProps> = ({
  formData,
  setFormData,
  editingLancamento,
  loading,
  clientes,
  fornecedores,
  onSubmit,
  onCancel,
}) => {
  console.log('LancamentosForm: Dados atuais do formulário:', formData);
  console.log('LancamentosForm: Editando lançamento:', editingLancamento);

  const handleValorChange = (newValue: number) => {
    console.log('LancamentosForm: Valor alterado para:', newValue);
    // Manter como string no formData, mas garantir que seja válido
    const valorString = newValue > 0 ? newValue.toString() : '';
    console.log('LancamentosForm: Valor convertido para string:', valorString);
    setFormData({ ...formData, valor: valorString });
  };

  const renderCategoriasByGroup = () => {
    const categorias = formData.tipo === 'receita' ? categoriasReceita : categoriasDespesa;
    
    return Object.entries(categorias).map(([grupo, items]) => (
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
    ));
  };

  // Converter valor string para number para o CurrencyInput
  const valorNumerico = parseFloat(formData.valor) || 0;
  console.log('LancamentosForm: Valor para CurrencyInput:', valorNumerico);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          As categorias selecionadas alimentarão automaticamente a estrutura do DRE
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value: 'receita' | 'despesa') => 
                setFormData({ ...formData, tipo: value, categoria: '', cliente_id: '', fornecedor_id: '' })
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <CurrencyInput
                value={valorNumerico}
                onChange={handleValorChange}
                placeholder="0,00"
                required
              />
              {editingLancamento && (
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  💡 Editando lançamento ID: {editingLancamento.id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria DRE *</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {formData.tipo && renderCategoriasByGroup()}
                </SelectContent>
              </Select>
              {formData.categoria && (
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  💡 Esta categoria será refletida automaticamente no relatório DRE
                </p>
              )}
            </div>

            {formData.tipo === 'receita' && clientes && (
              <div className="space-y-2">
                <Label htmlFor="cliente_id">Cliente</Label>
                <Select value={formData.cliente_id} onValueChange={(value) => setFormData({ ...formData, cliente_id: value === 'none' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.tipo === 'despesa' && fornecedores && (
              <div className="space-y-2">
                <Label htmlFor="fornecedor_id">Fornecedor</Label>
                <Select value={formData.fornecedor_id} onValueChange={(value) => setFormData({ ...formData, fornecedor_id: value === 'none' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações opcionais sobre este lançamento..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
            >
              {loading ? "Salvando..." : editingLancamento ? "Atualizar Lançamento" : "Cadastrar Lançamento"}
            </Button>
            {editingLancamento && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LancamentosForm;
