import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Percent } from "lucide-react";

export interface TaxaAdicional {
  id: string;
  descricao: string;
  percentual: number;
}

interface TaxasAdicionaisManagerProps {
  taxasAdicionais: TaxaAdicional[];
  onUpdateTaxas: (taxas: TaxaAdicional[]) => void;
}

const TaxasAdicionaisManager: React.FC<TaxasAdicionaisManagerProps> = ({
  taxasAdicionais,
  onUpdateTaxas,
}) => {
  const adicionarTaxa = () => {
    const novaTaxa: TaxaAdicional = {
      id: Date.now().toString(),
      descricao: "",
      percentual: 0,
    };
    onUpdateTaxas([...taxasAdicionais, novaTaxa]);
  };

  const removerTaxa = (id: string) => {
    if (taxasAdicionais.length > 1) {
      onUpdateTaxas(taxasAdicionais.filter((taxa) => taxa.id !== id));
    }
  };

  const atualizarTaxa = (
    id: string,
    campo: keyof TaxaAdicional,
    valor: string | number,
  ) => {
    onUpdateTaxas(
      taxasAdicionais.map((taxa) =>
        taxa.id === id ? { ...taxa, [campo]: valor } : taxa,
      ),
    );
  };

  const formatarPercentual = (valor: string): number => {
    const numeroLimpo = valor.replace(/[^\d,.-]/g, "").replace(",", ".");
    const numero = parseFloat(numeroLimpo) || 0;
    return Math.max(0, Math.min(100, numero)); // Limitar entre 0 e 100
  };

  const totalPercentual = taxasAdicionais.reduce(
    (total, taxa) => total + taxa.percentual,
    0,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Percent className="w-5 h-5 text-purple-600" />
          💸 Taxas Adicionais
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure taxas percentuais que serão somadas à margem de lucro
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {taxasAdicionais.map((taxa, index) => (
            <div
              key={taxa.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="space-y-2">
                <Label htmlFor={`descricao-taxa-${taxa.id}`}>
                  Descrição da Taxa {index + 1}
                </Label>
                <Input
                  id={`descricao-taxa-${taxa.id}`}
                  value={taxa.descricao}
                  onChange={(e) =>
                    atualizarTaxa(taxa.id, "descricao", e.target.value)
                  }
                  placeholder="Ex: Taxa de administração, ISS, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`percentual-taxa-${taxa.id}`}>
                  Percentual (%)
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={`percentual-taxa-${taxa.id}`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxa.percentual}
                      onChange={(e) =>
                        atualizarTaxa(
                          taxa.id,
                          "percentual",
                          formatarPercentual(e.target.value),
                        )
                      }
                      placeholder="0,00"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                      %
                    </span>
                  </div>

                  {taxasAdicionais.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerTaxa(taxa.id)}
                      className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={adicionarTaxa}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Taxa
          </Button>

          <div className="text-right">
            <p className="text-sm text-gray-600">Total de Taxas:</p>
            <p className="text-lg font-semibold text-purple-600">
              {totalPercentual.toFixed(2)}%
            </p>
          </div>
        </div>

        {totalPercentual > 0 && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              💡 As taxas adicionais serão somadas à margem de lucro para
              calcular o valor final
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxasAdicionaisManager;
