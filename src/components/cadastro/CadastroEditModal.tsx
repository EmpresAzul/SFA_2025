
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save } from 'lucide-react';

interface CadastroEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: any;
  onSave: (data: any) => void;
  loading: boolean;
}

const CadastroEditModal: React.FC<CadastroEditModalProps> = ({
  isOpen,
  onClose,
  editingItem,
  onSave,
  loading
}) => {
  const [formData, setFormData] = React.useState(editingItem || {});

  React.useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!editingItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            ✏️ Editar {editingItem.tipo === 'cliente' ? 'Cliente' : editingItem.tipo === 'fornecedor' ? 'Fornecedor' : 'Funcionário'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">Nome</Label>
              <Input
                id="nome"
                value={formData.nome || ''}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Nome completo"
                className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="E-mail"
                className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone || ''}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="Telefone"
                className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={formData.status || ''} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editingItem.tipo === 'funcionario' && (
              <div className="space-y-2">
                <Label htmlFor="salario" className="text-sm font-medium">Salário</Label>
                <Input
                  id="salario"
                  type="number"
                  value={formData.salario || ''}
                  onChange={(e) => handleInputChange('salario', parseFloat(e.target.value) || 0)}
                  placeholder="Salário"
                  className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="endereco" className="text-sm font-medium">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco || ''}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Endereço completo"
                className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-10"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 hover:bg-gray-50 rounded-lg h-10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroEditModal;
