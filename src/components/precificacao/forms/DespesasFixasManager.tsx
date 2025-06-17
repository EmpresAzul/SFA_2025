
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCurrencyInput } from '@/components/ui/enhanced-currency-input';
import { Plus, Trash2 } from 'lucide-react';
import { formatNumberToDisplay } from '@/utils/currency';
import type { DespesaFixa } from '@/hooks/useHoraForm';

interface DespesasFixasManagerProps {
  despesasFixas: DespesaFixa[];
  onUpdateDespesas: (despesas: DespesaFixa[]) => void;
}

const DespesasFixasManager: React.FC<DespesasFixasManagerProps> = ({
  despesasFixas,
  onUpdateDespesas,
}) => {
  const adicionarDespesa = () => {
    if (despesasFixas.length < 50) {
      const novaDespesa: DespesaFixa = {
        id: Date.now().toString(),
        descricao: '',
        valor: 0
      };
      onUpdateDespesas([...despesasFixas, novaDespesa]);
    }
  };

  const removerDespesa = (id: string) => {
    if (despesasFixas.length > 1) {
      onUpdateDespesas(despesasFixas.filter(despesa => despesa.id !== id));
    }
  };

  const atualizarDespesa = (id: string, campo: 'descricao' | 'valor', valor: string | number) => {
    onUpdateDespesas(despesasFixas.map(despesa => 
      despesa.id === id ? { ...despesa, [campo]: valor } : despesa
    ));
  };

  const totalCustosFixos = despesasFixas.reduce((total, despesa) => total + despesa.valor, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Despesas Fixas</CardTitle>
          <Button
            type="button"
            onClick={adicionarDespesa}
            disabled={despesasFixas.length >= 50}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600">
            <div className="col-span-6">Descrição dos Custos Fixos</div>
            <div className="col-span-4">Valor</div>
            <div className="col-span-2">Ação</div>
          </div>
          
          {despesasFixas.map((despesa) => (
            <div key={despesa.id} className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <Input
                  value={despesa.descricao}
                  onChange={(e) => atualizarDespesa(despesa.id, 'descricao', e.target.value)}
                  placeholder="Descrição do custo"
                />
              </div>
              <div className="col-span-4">
                <EnhancedCurrencyInput
                  value={despesa.valor}
                  onChange={(numericValue) => atualizarDespesa(despesa.id, 'valor', numericValue)}
                />
              </div>
              <div className="col-span-2">
                <Button
                  type="button"
                  onClick={() => removerDespesa(despesa.id)}
                  disabled={despesasFixas.length <= 1}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-semibold">
              <span>Total Custos Fixos:</span>
              <span className="text-lg">{formatNumberToDisplay(totalCustosFixos)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DespesasFixasManager;
