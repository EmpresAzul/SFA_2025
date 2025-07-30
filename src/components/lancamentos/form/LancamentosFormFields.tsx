import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedCurrencyInput } from "@/components/ui/enhanced-currency-input";
import { parseStringToNumber } from "@/utils/currency";
import LancamentosFormCategories from "./LancamentosFormCategories";
import type { FormData } from "@/types/lancamentosForm";
import type { Cadastro } from "@/hooks/useCadastros";

interface LancamentosFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  clientes: Cadastro[];
  fornecedores: Cadastro[];
}

const LancamentosFormFields: React.FC<LancamentosFormFieldsProps> = ({
  formData,
  setFormData,
  clientes,
  fornecedores,
}) => {
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | number | null,
  ) => {
    console.log("FormFields: Atualizando campo", field, "com valor:", value);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      console.log("FormFields: Estado atualizado:", updated);
      return updated;
    });
  };

  const handleCurrencyChange = (
    numericValue: number,
    formattedValue: string,
  ) => {
    console.log("FormFields: Valor monetário atualizado:", {
      numericValue,
      formattedValue,
    });
    // Armazenar como string formatada para manter consistência na exibição
    handleInputChange("valor", formattedValue);
  };

  const handleRecorrenteChange = (checked: boolean) => {
    handleInputChange("recorrente", checked);
    if (!checked) {
      handleInputChange("meses_recorrencia", null);
    }
  };

  // Converter valor para número para o componente de currency
  const valorNumerico = parseStringToNumber(formData.valor);
  console.log(
    "FormFields: Valor atual do formulário:",
    formData.valor,
    "convertido para:",
    valorNumerico,
  );

  return (
    <div className="space-y-6">
      {/* Tipo de Lançamento */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Tipo de Lançamento *
        </Label>
        <RadioGroup
          value={formData.tipo}
          onValueChange={(value) =>
            handleInputChange("tipo", value as "receita" | "despesa")
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="receita" id="receita" />
            <Label htmlFor="receita" className="cursor-pointer">
              Receita
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="despesa" id="despesa" />
            <Label htmlFor="despesa" className="cursor-pointer">
              Despesa
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Data e Valor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data" className="text-sm font-medium text-gray-700">
            Data *
          </Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange("data", e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor" className="text-sm font-medium text-gray-700">
            Valor *
          </Label>
          <EnhancedCurrencyInput
            id="valor"
            value={valorNumerico}
            onChange={handleCurrencyChange}
            placeholder="0,00"
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Cliente/Fornecedor baseado no tipo */}
      {formData.tipo === "receita" ? (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Cliente</Label>
          <Select
            value={formData.cliente_id}
            onValueChange={(value) =>
              handleInputChange("cliente_id", value === "none" ? "" : value)
            }
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione um cliente (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum cliente</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Fornecedor
          </Label>
          <Select
            value={formData.fornecedor_id}
            onValueChange={(value) =>
              handleInputChange("fornecedor_id", value === "none" ? "" : value)
            }
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione um fornecedor (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum fornecedor</SelectItem>
              {fornecedores.map((fornecedor) => (
                <SelectItem key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Categoria Estruturada */}
      <div className="space-y-2">
        <Label
          htmlFor="categoria"
          className="text-sm font-medium text-gray-700"
        >
          Categoria *
        </Label>
        <Select
          value={formData.categoria}
          onValueChange={(value) => handleInputChange("categoria", value)}
        >
          <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <LancamentosFormCategories tipo={formData.tipo} />
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-600">
          As categorias são organizadas conforme a estrutura do DRE
          (Demonstração do Resultado do Exercício)
        </p>
      </div>

      {/* Campo Recorrente - Posicionado logo após Categoria */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recorrente"
            checked={formData.recorrente}
            onCheckedChange={handleRecorrenteChange}
          />
          <Label
            htmlFor="recorrente"
            className="text-sm font-medium text-gray-700"
          >
            Lançamento Recorrente
          </Label>
        </div>

        {formData.recorrente && (
          <div className="space-y-2">
            <Label
              htmlFor="meses_recorrencia"
              className="text-sm font-medium text-gray-700"
            >
              Quantidade de Meses *
            </Label>
            <Input
              id="meses_recorrencia"
              type="number"
              min="1"
              max="60"
              value={formData.meses_recorrencia || ""}
              onChange={(e) =>
                handleInputChange(
                  "meses_recorrencia",
                  parseInt(e.target.value) || null,
                )
              }
              placeholder="Ex: 12 (para 12 meses)"
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-600">
              Este lançamento será repetido automaticamente pelos próximos{" "}
              {formData.meses_recorrencia || 0} meses
            </p>
          </div>
        )}
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label
          htmlFor="observacoes"
          className="text-sm font-medium text-gray-700"
        >
          Observações
        </Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleInputChange("observacoes", e.target.value)}
          placeholder="Informações adicionais sobre o lançamento..."
          className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default LancamentosFormFields;
