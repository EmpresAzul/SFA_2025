
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { usePipeline, PIPELINE_STATUSES, Negocio } from '@/hooks/usePipeline';
import PipelineCard from './PipelineCard';
import PipelineForm from './PipelineForm';

const PipelineBoard: React.FC = () => {
  const {
    isLoading,
    createNegocio,
    updateNegocio,
    deleteNegocio,
    moveNegocio,
    getNegociosByStatus
  } = usePipeline();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNegocio, setEditingNegocio] = useState<Negocio | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedNegocio, setDraggedNegocio] = useState<Negocio | null>(null);

  const handleCreate = () => {
    setEditingNegocio(null);
    setIsFormOpen(true);
  };

  const handleEdit = (negocio: Negocio) => {
    setEditingNegocio(negocio);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingNegocio) {
      return await updateNegocio(editingNegocio.id, data);
    } else {
      return await createNegocio(data);
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      const success = await deleteNegocio(deletingId);
      if (success) {
        setDeletingId(null);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, negocio: Negocio) => {
    setDraggedNegocio(negocio);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedNegocio) return;

    if (draggedNegocio.status !== newStatus) {
      // Calcular nova posição (no final da lista do novo status)
      const negociosNoStatus = getNegociosByStatus(newStatus);
      const novaPosicao = negociosNoStatus.length;

      await moveNegocio(draggedNegocio.id, newStatus, novaPosicao);
    }

    setDraggedNegocio(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_desenvolvimento':
        return '🔨';
      case 'assinatura_contrato':
        return '📝';
      case 'documento_aberto':
        return '📄';
      case 'fatura_final':
        return '💰';
      default:
        return '📋';
    }
  };

  const getStatusStats = (status: string) => {
    const negocios = getNegociosByStatus(status);
    const total = negocios.reduce((sum, negocio) => sum + negocio.valor_negocio, 0);
    return { count: negocios.length, total };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-600 bg-clip-text text-transparent">
            🎯 Pipeline de Vendas
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus leads e oportunidades de negócio
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 hover:from-slate-800 hover:via-slate-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Negócio
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {Object.entries(PIPELINE_STATUSES).map(([status, label]) => {
          const stats = getStatusStats(status);
          const negocios = getNegociosByStatus(status);

          return (
            <Card
              key={status}
              className="h-fit"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="mr-2">{getStatusIcon(status)}</span>
                    {label}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {stats.count}
                  </span>
                </CardTitle>
                {stats.total > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    {formatCurrency(stats.total)}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {negocios.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Nenhum negócio</p>
                    <p className="text-xs">Arraste um card aqui</p>
                  </div>
                ) : (
                  negocios.map((negocio) => (
                    <PipelineCard
                      key={negocio.id}
                      negocio={negocio}
                      onEdit={handleEdit}
                      onDelete={(id) => setDeletingId(id)}
                      isDragging={draggedNegocio?.id === negocio.id}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Form Modal */}
      <PipelineForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        negocio={editingNegocio}
        isLoading={isLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este negócio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PipelineBoard;
