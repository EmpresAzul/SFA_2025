import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCRMInteractions } from '@/hooks/useCRM';
import type { CRMLead } from '@/types/crm';

interface LeadViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: CRMLead | null;
  onEdit: () => void;
  onDelete: () => void;
}

const statusLabels = {
  prospeccao: 'Prospecção',
  qualificacao: 'Qualificação',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  fechamento: 'Fechamento',
  perdido: 'Perdido'
};

const statusColors = {
  prospeccao: 'bg-blue-100 text-blue-800',
  qualificacao: 'bg-yellow-100 text-yellow-800',
  proposta: 'bg-purple-100 text-purple-800',
  negociacao: 'bg-orange-100 text-orange-800',
  fechamento: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800'
};

export function LeadViewModal({ isOpen, onClose, lead, onEdit, onDelete }: LeadViewModalProps) {
  const { data: interactions = [] } = useCRMInteractions(lead?.id);

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Lead</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Excluir
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-sm">{lead.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Empresa</label>
                <p className="text-sm">{lead.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{lead.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <p className="text-sm">{lead.phone || 'Não informado'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status e Valores */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Status e Valores</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge className={statusColors[lead.status]}>
                    {statusLabels[lead.status]}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Origem</label>
                <p className="text-sm">{lead.source}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Valor</label>
                <p className="text-sm font-semibold">
                  R$ {lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Probabilidade</label>
                <p className="text-sm">{lead.probability}%</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Datas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Datas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Criado em</label>
                <p className="text-sm">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Próximo Follow-up</label>
                <p className="text-sm">
                  {lead.next_follow_up 
                    ? new Date(lead.next_follow_up).toLocaleDateString('pt-BR')
                    : 'Não agendado'
                  }
                </p>
              </div>
            </div>
          </div>

          {lead.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Observações</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Interações */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Interações ({interactions.length})</h3>
            {interactions.length > 0 ? (
              <div className="space-y-3">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {interaction.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(interaction.interaction_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{interaction.description}</p>
                    {interaction.outcome && (
                      <p className="text-xs text-gray-600">
                        <strong>Resultado:</strong> {interaction.outcome}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma interação registrada</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 