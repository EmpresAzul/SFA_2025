import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { unidadesMedida } from "@/types/estoque";

interface EstoqueFormProps {
  formData: {
    data: string;
    nome_produto: string;
    unidade_medida: string;
    quantidade: string;
    valor_unitario: string;
    valor_total: string;
    quantidade_bruta: string;
    quantidade_liquida: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      data: string;
      nome_produto: string;
      unidade_medida: string;
      quantidade: string;
      valor_unitario: string;
      valor_total: string;
      quantidade_bruta: string;
      quantidade_liquida: string;
    }>
  >;
  loading: boolean;
  isEditMode: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

export const EstoqueForm: React.FC<EstoqueFormProps> = ({
  formData,
  setFormData,
  loading,
  isEditMode,
  handleSubmit,
  resetForm,
}) => {
  useEffect(() => {
    // Calcular valor total automaticamente
    const quantidade = parseFloat(formData.quantidade) || 0;
    const valorUnitario = parseFloat(formData.valor_unitario) || 0;
    const valorTotal = quantidade * valorUnitario;
    setFormData((prev) => ({ ...prev, valor_total: valorTotal.toFixed(2) }));
  }, [formData.quantidade, formData.valor_unitario, setFormData]);

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isEditMode ? "✏️ Editar Item do Estoque" : "➕ Cadastrar Novo Item"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="data" className="text-gray-700 font-medium">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                required
                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="nome_produto"
                className="text-gray-700 font-medium"
              >
                Nome do Produto
              </Label>
              <Input
                id="nome_produto"
                value={formData.nome_produto}
                onChange={(e) =>
                  setFormData({ ...formData, nome_produto: e.target.value })
                }
                placeholder="Digite o nome do produto"
                required
                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="unidade_medida"
                className="text-gray-700 font-medium"
              >
                Unidade de Medida
              </Label>
              <Select
                value={formData.unidade_medida}
                onValueChange={(value) =>
                  setFormData({ ...formData, unidade_medida: value })
                }
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesMedida.map((unidade) => (
                    <SelectItem key={unidade} value={unidade}>
                      {unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade" className="text-gray-700 font-medium">
                Quantidade
              </Label>
              <Input
                id="quantidade"
                type="number"
                step="0.01"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({ ...formData, quantidade: e.target.value })
                }
                placeholder="0.00"
                required
                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="valor_unitario"
                className="text-gray-700 font-medium"
              >
                Valor Unitário (R$)
              </Label>
              <Input
                id="valor_unitario"
                type="number"
                step="0.01"
                value={formData.valor_unitario}
                onChange={(e) =>
                  setFormData({ ...formData, valor_unitario: e.target.value })
                }
                placeholder="0.00"
                required
                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="valor_total"
                className="text-gray-700 font-medium"
              >
                Valor Total (R$)
              </Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                value={formData.valor_total}
                readOnly
                className="h-12 bg-green-50 border-2 border-green-200 rounded-lg font-semibold text-green-700"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="quantidade_bruta"
                className="text-gray-700 font-medium"
              >
                Quantidade Bruta
              </Label>
              <Input
                id="quantidade_bruta"
                type="number"
                step="0.01"
                value={formData.quantidade_bruta}
                onChange={(e) =>
                  setFormData({ ...formData, quantidade_bruta: e.target.value })
                }
                placeholder="0.00"
                required
                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="quantidade_liquida"
                className="text-gray-700 font-medium"
              >
                Quantidade Líquida
              </Label>
              <Input
                id="quantidade_liquida"
                type="number"
                step="0.01"
                value={formData.quantidade_liquida}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidade_liquida: e.target.value,
                  })
                }
                placeholder="0.00"
                required
                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading
                ? "Salvando..."
                : isEditMode
                  ? "Atualizar Item"
                  : "Cadastrar Item"}
            </Button>

            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="h-12 px-6 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
