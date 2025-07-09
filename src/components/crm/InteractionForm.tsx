import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateInteraction } from '@/hooks/useCRM';
import type { CreateInteractionData } from '@/types/crm';

interface InteractionFormProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
}

const interactionTypes = [
  { value: 'call', label: 'Ligação' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'follow-up', label: 'Follow-up' }
];

export function InteractionForm({ isOpen, onClose, leadId }: InteractionFormProps) {
  const [formData, setFormData] = useState<CreateInteractionData>({
    lead_id: leadId,
    type: 'follow-up',
    description: '',
    outcome: '',
    interaction_date: new Date().toISOString().split('T')[0]
  });

  const createInteraction = useCreateInteraction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createInteraction.mutateAsync(formData);
      setFormData({
        lead_id: leadId,
        type: 'follow-up',
        description: '',
        outcome: '',
        interaction_date: new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (error) {
      console.error('Erro ao criar interação:', error);
    }
  };

  const handleInputChange = (field: keyof CreateInteractionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Interação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Interação</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {interactionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interaction_date">Data</Label>
            <Input
              id="interaction_date"
              type="date"
              value={formData.interaction_date}
              onChange={(e) => handleInputChange('interaction_date', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva a interação realizada..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">Resultado</Label>
            <Textarea
              id="outcome"
              value={formData.outcome}
              onChange={(e) => handleInputChange('outcome', e.target.value)}
              placeholder="Qual foi o resultado desta interação?"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createInteraction.isPending}
            >
              {createInteraction.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 