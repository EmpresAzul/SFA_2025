import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Negocio } from "@/types/pipeline";

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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNegocio, setEditingNegocio] = useState<Negocio | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      if (editingNegocio) {
        await updateNegocio(editingNegocio.id, data);
      } else {
        await createNegocio(data);
      }
      setIsFormOpen(false);
      setEditingNegocio(null);
    } catch (error) {
      console.error("Erro ao salvar negócio:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (negocio: Negocio) => {
    setEditingNegocio(negocio);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este negócio?")) {
      await deleteNegocio(id);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await updateNegocio(id, { status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Vendas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus leads e acompanhe o progresso dos negócios
          </p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingNegocio(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNegocio ? "Editar Negócio" : "Novo Lead"}
              </DialogTitle>
            </DialogHeader>
            <PipelineForm
              negocio={editingNegocio}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingNegocio(null);
              }}
              loading={formLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar leads..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.status || "all"}
          onValueChange={(status) =>
            setFilters({ ...filters, status: status === "all" ? undefined : status })
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
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

      {/* Stats */}
      <PipelineStats negocios={negocios} />

      {/* Pipeline Board */}
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
  );
};

export default Pipeline;