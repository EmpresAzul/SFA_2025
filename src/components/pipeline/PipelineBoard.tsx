import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Mail, DollarSign } from "lucide-react";
import { Negocio } from "@/types/pipeline";
import { formatNumberToDisplay } from "@/utils/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <Card key={negocio.id} className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">
            {negocio.nome_lead}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(negocio)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(negocio.id)}
                className="text-red-600"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {negocio.valor_negocio && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-3 w-3 mr-1 text-green-600" />
              <span className="font-medium text-green-600">
                {formatNumberToDisplay(negocio.valor_negocio)}
              </span>
            </div>
          )}
          
          <div className="flex flex-col space-y-1">
            {negocio.email && (
              <div className="flex items-center text-xs text-gray-600">
                <Mail className="h-3 w-3 mr-1" />
                <span className="truncate">{negocio.email}</span>
              </div>
            )}
            {negocio.whatsapp && (
              <div className="flex items-center text-xs text-gray-600">
                <Phone className="h-3 w-3 mr-1" />
                <span>{negocio.whatsapp}</span>
              </div>
            )}
          </div>

          {negocio.observacoes && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {negocio.observacoes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(statusConfig).map(([status, config]) => (
        <div key={status} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">{config.label}</h3>
            <Badge variant="secondary" className="text-xs">
              {groupedNegocios[status]?.length || 0}
            </Badge>
          </div>
          
          <div className="min-h-[400px]">
            {groupedNegocios[status]?.map(renderNegocioCard) || (
              <div className="text-center text-gray-400 text-sm mt-8">
                Nenhum negócio nesta etapa
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};