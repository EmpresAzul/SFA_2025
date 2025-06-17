
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCurrencyInput } from '@/components/ui/enhanced-currency-input';
import { Plus, Trash2 } from 'lucide-react';

interface CustoProduto {
  id: string;
  descricao: string;
  valor: number;
}

interface CustosManagerProps {
  custos: CustoProduto[];
  onUpdateCustos: (custos: CustoProduto[]) => void;
}

const CustosManager: React.FC<CustosManagerProps> = ({
  custos,
  onUpdateCustos,
}) => {
  const adicionarCusto = () => {
    if (custos.length < 20) {
      const novoCusto: CustoProduto = {
        id: Date.now().toString(),
        descricao: '',
        valor: 0
      };
      onUpdateCustos([...custos, novoCusto]);
    }
  };

  const removerCusto = (id: string) => {
    if (custos.length > 1) {
      onUpdateCustos(custos.filter(custo => custo.id !== id));
    }
  };

  const atualizarCusto = (id: string, campo: 'descricao' | 'valor', valor: string | number) => {
    onUpdateCustos(custos.map(custo => 
      custo.id === id ? { ...custo, [campo]: valor } : custo
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Custos do Produto</CardTitle>
          <Button
            type="button"
            onClick={adicionarCusto}
            disabled={custos.length >= 20}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Custo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600">
            <div className="col-span-6">Descrição do Custo</div>
            <div className="col-span-4">Valor</div>
            <div className="col-span-2">Ação</div>
          </div>
          
          {custos.map((custo) => (
            <div key={custo.id} className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <Input
                  value={custo.descricao}
                  onChange={(e) => atualizarCusto(custo.id, 'descricao', e.target.value)}
                  placeholder="Descrição do custo"
                />
              </div>
              <div className="col-span-4">
                <EnhancedCurrencyInput
                  value={custo.valor}
                  onChange={(numericValue) => atualizarCusto(custo.id, 'valor', numericValue)}
                />
              </div>
              <div className="col-span-2">
                <Button
                  type="button"
                  onClick={() => removerCusto(custo.id)}
                  disabled={custos.length <= 1}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustosManager;
