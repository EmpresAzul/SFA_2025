import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  X,
  Check,
  Calendar,
  Phone,
  Mail,
  Building,
  DollarSign,
  Target,
  FileText,
  Clock,
} from "lucide-react";
import {
  useCRMLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useCreateInteraction,
  useCRMInteractions,
} from "@/hooks/useCRM";
import type {
  CRMLead,
  CreateLeadData,
  CreateInteractionData,
} from "@/types/crm";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  prospeccao: {
    label: "Prospecção",
    color: "bg-blue-100 text-blue-800",
    order: 1,
  },
  qualificacao: {
    label: "Qualificação",
    color: "bg-yellow-100 text-yellow-800",
    order: 2,
  },
  proposta: {
    label: "Proposta",
    color: "bg-purple-100 text-purple-800",
    order: 3,
  },
  negociacao: {
    label: "Negociação",
    color: "bg-orange-100 text-orange-800",
    order: 4,
  },
  fechamento: {
    label: "Fechamento",
    color: "bg-green-100 text-green-800",
    order: 5,
  },
  perdido: { label: "Perdido", color: "bg-red-100 text-red-800", order: 6 },
};

const nextStatus = {
  prospeccao: "qualificacao",
  qualificacao: "proposta",
  proposta: "negociacao",
  negociacao: "fechamento",
  fechamento: "fechamento",
  perdido: "perdido",
};

const sources = [
  "Website",
  "LinkedIn",
  "Indicação",
  "Email Marketing",
  "Evento",
  "Cold Call",
  "Outros",
];

