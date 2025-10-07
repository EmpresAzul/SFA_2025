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
  agencia: string;
  conta_tipo: string;
  cidade: string;
  pix: string;
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
    agencia: "",
    conta_tipo: "",
    cidade: "",
    pix: "",
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
        agencia: initialData.agencia || "",
        conta_tipo: initialData.conta_tipo || "",
        cidade: initialData.cidade || "",
        pix: initialData.pix || "",
        saldo: initialData.saldo || initialData.valor || 0,
        data: initialData.data || new Date().toISOString().split("T")[0],
      });
      
      // Formatar valor para o CurrencyInput
      const valorFormatado = (initialData.saldo || initialData.valor) ? (initialData.saldo || initialData.valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) : "";
      setValor(valorFormatado);
    } else {
      // Resetar formulário para modo criação
      setFormData({
        banco: "",
        agencia: "",
        conta_tipo: "",
        cidade: "",
        pix: "",
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
        agencia: "",
        conta_tipo: "",
        cidade: "",
        pix: "",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="agencia">Agência e Nro. Conta</Label>
              <Input
                id="agencia"
                value={formData.agencia}
                onChange={(e) =>
                  setFormData({ ...formData, agencia: e.target.value })
                }
                placeholder="Agência e número da conta"
              />
            </div>

            <div>
              <Label htmlFor="conta_tipo">Conta Corrente | Poupança</Label>
              <select
                id="conta_tipo"
                value={formData.conta_tipo}
                onChange={(e) =>
                  setFormData({ ...formData, conta_tipo: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione o tipo</option>
                <option value="Conta Corrente">Conta Corrente</option>
                <option value="Poupança">Poupança</option>
              </select>
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) =>
                  setFormData({ ...formData, cidade: e.target.value })
                }
                placeholder="Cidade da agência"
              />
            </div>

            <div>
              <Label htmlFor="pix">PIX</Label>
              <Input
                id="pix"
                value={formData.pix}
                onChange={(e) =>
                  setFormData({ ...formData, pix: e.target.value })
                }
                placeholder="Chave PIX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Saldo Atual R$</Label>
              <CurrencyInput
                id="valor"
                value={valor}
                onChange={setValor}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="data">Data de Atualização</Label>
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