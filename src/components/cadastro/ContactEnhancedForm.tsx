
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ContactFormData } from '@/types/contact';
import { formatCurrency } from '@/utils/formatters';
import { X, Upload } from 'lucide-react';

interface ContactEnhancedFormProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  editingContact: any;
  formatDocument: (value: string, pessoa: string) => string;
  formatTelefone: (value: string) => string;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  isLoading: boolean;
}

export const ContactEnhancedForm: React.FC<ContactEnhancedFormProps> = ({
  formData,
  setFormData,
  editingContact,
  formatDocument,
  formatTelefone,
  handleSubmit,
  resetForm,
  isLoading
}) => {
  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value, formData.pessoa);
    setFormData({ ...formData, documento: formatted });
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatTelefone(value);
    setFormData({ ...formData, telefone: formatted });
  };

  const handleSalaryChange = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    setFormData({ ...formData, salario: numericValue });
  };

  const getDocumentLabel = () => {
    return formData.pessoa === 'Física' ? 'CPF' : 'CNPJ';
  };

  const getDocumentPlaceholder = () => {
    return formData.pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md mb-6">
      <CardHeader className="bg-gradient-to-r from-fluxo-blue-50 to-fluxo-blue-100 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="gradient-fluxo-text text-xl">
            {editingContact ? 'Editar Cadastro' : 'Novo Cadastro'}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetForm}
            className="hover:bg-red-100 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primeira linha - Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="data" className="text-fluxo-blue-900 font-medium">
                Data *
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-fluxo-blue-900 font-medium">Tipo *</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="Funcionário">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-fluxo-blue-900 font-medium">Pessoa *</Label>
              <Select 
                value={formData.pessoa} 
                onValueChange={(value) => {
                  setFormData({ ...formData, pessoa: value, documento: '' });
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Física">Física</SelectItem>
                  <SelectItem value="Jurídica">Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="documento" className="text-fluxo-blue-900 font-medium">
                {getDocumentLabel()} *
              </Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e) => handleDocumentChange(e.target.value)}
                placeholder={getDocumentPlaceholder()}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Segunda linha - Nome */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="nome" className="text-fluxo-blue-900 font-medium">
                Nome *
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Terceira linha - Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="endereco" className="text-fluxo-blue-900 font-medium">
                Endereço
              </Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, Avenida..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="numero" className="text-fluxo-blue-900 font-medium">
                Número
              </Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                placeholder="123"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="cidade" className="text-fluxo-blue-900 font-medium">
                Cidade
              </Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="São Paulo"
                className="mt-1"
              />
            </div>
          </div>

          {/* Quarta linha - UF, Email, Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="estado" className="text-fluxo-blue-900 font-medium">
                UF
              </Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                placeholder="SP"
                maxLength={2}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-fluxo-blue-900 font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="telefone" className="text-fluxo-blue-900 font-medium">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 99999-9999"
                className="mt-1"
              />
            </div>

            {/* Campo Salário só aparece para Funcionários */}
            {formData.tipo === 'Funcionário' && (
              <div>
                <Label htmlFor="salario" className="text-fluxo-blue-900 font-medium">
                  Salário (R$)
                </Label>
                <Input
                  id="salario"
                  value={formatCurrency(formData.salario)}
                  onChange={(e) => handleSalaryChange(e.target.value)}
                  placeholder="R$ 0,00"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Quinta linha - Observações e Anexo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="observacoes" className="text-fluxo-blue-900 font-medium">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações adicionais..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="anexo" className="text-fluxo-blue-900 font-medium flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Anexo (máx. 200MB)
              </Label>
              <Input
                id="anexo"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 200 * 1024 * 1024) {
                      alert('Arquivo muito grande. O limite é 200MB.');
                      return;
                    }
                    setFormData({ ...formData, anexo_url: file.name });
                  }
                }}
                accept="*/*"
                className="mt-1"
              />
              {formData.anexo_url && (
                <p className="text-xs text-green-600 mt-1">Arquivo: {formData.anexo_url}</p>
              )}
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? 'Salvando...' : editingContact ? 'Atualizar Cadastro' : 'Salvar Cadastro'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="px-8 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
