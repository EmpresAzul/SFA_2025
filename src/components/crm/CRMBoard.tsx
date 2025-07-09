import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, Plus, MessageSquare } from 'lucide-react';
import { useCRMLeads, useUpdateLead, useDeleteLead } from '@/hooks/useCRM';
import { LeadForm } from './LeadForm';
import { LeadViewModal } from './LeadViewModal';
import { InteractionForm } from './InteractionForm';
import type { CRMLead } from '@/types/crm';

const statusConfig = {
  prospeccao: { label: 'Prospecção', color: 'bg-blue-100 text-blue-800', order: 1 },
  qualificacao: { label: 'Qualificação', color: 'bg-yellow-100 text-yellow-800', order: 2 },
  proposta: { label: 'Proposta', color: 'bg-purple-100 text-purple-800', order: 3 },
  negociacao: { label: 'Negociação', color: 'bg-orange-100 text-orange-800', order: 4 },
  fechamento: { label: 'Fechamento', color: 'bg-green-100 text-green-800', order: 5 },
  perdido: { label: 'Perdido', color: 'bg-red-100 text-red-800', order: 6 }
};

const nextStatus = {
  prospeccao: 'qualificacao',
  qualificacao: 'proposta',
  proposta: 'negociacao',
  negociacao: 'fechamento',
  fechamento: 'fechamento',
  perdido: 'perdido'
};

export function CRMBoard() {
  const { data: leads = [], isLoading } = useCRMLeads();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isInteractionFormOpen, setIsInteractionFormOpen] = useState(false);

  const handleStatusChange = async (lead: CRMLead, newStatus: CRMLead['status']) => {
    try {
      await updateLead.mutateAsync({ id: lead.id, status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDeleteLead = async (lead: CRMLead) => {
    if (confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)) {
      try {
        await deleteLead.mutateAsync(lead.id);
      } catch (error) {
        console.error('Erro ao deletar lead:', error);
      }
    }
  };

  const handleEditLead = (lead: CRMLead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleViewLead = (lead: CRMLead) => {
    setSelectedLead(lead);
    setIsViewModalOpen(true);
  };

  const handleAddInteraction = (lead: CRMLead) => {
    setSelectedLead(lead);
    setIsInteractionFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLead(null);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedLead(null);
  };

  const handleInteractionFormClose = () => {
    setIsInteractionFormOpen(false);
    setSelectedLead(null);
  };

  const groupedLeads = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) {
      acc[lead.status] = [];
    }
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<string, CRMLead[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(statusConfig)
          .sort(([,a], [,b]) => a.order - b.order)
          .map(([status, config]) => (
            <Card key={status} className="min-h-[400px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>{config.label}</span>
                  <Badge className={config.color}>
                    {groupedLeads[status]?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedLeads[status]?.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm truncate">{lead.name}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddInteraction(lead)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Nova Interação
                          </DropdownMenuItem>
                          {nextStatus[lead.status as keyof typeof nextStatus] && 
                           nextStatus[lead.status as keyof typeof nextStatus] !== lead.status && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(lead, nextStatus[lead.status as keyof typeof nextStatus] as CRMLead['status'])}
                            >
                              Avançar Status
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteLead(lead)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{lead.company}</p>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium">
                        R$ {lead.value.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-gray-500">{lead.probability}%</span>
                    </div>

                    {lead.next_follow_up && (
                      <div className="mt-2 text-xs text-gray-500">
                        Follow-up: {new Date(lead.next_follow_up).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Modals */}
      <LeadForm 
        isOpen={isFormOpen} 
        onClose={handleFormClose} 
        lead={selectedLead}
      />

      <LeadViewModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        lead={selectedLead}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsFormOpen(true);
        }}
        onDelete={() => {
          if (selectedLead) {
            handleDeleteLead(selectedLead);
            setIsViewModalOpen(false);
          }
        }}
      />

      {selectedLead && (
        <InteractionForm
          isOpen={isInteractionFormOpen}
          onClose={handleInteractionFormClose}
          leadId={selectedLead.id}
        />
      )}
    </div>
  );
} 