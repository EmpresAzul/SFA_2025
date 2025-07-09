import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  FileText
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'perdido';
  value: number;
  probability: number;
  nextFollowUp: string;
  notes: string;
  createdAt: string;
  lastContact: string;
}

interface Interaction {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'follow-up';
  description: string;
  date: string;
  outcome: string;
}

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'João Silva',
      company: 'Tech Solutions Ltda',
      email: 'joao@techsolutions.com',
      phone: '(11) 99999-9999',
      source: 'Website',
      status: 'prospeccao',
      value: 15000,
      probability: 25,
      nextFollowUp: '2024-01-15',
      notes: 'Interessado em solução de gestão financeira',
      createdAt: '2024-01-10',
      lastContact: '2024-01-12'
    },
    {
      id: '2',
      name: 'Maria Santos',
      company: 'Consultoria ABC',
      email: 'maria@consultoriaabc.com',
      phone: '(11) 88888-8888',
      source: 'Indicação',
      status: 'qualificacao',
      value: 25000,
      probability: 50,
      nextFollowUp: '2024-01-18',
      notes: 'Necessita de demonstração do produto',
      createdAt: '2024-01-08',
      lastContact: '2024-01-14'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      company: 'Empresa XYZ',
      email: 'pedro@xyz.com',
      phone: '(11) 77777-7777',
      source: 'LinkedIn',
      status: 'proposta',
      value: 35000,
      probability: 75,
      nextFollowUp: '2024-01-20',
      notes: 'Proposta enviada, aguardando resposta',
      createdAt: '2024-01-05',
      lastContact: '2024-01-16'
    }
  ]);

  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: '1',
      leadId: '1',
      type: 'call',
      description: 'Primeiro contato realizado',
      date: '2024-01-12',
      outcome: 'Lead interessado, agendou demonstração'
    },
    {
      id: '2',
      leadId: '2',
      type: 'meeting',
      description: 'Demonstração do produto',
      date: '2024-01-14',
      outcome: 'Demonstração bem-sucedida, solicitou proposta'
    }
  ]);

  const [newLeadDialog, setNewLeadDialog] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({});

  const getStatusColor = (status: string) => {
    const colors = {
      prospeccao: 'bg-blue-100 text-blue-800',
      qualificacao: 'bg-yellow-100 text-yellow-800',
      proposta: 'bg-orange-100 text-orange-800',
      negociacao: 'bg-purple-100 text-purple-800',
      fechamento: 'bg-green-100 text-green-800',
      perdido: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      prospeccao: 'Prospecção',
      qualificacao: 'Qualificação',
      proposta: 'Proposta',
      negociacao: 'Negociação',
      fechamento: 'Fechamento',
      perdido: 'Perdido'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getInteractionIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      proposal: FileText,
      'follow-up': Clock
    };
    return icons[type as keyof typeof icons] || Clock;
  };

  const addNewLead = () => {
    if (newLead.name && newLead.company && newLead.email) {
      const lead: Lead = {
        id: Date.now().toString(),
        name: newLead.name!,
        company: newLead.company!,
        email: newLead.email!,
        phone: newLead.phone || '',
        source: newLead.source || 'Website',
        status: 'prospeccao',
        value: newLead.value || 0,
        probability: 25,
        nextFollowUp: newLead.nextFollowUp || new Date().toISOString().split('T')[0],
        notes: newLead.notes || '',
        createdAt: new Date().toISOString().split('T')[0],
        lastContact: new Date().toISOString().split('T')[0]
      };
      setLeads([...leads, lead]);
      setNewLead({});
      setNewLeadDialog(false);
    }
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const weightedValue = leads.reduce((sum, lead) => sum + (lead.value * lead.probability / 100), 0);
  const activeLeads = leads.filter(lead => lead.status !== 'perdido').length;
  const conversionRate = ((leads.filter(lead => lead.status === 'fechamento').length / leads.length) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-fluxo-text">CRM - Gestão de Vendas</h1>
          <p className="text-gray-600 mt-2">Gerencie seus leads, oportunidades e pipeline de vendas</p>
        </div>
        <Dialog open={newLeadDialog} onOpenChange={setNewLeadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input 
                  value={newLead.name || ''} 
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Nome do contato"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Empresa *</label>
                <Input 
                  value={newLead.company || ''} 
                  onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input 
                  value={newLead.email || ''} 
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="email@empresa.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input 
                  value={newLead.phone || ''} 
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Origem</label>
                <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Valor Estimado</label>
                <Input 
                  type="number"
                  value={newLead.value || ''} 
                  onChange={(e) => setNewLead({...newLead, value: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Observações</label>
                <Textarea 
                  value={newLead.notes || ''} 
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  placeholder="Informações adicionais..."
                />
              </div>
              <Button onClick={addNewLead} className="w-full">Adicionar Lead</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeLeads} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalValue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {weightedValue.toLocaleString('pt-BR')} ponderado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {leads.filter(lead => lead.status === 'fechamento').length} fechados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Follow-ups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => new Date(lead.nextFollowUp) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechamento'].map((status) => (
                  <div key={status} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {leads.filter(lead => lead.status === status).length}
                    </div>
                    <div className="text-sm text-gray-600">{getStatusLabel(status)}</div>
                    <div className="text-xs text-gray-500">
                      R$ {leads.filter(lead => lead.status === status).reduce((sum, lead) => sum + lead.value, 0).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Interactions */}
          <Card>
            <CardHeader>
              <CardTitle>Interações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interactions.slice(0, 5).map((interaction) => {
                  const lead = leads.find(l => l.id === interaction.leadId);
                  const Icon = getInteractionIcon(interaction.type);
                  return (
                    <div key={interaction.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium">{lead?.name} - {lead?.company}</div>
                        <div className="text-sm text-gray-600">{interaction.description}</div>
                        <div className="text-xs text-gray-500">{interaction.date}</div>
                      </div>
                      <Badge variant="outline">{interaction.type}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Pipeline Board */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {['prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechamento'].map((status) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{getStatusLabel(status)}</h3>
                  <Badge className={getStatusColor(status)}>
                    {leads.filter(lead => lead.status === status).length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {leads.filter(lead => lead.status === status).map((lead) => (
                    <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-gray-600">{lead.company}</div>
                          <div className="text-sm font-semibold text-green-600">
                            R$ {lead.value.toLocaleString('pt-BR')}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {lead.probability}%
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {lead.nextFollowUp}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-gray-600">{lead.company}</div>
                          </div>
                          <Badge className={getStatusColor(lead.status)}>
                            {getStatusLabel(lead.status)}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          R$ {lead.value.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.probability}% de chance
                        </div>
                        <div className="text-xs text-gray-400">
                          Próximo contato: {lead.nextFollowUp}
                        </div>
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {lead.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM; 