const interactionTypes = [
  { value: "call", label: "Ligação" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Reunião" },
  { value: "proposal", label: "Proposta" },
  { value: "follow-up", label: "Follow-up" },
];

export function CRMBoard() {
  const { data: leads = [], isLoading } = useCRMLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const createInteraction = useCreateInteraction();
  const { toast } = useToast();

  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isInteractionDrawerOpen, setIsInteractionDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<CRMLead | null>(null);
  const [formData, setFormData] = useState<CreateLeadData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Website",
    value: 0,
    probability: 25,
    next_follow_up: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [interactionData, setInteractionData] = useState<CreateInteractionData>(
    {
      lead_id: "",
      type: "call",
      description: "",
      outcome: "",
      interaction_date: new Date().toISOString().split("T")[0],
    },
  );

  const { data: interactions = [] } = useCRMInteractions(selectedLead?.id);

  const handleStatusChange = async (
    lead: CRMLead,
    newStatus: CRMLead["status"],
  ) => {
    try {
      await updateLead.mutateAsync({ id: lead.id, status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDeleteLead = async (lead: CRMLead) => {
    if (confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)) {
      try {
        await deleteLead.mutateAsync(lead.id);
        if (selectedLead?.id === lead.id) {
          setIsViewDrawerOpen(false);
          setSelectedLead(null);
        }
      } catch (error) {
        console.error("Erro ao deletar lead:", error);
      }
    }
  };

  const handleEditLead = (lead: CRMLead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone || "",
      source: lead.source,
      value: lead.value,
      probability: lead.probability,
      next_follow_up:
        lead.next_follow_up || new Date().toISOString().split("T")[0],
      notes: lead.notes || "",
    });
    setIsFormOpen(true);
  };

  const handleViewLead = (lead: CRMLead) => {
    setSelectedLead(lead);
    setIsViewDrawerOpen(true);
  };

  const handleAddInteraction = (lead: CRMLead) => {
    setSelectedLead(lead);
    setInteractionData({
      lead_id: lead.id,
      type: "call",
      description: "",
      outcome: "",
      interaction_date: new Date().toISOString().split("T")[0],
    });
    setIsInteractionDrawerOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await updateLead.mutateAsync({ id: editingLead.id, ...formData });
        setEditingLead(null);
        toast({ title: "Lead atualizado com sucesso!", variant: "success" });
      } else {
        await createLead.mutateAsync({ ...formData, status: "prospeccao" });
        toast({ title: "Lead criado com sucesso!", variant: "success" });
      }
      setIsFormOpen(false);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        source: "Website",
        value: 0,
        probability: 25,
        next_follow_up: new Date().toISOString().split("T")[0],
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar lead",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao salvar lead:", error);
    }
  };

  const handleInteractionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInteraction.mutateAsync(interactionData);
      setIsInteractionDrawerOpen(false);
      setInteractionData({
        lead_id: "",
        type: "call",
        description: "",
        outcome: "",
        interaction_date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Erro ao criar interação:", error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLead(null);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "Website",
      value: 0,
      probability: 25,
      next_follow_up: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const groupedLeads = leads.reduce(
    (acc, lead) => {
      if (!acc[lead.status]) {
        acc[lead.status] = [];
      }
      acc[lead.status].push(lead);
      return acc;
    },
    {} as Record<string, CRMLead[]>,
  );

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
        <Button onClick={() => setIsFormOpen(true)} variant="fluxo">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Formulário Inline */}
      {isFormOpen && (
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {editingLead ? "Editar Lead" : "Novo Lead"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleFormClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Origem</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, source: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valor (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probabilidade (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        probability: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next_follow_up">Próximo Follow-up</Label>
                  <Input
                    id="next_follow_up"
                    type="date"
                    value={formData.next_follow_up}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        next_follow_up: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFormClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="fluxo"
                  disabled={createLead.isPending || updateLead.isPending}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingLead ? "Atualizar" : "Criar"} Lead
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(statusConfig)
          .sort(([, a], [, b]) => a.order - b.order)
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
                    className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleViewLead(lead)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
                        {lead.name}
                      </h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewLead(lead)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditLead(lead)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddInteraction(lead)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Nova Interação
                          </DropdownMenuItem>
                          {nextStatus[lead.status as keyof typeof nextStatus] &&
                            nextStatus[
                              lead.status as keyof typeof nextStatus
                            ] !== lead.status && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    lead,
                                    nextStatus[
                                      lead.status as keyof typeof nextStatus
                                    ] as CRMLead["status"],
                                  )
                                }
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

                    <p className="text-xs text-gray-600 mb-2 flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      {lead.company}
                    </p>

                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-medium flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        R$ {lead.value.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-gray-500 flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        {lead.probability}%
                      </span>
                    </div>

                    {lead.next_follow_up && (
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Follow-up:{" "}
                        {new Date(lead.next_follow_up).toLocaleDateString(
                          "pt-BR",
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Drawer de Visualização */}
      <Sheet open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Detalhes do Lead</SheetTitle>
          </SheetHeader>
          {selectedLead && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedLead.name}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Building className="w-4 h-4 mr-2" />
                    {selectedLead.company}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedLead.email}</span>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedLead.phone}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Valor</Label>
                    <p className="font-semibold">
                      R$ {selectedLead.value.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">
                      Probabilidade
                    </Label>
                    <p className="font-semibold">{selectedLead.probability}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Origem</Label>
                    <p className="font-semibold">{selectedLead.source}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Badge className={statusConfig[selectedLead.status].color}>
                      {statusConfig[selectedLead.status].label}
                    </Badge>
                  </div>
                </div>

                {selectedLead.next_follow_up && (
                  <div>
                    <Label className="text-xs text-gray-500">
                      Próximo Follow-up
                    </Label>
                    <p className="font-semibold">
                      {new Date(selectedLead.next_follow_up).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                )}

                {selectedLead.notes && (
                  <div>
                    <Label className="text-xs text-gray-500">Observações</Label>
                    <p className="text-sm mt-1">{selectedLead.notes}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Interações</h4>
                  <Button
                    size="sm"
                    onClick={() => handleAddInteraction(selectedLead)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Interação
                  </Button>
                </div>

                {interactions.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Nenhuma interação registrada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {interactions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className="border rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-xs">
                            {
                              interactionTypes.find(
                                (t) => t.value === interaction.type,
                              )?.label
                            }
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              interaction.interaction_date,
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-sm mb-1">
                          {interaction.description}
                        </p>
                        {interaction.outcome && (
                          <p className="text-xs text-gray-600">
                            Resultado: {interaction.outcome}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleEditLead(selectedLead)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteLead(selectedLead)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Drawer de Interação */}
      <Sheet
        open={isInteractionDrawerOpen}
        onOpenChange={setIsInteractionDrawerOpen}
      >
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Nova Interação</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleInteractionSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interaction-type">Tipo de Interação</Label>
              <Select
                value={interactionData.type}
                onValueChange={(value) =>
                  setInteractionData((prev) => ({
                    ...prev,
                    type: value as InteractionType,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {interactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interaction-date">Data</Label>
              <Input
                id="interaction-date"
                type="date"
                value={interactionData.interaction_date}
                onChange={(e) =>
                  setInteractionData((prev) => ({
                    ...prev,
                    interaction_date: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interaction-description">Descrição *</Label>
              <Textarea
                id="interaction-description"
                value={interactionData.description}
                onChange={(e) =>
                  setInteractionData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interaction-outcome">Resultado</Label>
              <Textarea
                id="interaction-outcome"
                value={interactionData.outcome}
                onChange={(e) =>
                  setInteractionData((prev) => ({
                    ...prev,
                    outcome: e.target.value,
                  }))
                }
                rows={2}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInteractionDrawerOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createInteraction.isPending}
              >
                <Check className="w-4 h-4 mr-2" />
                Salvar Interação
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
