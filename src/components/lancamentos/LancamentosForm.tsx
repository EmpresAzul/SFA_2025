import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Save, Plus, AlertCircle, AlertTriangle } from "lucide-react";
import type { Lancamento } from "@/hooks/useLancamentos";
import type { Cadastro } from "@/hooks/useCadastros";
import { useAuth } from "@/contexts/AuthContext";
import LancamentosFormCategories from "./form/LancamentosFormCategories";

interface LancamentosFormProps {
  editingLancamento: Lancamento | null;
  onCancelEdit: () => void;
  onSaveSuccess: () => void;
  clientes: Cadastro[];
  fornecedores: Cadastro[];
  createLancamento: any;
  updateLancamento: any;
}

interface FormData {
  tipo: "receita" | "despesa";
  data: string;
  valor: string;
  categoria: string;
  cliente_id: string;
  fornecedor_id: string;
  observacoes: string;
}

interface FormErrors {
  tipo?: string;
  data?: string;
  valor?: string;
  categoria?: string;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
}

const LancamentosForm: React.FC<LancamentosFormProps> = ({
  editingLancamento,
  onCancelEdit,
  onSaveSuccess,
  clientes,
  fornecedores,
  createLancamento,
  updateLancamento,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    tipo: "receita",
    data: new Date().toISOString().split('T')[0],
    valor: "",
    categoria: "",
    cliente_id: "",
    fornecedor_id: "",
    observacoes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Preencher formulário quando editando
  useEffect(() => {
    try {
      if (editingLancamento) {
        setFormData({
          tipo: editingLancamento.tipo || "receita",
          data: (editingLancamento.data && editingLancamento.data.split('T')[0]) || new Date().toISOString().split('T')[0],
          valor: editingLancamento.valor !== undefined && editingLancamento.valor !== null ? editingLancamento.valor.toString() : "",
          categoria: editingLancamento.categoria || "",
          cliente_id: editingLancamento.cliente_id || "",
          fornecedor_id: editingLancamento.fornecedor_id || "",
          observacoes: editingLancamento.observacoes || "",
        });
      } else {
        setFormData({
          tipo: "receita",
          data: new Date().toISOString().split('T')[0],
          valor: "",
          categoria: "",
          cliente_id: "",
          fornecedor_id: "",
          observacoes: "",
        });
      }
      setHasError(false);
    } catch (error) {
      console.error("Erro ao preencher formulário:", error);
      setHasError(true);
    }
  }, [editingLancamento]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCurrencyChange = (numericValue: number, formattedValue: string) => {
    handleInputChange("valor", formattedValue);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.data) newErrors.data = "Data é obrigatória";
    if (!formData.valor || parseStringToNumber(formData.valor) <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }
    if (!formData.categoria) newErrors.categoria = "Categoria é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Verificar se o usuário está autenticado
    if (!user?.id) {
      setErrors({ 
        ...errors, 
        categoria: "Usuário não autenticado. Faça login novamente." 
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const valorNumerico = parseStringToNumber(formData.valor);
      const lancamentoData = {
        tipo: formData.tipo,
        data: formData.data,
        valor: valorNumerico,
        categoria: formData.categoria,
        cliente_id: formData.cliente_id || null,
        fornecedor_id: formData.fornecedor_id || null,
        observacoes: formData.observacoes || `${formData.tipo === 'receita' ? 'Receita' : 'Despesa'} - ${formData.categoria}`,
        status: "ativo",
        user_id: user.id,
      };

      if (editingLancamento) {
        await updateLancamento.mutateAsync({
          id: editingLancamento.id,
          ...lancamentoData,
        });
      } else {
        await createLancamento.mutateAsync(lancamentoData);
      }

      onSaveSuccess();
    } catch (error) {
      console.error("Erro ao salvar lançamento:", error);
      // Mostrar erro para o usuário
      setErrors({ 
        ...errors, 
        categoria: "Erro ao salvar lançamento. Tente novamente." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  // Fallback para erro
  if (hasError) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar formulário
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Ocorreu um erro ao carregar os dados do formulário.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onCancelEdit}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          {editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Preencha os dados do lançamento financeiro. Os campos marcados com * são obrigatórios.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Lançamento */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Tipo de Lançamento *
            </Label>
            <RadioGroup
              value={formData.tipo}
              onValueChange={(value) => handleInputChange("tipo", value as "receita" | "despesa")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="receita" id="receita" />
                <Label htmlFor="receita" className="cursor-pointer font-medium">
                  Receita
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="despesa" id="despesa" />
                <Label htmlFor="despesa" className="cursor-pointer font-medium">
                  Despesa
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Data e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="data" className="text-sm font-medium text-gray-700">
                Data *
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange("data", e.target.value)}
                className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.data ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              {errors.data && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.data}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="text-sm font-medium text-gray-700">
                Valor *
              </Label>
              <EnhancedCurrencyInput
                id="valor"
                value={parseStringToNumber(formData.valor)}
                onChange={handleCurrencyChange}
                placeholder="0,00"
                className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.valor ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              {errors.valor && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.valor}
                </p>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-sm font-medium text-gray-700">
              Categoria *
            </Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => handleInputChange("categoria", value)}
            >
              <SelectTrigger className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                errors.categoria ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <LancamentosFormCategories tipo={formData.tipo} />
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.categoria}
              </p>
            )}
          </div>

          {/* Cliente/Fornecedor */}
          {formData.tipo === "receita" ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Cliente (Opcional)</Label>
              <Select
                value={formData.cliente_id || "none"}
                onValueChange={(value) => handleInputChange("cliente_id", value === "none" ? "" : value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione um cliente" />
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
              <Label className="text-sm font-medium text-gray-700">Fornecedor (Opcional)</Label>
              <Select
                value={formData.fornecedor_id || "none"}
                onValueChange={(value) => handleInputChange("fornecedor_id", value === "none" ? "" : value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione um fornecedor" />
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

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              placeholder="Informações adicionais sobre o lançamento..."
              className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  {editingLancamento ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingLancamento ? "Atualizar" : "Criar"} Lançamento
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LancamentosForm;
