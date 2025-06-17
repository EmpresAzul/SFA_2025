
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CurrencyInput } from '@/components/ui/currency-input';
import type { Cadastro } from '@/hooks/useCadastros';
import type { FormData, LancamentoComRelacoes } from '@/types/lancamentosForm';

interface LancamentosFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  editingLancamento: LancamentoComRelacoes | null;
  clientes: Cadastro[] | undefined;
  fornecedores: Cadastro[] | undefined;
  renderCategoriasByGroup: () => React.ReactNode;
}

const LancamentosFormFields: React.FC<LancamentosFormFieldsProps> = ({
  formData,
  setFormData,
  editingLancamento,
  clientes,
  fornecedores,
  renderCategoriasByGroup,
}) => {
  const handleValorChange = (newValue: number) => {
    console.log('LancamentosFormFields: Valor alterado para:', newValue);
    const valorString = newValue > 0 ? newValue.toString() : '';
    console.log('LancamentosFormFields: Valor convertido para string:', valorString);
    setFormData({ ...formData, valor: valorString });
  };

  const valorNumerico = parseFloat(formData.valor) || 0;

  return (
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
  );
};

export default LancamentosFormFields;
