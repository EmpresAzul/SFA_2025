
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactFormData } from '@/types/contact';

interface ContactFormProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  editingContact: any;
  formatDocument: (value: string, type: string) => string;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  isLoading: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  setFormData,
  editingContact,
  formatDocument,
  handleSubmit,
  resetForm,
  isLoading
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader>
        <CardTitle className="gradient-fluxo-text">
          {editingContact ? 'Editar Cadastro' : 'Novo Cadastro'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Label htmlFor="documento" className="text-fluxo-blue-900 font-medium">
                {formData.tipo === 'Fornecedor' ? 'CNPJ' : 'CPF'}
              </Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  documento: formatDocument(e.target.value, formData.tipo || 'Cliente')
                })}
                placeholder={formData.tipo === 'Fornecedor' ? '00.000.000/0000-00' : '000.000.000-00'}
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
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
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
