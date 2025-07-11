import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SaldoForm {
  banco: string;
  saldo: number;
  data: string;
}

interface SaldosBancariosFormProps {
  onSubmit: (formData: SaldoForm) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const SaldosBancariosForm: React.FC<SaldosBancariosFormProps> = ({
  onSubmit,
  onCancel,
  loading,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SaldoForm>({
    banco: "",
    saldo: 0,
    data: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        banco: "",
        saldo: 0,
        data: new Date().toISOString().split("T")[0],
      });
      
      toast({
        title: "Sucesso",
        description: "Saldo bancário cadastrado com sucesso!",
      });
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
        <CardTitle>Cadastrar Novo Saldo</CardTitle>
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
            <Label htmlFor="saldo">Saldo</Label>
            <Input
              id="saldo"
              type="number"
              step="0.01"
              value={formData.saldo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  saldo: parseFloat(e.target.value) || 0,
                })
              }
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
              {loading ? "Salvando..." : "Salvar"}
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