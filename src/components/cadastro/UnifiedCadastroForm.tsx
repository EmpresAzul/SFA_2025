import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCadastros, type CadastroFormData } from "@/hooks/useCadastros";
import { useAuth } from "@/contexts/AuthContext";

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

interface FormData {
  data: string;
  tipo: "Cliente" | "Fornecedor" | "Funcionário" | "";
  nome: string;
  endereco: string;
  numero: string;
  cidade: string;
  estado: string;
  observacoes: string;
  telefone: string;
  email: string;
  cpf_cnpj: string;
}

interface UnifiedCadastroFormProps {
  onSuccess?: () => void;
}

export const UnifiedCadastroForm: React.FC<UnifiedCadastroFormProps> = ({
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { useCreate } = useCadastros();
  const createCadastro = useCreate();

  const [formData, setFormData] = useState<FormData>({
    data: new Date().toISOString().split("T")[0],
    tipo: "",
    nome: "",
    endereco: "",
    numero: "",
    cidade: "",
    estado: "",
    observacoes: "",
    telefone: "",
    email: "",
    cpf_cnpj: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.data.trim()) {
      toast({
        title: "Erro de validação",
        description: "Data é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.tipo) {
      toast({
        title: "Erro de validação",
        description: "Tipo é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      data: new Date().toISOString().split("T")[0],
      tipo: "",
      nome: "",
      endereco: "",
      numero: "",
      cidade: "",
      estado: "",
      observacoes: "",
      telefone: "",
      email: "",
      cpf_cnpj: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cadastroData: CadastroFormData = {
        data: formData.data,
        nome: formData.nome.trim(),
        tipo: formData.tipo as "Cliente" | "Fornecedor" | "Funcionário",
        endereco: formData.endereco.trim() || undefined,
        numero: formData.numero.trim() || undefined,
        cidade: formData.cidade.trim() || undefined,
        estado: formData.estado || undefined,
        observacoes: formData.observacoes.trim() || undefined,
        telefone: formData.telefone.trim() || undefined,
        email: formData.email.trim() || undefined,
        cpf_cnpj: formData.cpf_cnpj.trim() || undefined,
        user_id: user!.id,
      };

      await createCadastro.mutateAsync(cadastroData);

      toast({
        title: "Sucesso",
        description: "Cadastro salvo com sucesso!",
      });

      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Erro ao salvar cadastro:", error);
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao salvar cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent text-sm sm:text-base">
          ➕ Novo Cadastro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange("data", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="Funcionário">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={(e) => handleInputChange("cpf_cnpj", e.target.value)}
                placeholder="Digite o CPF ou CNPJ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                placeholder="Digite o telefone"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Digite o e-mail"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                placeholder="Digite o endereço"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                placeholder="Digite o número"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange("cidade", e.target.value)}
                placeholder="Digite a cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">UF</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleInputChange("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
