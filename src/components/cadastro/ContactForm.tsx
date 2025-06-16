
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ContactFormData } from '@/types/contact';
import { formatCurrency } from '@/utils/formatters';

interface ContactFormProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  editingContact: any;
  formatDocument: (value: string, pessoa: string) => string;
  formatTelefone: (value: string) => string;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  isLoading: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
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

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader>
        <CardTitle className="gradient-fluxo-text">
          {editingContact ? 'Editar Cadastro' : 'Novo Cadastro'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="data" className="text-fluxo-blue-900 font-medium">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

            <div>
              <Label className="text-fluxo-blue-900 font-medium">Tipo</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="Funcionário">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-fluxo-blue-900 font-medium">Pessoa</Label>
              <Select 
                value={formData.pessoa} 
                onValueChange={(value) => {
                  setFormData({ ...formData, pessoa: value, documento: '' });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Física">Física</SelectItem>
                  <SelectItem value="Jurídica">Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="documento" className="text-fluxo-blue-900 font-medium">
                {formData.pessoa === 'Física' ? 'CPF' : 'CNPJ'}
              </Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e) => handleDocumentChange(e.target.value)}
                placeholder={formData.pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="nome" className="text-fluxo-blue-900 font-medium">
                Nome
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endereco" className="text-fluxo-blue-900 font-medium">
                Endereço
              </Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, Avenida..."
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
              />
            </div>
            
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
              />
            </div>

            {formData.tipo === 'Funcionário' && (
              <div>
                <Label htmlFor="salario" className="text-fluxo-blue-900 font-medium">
                  Salário
                </Label>
                <Input
                  id="salario"
                  value={formatCurrency(formData.salario)}
                  onChange={(e) => handleSalaryChange(e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
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
              />
            </div>

            <div>
              <Label htmlFor="anexo" className="text-fluxo-blue-900 font-medium">
                Anexo
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
                    // Aqui você implementaria o upload do arquivo
                    setFormData({ ...formData, anexo_url: file.name });
                  }
                }}
                accept="*/*"
              />
              <p className="text-xs text-gray-500 mt-1">Máximo 200MB</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? 'Salvando...' : editingContact ? 'Atualizar' : 'Cadastrar'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="px-6"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
