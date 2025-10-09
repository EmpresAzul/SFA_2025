import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { usePipeline } from "@/hooks/usePipeline";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { PipelineForm } from "@/components/pipeline/PipelineForm";
import { PipelineStats } from "@/components/pipeline/PipelineStats";
import { Lead } from "@/types/pipeline";

const Pipeline: React.FC = () => {
  const {
    negocios,
    loading,
    filters,
    setFilters,
    createNegocio,
    updateNegocio,
    deleteNegocio,
  } = usePipeline();

  const [editingNegocio, setEditingNegocio] = useState<Lead | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      if (editingNegocio) {
        await updateNegocio(editingNegocio.id, data);
      } else {
        await createNegocio(data);
      }
      setEditingNegocio(null);
    } catch (error) {
      console.error("Erro ao salvar negócio:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (negocio: Lead) => {
    setEditingNegocio(negocio);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este negócio?")) {
      await deleteNegocio(id);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await updateNegocio(id, { status: newStatus as any });
  };

  const handleCancel = () => {
    setEditingNegocio(null);
  };

  return (
    <div className="fluxo-container fluxo-section bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen crm-container crm-responsive">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📊 CRM
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie seus leads e acompanhe o progresso dos negócios
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingNegocio(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fluxo-btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Estatísticas no topo */}
      <div className="mb-6">
        <PipelineStats negocios={negocios} />
      </div>

      {/* Formulário de Cadastro/Edição */}
      <div className="mb-6">
        <div className="crm-form">
          <PipelineForm
            negocio={editingNegocio}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={formLoading}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="crm-filters">
        <div className="crm-filters-grid">
          <div className="space-y-2">
            <label className="crm-filter-label">Buscar leads</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar leads..."
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="fluxo-input pl-10 text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="crm-filter-label">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={(status) =>
                setFilters({ ...filters, status: status === "all" ? undefined : status })
              }
            >
              <SelectTrigger className="fluxo-select h-10 text-sm">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="prospeccao">Prospecção</SelectItem>
                <SelectItem value="qualificacao">Qualificação</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="negociacao">Negociação</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="crm-pipeline-board">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <PipelineBoard
            negocios={negocios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Pipeline;