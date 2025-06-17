
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Negocio, PIPELINE_STATUSES } from '@/hooks/usePipeline';

interface PipelineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  negocio?: Negocio | null;
  isLoading: boolean;
}

const PipelineForm: React.FC<PipelineFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  negocio,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    nome_lead: '',
    email: '',
    whatsapp: '',
    observacoes: '',
    status: 'em_desenvolvimento' as const,
    valor_negocio: 0
  });

  useEffect(() => {
    if (negocio) {
      setFormData({
        nome_lead: negocio.nome_lead,
        email: negocio.email || '',
        whatsapp: negocio.whatsapp || '',
        observacoes: negocio.observacoes || '',
        status: negocio.status,
        valor_negocio: negocio.valor_negocio
      });
    } else {
      setFormData({
        nome_lead: '',
        email: '',
        whatsapp: '',
        observacoes: '',
        status: 'em_desenvolvimento',
        valor_negocio: 0
      });
    }
  }, [negocio, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {negocio ? 'Editar Negócio' : 'Novo Negócio'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_lead">Nome do Lead *</Label>
              <Input
                id="nome_lead"
                value={formData.nome_lead}
                onChange={(e) => handleChange('nome_lead', e.target.value)}
                placeholder="Nome do cliente/lead"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PIPELINE_STATUSES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="valor_negocio">Valor do Negócio</Label>
              <Input
                id="valor_negocio"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_negocio}
                onChange={(e) => handleChange('valor_negocio', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Observações sobre o negócio..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 hover:from-slate-800 hover:via-slate-700 hover:to-blue-700"
            >
              {isLoading ? 'Salvando...' : negocio ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineForm;
