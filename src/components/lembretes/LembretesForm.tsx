
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Save, X } from 'lucide-react';
import { useLembretes, type LembreteFormData } from '@/hooks/useLembretes';

interface LembretesFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingLembrete?: any;
}

const LembretesForm: React.FC<LembretesFormProps> = ({ 
  isOpen, 
  onClose,
  editingLembrete 
}) => {
  const { createLembrete, updateLembrete } = useLembretes();
  const [formData, setFormData] = useState<LembreteFormData>({
    titulo: editingLembrete?.titulo || '',
    descricao: editingLembrete?.descricao || '',
    data_lembrete: editingLembrete?.data_lembrete || '',
    hora_lembrete: editingLembrete?.hora_lembrete || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLembrete) {
        await updateLembrete.mutateAsync({
          id: editingLembrete.id,
          ...formData
        });
      } else {
        await createLembrete.mutateAsync(formData);
      }
      
      onClose();
      setFormData({
        titulo: '',
        descricao: '',
        data_lembrete: '',
        hora_lembrete: ''
      });
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              {editingLembrete ? 'Editar Lembrete' : 'Novo Lembrete'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Digite o título do lembrete"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o lembrete (opcional)"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_lembrete">Data *</Label>
                <Input
                  id="data_lembrete"
                  type="date"
                  value={formData.data_lembrete}
                  onChange={(e) => setFormData({ ...formData, data_lembrete: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="hora_lembrete">Horário</Label>
                <Input
                  id="hora_lembrete"
                  type="time"
                  value={formData.hora_lembrete}
                  onChange={(e) => setFormData({ ...formData, hora_lembrete: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={createLembrete.isPending || updateLembrete.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingLembrete ? 'Atualizar' : 'Salvar'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LembretesForm;
