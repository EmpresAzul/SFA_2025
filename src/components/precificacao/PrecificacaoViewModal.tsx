
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Wrench, Clock, Calendar, DollarSign, Percent, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { Database } from '@/integrations/supabase/types';

type Precificacao = Database['public']['Tables']['precificacao']['Row'];

interface PrecificacaoViewModalProps {
  item: Precificacao | null;
  isOpen: boolean;
  onClose: () => void;
}

const PrecificacaoViewModal: React.FC<PrecificacaoViewModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!item) return null;

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Produto':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'Serviço':
        return <Wrench className="h-5 w-5 text-purple-600" />;
      case 'Hora':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTipoIcon(item.tipo)}
            Detalhes do Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome
                </label>
                <p className="text-gray-900 font-medium">{item.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tipo
                </label>
                <div className="flex items-center gap-2">
                  {getTipoIcon(item.tipo)}
                  <Badge variant="outline">{item.tipo}</Badge>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Categoria
                </label>
                <p className="text-gray-900">{item.categoria}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <Badge variant={item.status === 'ativo' ? 'default' : 'secondary'}>
                  {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Informações Financeiras */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Preço Final
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(item.preco_final)}
                </p>
              </div>
              {item.margem_lucro && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Margem de Lucro
                  </label>
                  <p className="text-lg font-semibold text-blue-600 flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    {item.margem_lucro}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dados Específicos (JSON) */}
          {item.dados_json && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Dados Específicos
              </h3>
              <div className="bg-white rounded p-3 max-h-40 overflow-y-auto">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(item.dados_json, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Informações de Sistema */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Informações de Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Criado em
                </label>
                <p className="text-gray-900">{formatDate(item.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Última atualização
                </label>
                <p className="text-gray-900">{formatDate(item.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrecificacaoViewModal;
