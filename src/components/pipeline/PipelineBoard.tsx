import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { Negocio } from "@/types/pipeline";
import { formatNumberToDisplay } from "@/utils/currency";

interface PipelineBoardProps {
  negocios: Negocio[];
  onEdit: (negocio: Negocio) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
}

const statusConfig = {
  prospeccao: { label: "Prospecção", color: "bg-gray-100 text-gray-800" },
  qualificacao: { label: "Qualificação", color: "bg-blue-100 text-blue-800" },
  proposta: { label: "Proposta", color: "bg-yellow-100 text-yellow-800" },
  negociacao: { label: "Negociação", color: "bg-orange-100 text-orange-800" },
  fechado: { label: "Fechado", color: "bg-green-100 text-green-800" },
  perdido: { label: "Perdido", color: "bg-red-100 text-red-800" },
};

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  negocios,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const groupedNegocios = negocios.reduce((acc, negocio) => {
    if (!acc[negocio.status]) {
      acc[negocio.status] = [];
    }
    acc[negocio.status].push(negocio);
    return acc;
  }, {} as Record<string, Negocio[]>);

  const renderNegocioCard = (negocio: Negocio) => (
    <Card key={negocio.id} className="mb-2 hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Nome do Lead */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium truncate flex-1 mr-2">
              {negocio.nome_lead}
            </h4>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => onEdit(negocio)}
                title="Editar"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(negocio.id)}
                title="Excluir"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Valor do Projeto */}
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
            <span className="font-semibold text-green-600 text-sm">
              {negocio.valor_negocio ? formatNumberToDisplay(negocio.valor_negocio) : 'R$ 0,00'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(statusConfig).map(([status, config]) => (
        <div key={status} className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-700">{config.label}</h3>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-white">
              {groupedNegocios[status]?.length || 0}
            </Badge>
          </div>
          
          <div className="min-h-[300px] space-y-2">
            {groupedNegocios[status]?.map(renderNegocioCard) || (
              <div className="text-center text-gray-400 text-sm mt-8">
                <div className="text-gray-300 text-2xl mb-2">📋</div>
                <p>Nenhum negócio</p>
                <p className="text-xs">nesta etapa</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};