
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CurrencyInput } from '@/components/ui/currency-input';
import type { FormData } from '@/types/lancamentosForm';
import type { Cadastro } from '@/hooks/useCadastros';

interface LancamentosFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  clientes: Cadastro[];
  fornecedores: Cadastro[];
}

const LancamentosFormFields: React.FC<LancamentosFormFieldsProps> = ({
  formData,
  setFormData,
  clientes,
  fornecedores,
}) => {
  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log('FormFields: Atualizando campo', field, 'com valor:', value);
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('FormFields: Estado atualizado:', updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Tipo de Lançamento */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Tipo de Lançamento *
        </Label>
        <RadioGroup
          value={formData.tipo}
          onValueChange={(value) => handleInputChange('tipo', value as 'receita' | 'despesa')}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="receita" id="receita" />
            <Label htmlFor="receita" className="cursor-pointer">Receita</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="despesa" id="despesa" />
            <Label htmlFor="despesa" className="cursor-pointer">Despesa</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Data e Valor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data" className="text-sm font-medium text-gray-700">
            Data *
          </Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange('data', e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor" className="text-sm font-medium text-gray-700">
            Valor * (R$)
          </Label>
          <CurrencyInput
            value={formData.valor}
            onChange={(value) => handleInputChange('valor', value)}
            placeholder="R$ 0,00"
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Cliente/Fornecedor baseado no tipo */}
      {formData.tipo === 'receita' ? (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Cliente
          </Label>
          <Select
            value={formData.cliente_id}
            onValueChange={(value) => handleInputChange('cliente_id', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione um cliente (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum cliente</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Fornecedor
          </Label>
          <Select
            value={formData.fornecedor_id}
            onValueChange={(value) => handleInputChange('fornecedor_id', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione um fornecedor (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum fornecedor</SelectItem>
              {fornecedores.map((fornecedor) => (
                <SelectItem key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Categoria */}
      <div className="space-y-2">
        <Label htmlFor="categoria" className="text-sm font-medium text-gray-700">
          Categoria *
        </Label>
        <Input
          id="categoria"
          type="text"
          value={formData.categoria}
          onChange={(e) => handleInputChange('categoria', e.target.value)}
          placeholder="Ex: Vendas, Marketing, Alimentação..."
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">
          Observações
        </Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleInputChange('observacoes', e.target.value)}
          placeholder="Informações adicionais sobre o lançamento..."
          className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default LancamentosFormFields;
