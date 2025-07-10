import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MoreHorizontal, Edit, Trash2, Search, Check, X, Plus, Eye, Building, DollarSign, Target, Calendar, Phone, Mail, TrendingUp, Users, Activity } from 'lucide-react';
import { useCRMLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/useCRM';
import type { CRMLead, CreateLeadData } from '@/types/crm';

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

const sources = [
  'Website',
  'LinkedIn',
  'Indicação',
  'Email Marketing',
  'Evento',
  'Cold Call',
  'Outros'
];

export function CRMLeads() {
  const { data: leads = [], isLoading } = useCRMLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CRMLead>>({});
  const [formData, setFormData] = useState<CreateLeadData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website',
    value: 0,
    probability: 25,
    next_follow_up: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const handleInputChange = (field: keyof CreateLeadData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field: keyof CRMLead, value: string | number) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead.mutateAsync(formData);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        source: 'Website',
        value: 0,
        probability: 25,
        next_follow_up: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setIsFormExpanded(false);
    } catch (error) {
      console.error('Erro ao cadastrar lead:', error);
    }
  };

  const handleEdit = (lead: CRMLead) => {
    setEditingId(lead.id);
    setEditData(lead);
  };

  const handleEditSave = async (lead: CRMLead) => {
    try {
      await updateLead.mutateAsync({ id: lead.id, ...editData });
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Erro ao editar lead:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (lead: CRMLead) => {
    if (confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)) {
      try {
        await deleteLead.mutateAsync(lead.id);
      } catch (error) {
        console.error('Erro ao deletar lead:', error);
      }
    }
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
  const activeLeads = filteredLeads.filter(lead => lead.status !== 'perdido' && lead.status !== 'fechamento').length;
  const conversionRate = leads.length > 0 ? Math.round((filteredLeads.filter(l => l.status === 'fechamento').length / leads.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{filteredLeads.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              R$ {totalValue.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-2 text-purple-600" />
              Probabilidade Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{avgProbability}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário Inline */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              Novo Lead
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isFormExpanded ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        {isFormExpanded && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nome *</Label>
                  <Input 
                    id="name"
                    placeholder="Nome do contato" 
                    value={formData.name} 
                    onChange={e => handleInputChange('name', e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">Empresa *</Label>
                  <Input 
                    id="company"
                    placeholder="Nome da empresa" 
                    value={formData.company} 
                    onChange={e => handleInputChange('company', e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input 
                    id="email"
                    placeholder="email@exemplo.com" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => handleInputChange('email', e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                  <Input 
                    id="phone"
                    placeholder="(11) 99999-9999" 
                    value={formData.phone} 
                    onChange={e => handleInputChange('phone', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-sm font-medium">Origem</Label>
                  <Select value={formData.source} onValueChange={value => handleInputChange('source', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-sm font-medium">Valor (R$)</Label>
                  <Input 
                    id="value"
                    placeholder="0,00" 
                    type="number" 
                    value={formData.value} 
                    onChange={e => handleInputChange('value', parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability" className="text-sm font-medium">Probabilidade (%)</Label>
                  <Input 
                    id="probability"
                    placeholder="25" 
                    type="number" 
                    min="0"
                    max="100"
                    value={formData.probability} 
                    onChange={e => handleInputChange('probability', parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next_follow_up" className="text-sm font-medium">Próximo Follow-up</Label>
                  <Input 
                    id="next_follow_up"
                    type="date" 
                    value={formData.next_follow_up} 
                    onChange={e => handleInputChange('next_follow_up', e.target.value)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="notes" className="text-sm font-medium">Observações</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Informações adicionais sobre o lead..." 
                    value={formData.notes} 
                    onChange={e => handleInputChange('notes', e.target.value)} 
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormExpanded(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Check className="w-4 h-4 mr-2" />
                  Cadastrar Lead
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Nome, empresa ou email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter" className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Probabilidade</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhum lead encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.source}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          {lead.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-3 h-3 mr-1" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[lead.status]}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium flex items-center">
                          <DollarSign className="w-3 h-3 mr-1 text-green-600" />
                          R$ {lead.value.toLocaleString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Target className="w-3 h-3 mr-1 text-blue-600" />
                          {lead.probability}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.next_follow_up ? (
                          <div className="flex items-center text-sm">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {new Date(lead.next_follow_up).toLocaleDateString('pt-BR')}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Não agendado</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(lead)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(lead)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Editar Lead</h3>
              <Button variant="ghost" size="sm" onClick={handleEditCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium">Nome *</Label>
                  <Input
                    id="edit-name"
                    value={editData.name || ''}
                    onChange={e => handleEditInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company" className="text-sm font-medium">Empresa *</Label>
                  <Input
                    id="edit-company"
                    value={editData.company || ''}
                    onChange={e => handleEditInputChange('company', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editData.email || ''}
                    onChange={e => handleEditInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone" className="text-sm font-medium">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={editData.phone || ''}
                    onChange={e => handleEditInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-source" className="text-sm font-medium">Origem</Label>
                  <Select 
                    value={editData.source || 'Website'} 
                    onValueChange={value => handleEditInputChange('source', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-sm font-medium">Status</Label>
                  <Select 
                    value={editData.status || 'prospeccao'} 
                    onValueChange={value => handleEditInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-value" className="text-sm font-medium">Valor (R$)</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={editData.value || 0}
                    onChange={e => handleEditInputChange('value', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-probability" className="text-sm font-medium">Probabilidade (%)</Label>
                  <Input
                    id="edit-probability"
                    type="number"
                    min="0"
                    max="100"
                    value={editData.probability || 0}
                    onChange={e => handleEditInputChange('probability', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-next-follow-up" className="text-sm font-medium">Próximo Follow-up</Label>
                  <Input
                    id="edit-next-follow-up"
                    type="date"
                    value={editData.next_follow_up || ''}
                    onChange={e => handleEditInputChange('next_follow_up', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-notes" className="text-sm font-medium">Observações</Label>
                  <Textarea
                    id="edit-notes"
                    value={editData.notes || ''}
                    onChange={e => handleEditInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleEditCancel}>
                  Cancelar
                </Button>
                <Button onClick={() => handleEditSave(leads.find(l => l.id === editingId)!)}>
                  <Check className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 