
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Cadastro } from '@/hooks/useCadastros';
import type { Lancamento } from '@/hooks/useLancamentos';

const categoriasReceita = ['Receita', 'Receita Não Operacional'];
const categoriasDespesa = ['Despesa fixa', 'Custo variável', 'Despesa não operacional', 'Salários', 'Investimentos'];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
        </CardTitle>
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
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {formData.tipo === 'receita' && categoriasReceita.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                  {formData.tipo === 'despesa' && categoriasDespesa.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.tipo === 'receita' && clientes && (
              <div className="space-y-2">
                <Label htmlFor="cliente_id">Cliente</Label>
                <Select value={formData.cliente_id} onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
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
                <Select value={formData.fornecedor_id} onValueChange={(value) => setFormData({ ...formData, fornecedor_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
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
              placeholder="Observações opcionais..."
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
