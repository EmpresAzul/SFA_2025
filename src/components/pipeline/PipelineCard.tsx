
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, User, Mail, Phone, DollarSign } from 'lucide-react';
import { Negocio } from '@/hooks/usePipeline';

interface PipelineCardProps {
  negocio: Negocio;
  onEdit: (negocio: Negocio) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const PipelineCard: React.FC<PipelineCardProps> = ({
  negocio,
  onEdit,
  onDelete,
  isDragging = false
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_desenvolvimento':
        return 'bg-yellow-100 text-yellow-800';
      case 'assinatura_contrato':
        return 'bg-blue-100 text-blue-800';
      case 'documento_aberto':
        return 'bg-purple-100 text-purple-800';
      case 'fatura_final':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing border-l-4 border-l-blue-500 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', negocio.id);
        e.dataTransfer.setData('application/json', JSON.stringify(negocio));
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header com nome e valor */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center">
                <User className="h-4 w-4 mr-1 text-blue-600" />
                {negocio.nome_lead}
              </h3>
              {negocio.valor_negocio > 0 && (
                <p className="text-sm font-medium text-green-600 mt-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatCurrency(negocio.valor_negocio)}
                </p>
              )}
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-1">
            {negocio.email && (
              <p className="text-xs text-gray-600 flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {negocio.email}
              </p>
            )}
            {negocio.whatsapp && (
              <p className="text-xs text-gray-600 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {negocio.whatsapp}
              </p>
            )}
          </div>

          {/* Observações */}
          {negocio.observacoes && (
            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              {negocio.observacoes.length > 80 
                ? `${negocio.observacoes.substring(0, 80)}...` 
                : negocio.observacoes
              }
            </p>
          )}

          {/* Footer com ações */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-gray-400">
              {new Date(negocio.created_at).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(negocio)}
                className="h-6 w-6 p-0 hover:bg-blue-100"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(negocio.id)}
                className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineCard;
