
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Power, PowerOff, Clock, Calendar } from 'lucide-react';
import { useLembretes, type Lembrete } from '@/hooks/useLembretes';
import LembretesViewModal from './LembretesViewModal';

interface LembretesTableProps {
  lembretes: Lembrete[];
  onEdit: (lembrete: Lembrete) => void;
}

const LembretesTable: React.FC<LembretesTableProps> = ({ lembretes, onEdit }) => {
  const { updateLembrete, deleteLembrete } = useLembretes();

  const handleToggleStatus = async (lembrete: Lembrete) => {
    const novoStatus = lembrete.status === 'ativo' ? 'inativo' : 'ativo';
    console.log('Atualizando status de:', lembrete.id, 'para:', novoStatus);
    
    try {
      await updateLembrete.mutateAsync({
        id: lembrete.id,
        status: novoStatus
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lembrete?')) {
      try {
        await deleteLembrete.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar lembrete:', error);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return time.slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isVencido = (dataLembrete: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    return dataLembrete < hoje;
  };

  const isHoje = (dataLembrete: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    return dataLembrete === hoje;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-gray-800">Lista de Lembretes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {lembretes.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum lembrete encontrado</p>
            <p className="text-sm text-gray-400">Crie seu primeiro lembrete!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lembrete
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lembretes.map((lembrete) => (
                  <tr key={lembrete.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {lembrete.titulo}
                          </h3>
                          {isVencido(lembrete.data_lembrete) && lembrete.status === 'ativo' && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Vencido
                            </Badge>
                          )}
                          {isHoje(lembrete.data_lembrete) && lembrete.status === 'ativo' && (
                            <Badge className="ml-2 text-xs bg-orange-100 text-orange-800">
                              Hoje
                            </Badge>
                          )}
                        </div>
                        {lembrete.descricao && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {lembrete.descricao}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(lembrete.data_lembrete)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(lembrete.hora_lembrete)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(lembrete.status)}>
                        {lembrete.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <LembretesViewModal lembrete={lembrete} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(lembrete)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(lembrete)}
                          className={`hover:bg-${lembrete.status === 'ativo' ? 'orange' : 'emerald'}-50`}
                        >
                          {lembrete.status === 'ativo' ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(lembrete.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LembretesTable;
