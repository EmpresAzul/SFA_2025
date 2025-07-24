import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CurrencyInput } from "@/components/ui/currency-input";
import { parseStringToNumber } from "@/utils/currency";

interface SaldoForm {
  banco: string;
  saldo: number;
  data: string;
}

interface SaldosBancariosFormProps {
  onSubmit: (formData: SaldoForm) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  initialData?: any;
  isEditMode?: boolean;
}

const SaldosBancariosForm: React.FC<SaldosBancariosFormProps> = ({
  onSubmit,
  onCancel,
  loading,
  initialData,
  isEditMode = false,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SaldoForm>({
    banco: "",
    saldo: 0,
    data: new Date().toISOString().split("T")[0],
  });
  const [valor, setValor] = useState("");

  // Preencher formulário quando initialData mudar (modo edição)
  useEffect(() => {
    if (initialData && isEditMode) {
      console.log("🔄 Preenchendo formulário com dados iniciais:", initialData);
      setFormData({
        banco: initialData.banco || "",
        saldo: initialData.saldo || 0,
        data: initialData.data || new Date().toISOString().split("T")[0],
      });
      
      // Formatar valor para o CurrencyInput
      const valorFormatado = initialData.saldo ? initialData.saldo.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) : "";
      setValor(valorFormatado);
    } else {
      // Resetar formulário para modo criação
      setFormData({
        banco: "",
        saldo: 0,
        data: new Date().toISOString().split("T")[0],
      });
      setValor("");
    }
  }, [initialData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit({
        ...formData,
        saldo: parseStringToNumber(valor),
      });
      
      // Reset form after successful submission
      setFormData({
        banco: "",
        saldo: 0,
        data: new Date().toISOString().split("T")[0],
      });
      setValor("");
      
      // Não mostrar toast aqui pois já é mostrado no hook
    } catch (error) {
      console.error("Erro ao cadastrar saldo:", error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar saldo bancário.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Editar Saldo" : "Cadastrar Novo Saldo"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="banco">Banco</Label>
            <Input
              id="banco"
              value={formData.banco}
              onChange={(e) =>
                setFormData({ ...formData, banco: e.target.value })
              }
              placeholder="Nome do banco"
              required
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor R$</Label>
            <CurrencyInput
              id="valor"
              value={valor}
              onChange={setValor}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) =>
                setFormData({ ...formData, data: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : (isEditMode ? "Atualizar" : "Salvar")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SaldosBancariosForm;