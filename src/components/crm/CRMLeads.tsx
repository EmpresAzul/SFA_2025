import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Eye, Edit, Trash2, Plus, Search } from 'lucide-react';
import { useCRMLeads, useUpdateLead, useDeleteLead } from '@/hooks/useCRM';
import { LeadForm } from './LeadForm';
import { LeadViewModal } from './LeadViewModal';
import { InteractionForm } from './InteractionForm';
import type { CRMLead } from '@/types/crm';

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

export function CRMLeads() {
  const { data: leads = [], isLoading } = useCRMLeads();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isInteractionFormOpen, setIsInteractionFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  const avgProbability = filteredLeads.length > 0 
    ? Math.round(filteredLeads.reduce((sum, lead) => sum + lead.probability, 0) / filteredLeads.length)
    : 0;

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
        <h2 className="text-2xl font-bold">Leads</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLeads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalValue.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Probabilidade Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProbability}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, empresa ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead>Próximo Follow-up</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[lead.status]}>
                      {statusLabels[lead.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    R$ {lead.value.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{lead.probability}%</TableCell>
                  <TableCell>
                    {lead.next_follow_up 
                      ? new Date(lead.next_follow_up).toLocaleDateString('pt-BR')
                      : 'Não agendado'
                    }
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
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
                          <Plus className="w-4 h-4 mr-2" />
                          Nova Interação
                        </DropdownMenuItem>
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <DropdownMenuItem 
                            key={status}
                            onClick={() => handleStatusChange(lead, status as CRMLead['status'])}
                            disabled={lead.status === status}
                          >
                            Mudar para {label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteLead(lead)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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