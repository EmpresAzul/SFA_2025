
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Lancamento } from '@/hooks/useLancamentos';

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

interface LancamentosTableProps {
  lancamentos: LancamentoComRelacoes[];
  isLoading: boolean;
  onEdit: (lancamento: LancamentoComRelacoes) => void;
  onDelete: (id: string) => void;
}

const LancamentosTable: React.FC<LancamentosTableProps> = ({
  lancamentos,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const getTipoClasses = (tipo: string) => {
    return tipo === 'receita' 
      ? 'bg-emerald-100 text-emerald-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lançamentos ({lancamentos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Cliente/Fornecedor</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && lancamentos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Nenhum lançamento encontrado
                </TableCell>
              </TableRow>
            )}
            {lancamentos.map((lancamento) => (
              <TableRow key={lancamento.id}>
                <TableCell>{format(new Date(lancamento.data), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <Badge className={getTipoClasses(lancamento.tipo)}>
                    {lancamento.tipo === 'receita' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell className={lancamento.tipo === 'receita' ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                  R$ {lancamento.valor.toFixed(2)}
                </TableCell>
                <TableCell>{lancamento.categoria}</TableCell>
                <TableCell>{lancamento.cliente?.nome || lancamento.fornecedor?.nome || '-'}</TableCell>
                <TableCell>{lancamento.observacoes || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(lancamento)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(lancamento.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LancamentosTable;
