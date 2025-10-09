import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CpfCnpjInput } from "@/components/ui/cpf-cnpj-input";
import { PhoneMaskInput } from "@/components/ui/phone-mask-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-white";
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
  tipo: "cliente" | "fornecedor" | "funcionario" | "";
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
      // Mapear tipos corretamente
      const tipoMap = {
        cliente: "Cliente",
        fornecedor: "Fornecedor", 
        funcionario: "Funcionário"
      };

      const cadastroData: CadastroFormData = {
        nome: formData.nome.trim(),
        tipo: tipoMap[formData.tipo as keyof typeof tipoMap] || formData.tipo,
        pessoa: formData.cpf_cnpj?.replace(/\D/g, '').length === 11 ? 'Física' : 'Jurídica',
        status: 'ativo',
        ativo: true,
        cpf_cnpj: formData.cpf_cnpj.trim() || undefined,
        telefone: formData.telefone.trim() || undefined,
        email: formData.email.trim() || undefined,
        endereco: formData.endereco.trim() || undefined,
        numero: formData.numero.trim() || undefined,
        cidade: formData.cidade.trim() || undefined,
        estado: formData.estado || undefined,
        observacoes: formData.observacoes.trim() || undefined,
        user_id: user!.id,
      };

      console.log("📝 Dados do cadastro a serem salvos:", cadastroData);

      await createCadastro.mutateAsync(cadastroData);

      // Mensagem de sucesso personalizada por tipo
      const tipoTexto = tipoMap[formData.tipo as keyof typeof tipoMap];
      toast({
        title: "✅ Cadastro Confirmado!",
        description: `${tipoTexto} "${formData.nome}" foi cadastrado com sucesso no sistema.`,
        duration: 4000,
      });

      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("❌ Erro ao salvar cadastro:", error);
      toast({
        title: "❌ Erro no Cadastro",
        description:
          error instanceof Error ? error.message : "Erro ao salvar cadastro. Tente novamente.",
        variant: "destructive",
        duration: 5000,
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
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="funcionario">Funcionário</SelectItem>
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
              <CpfCnpjInput
                value={formData.cpf_cnpj}
                onChange={(value) => handleInputChange("cpf_cnpj", value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <PhoneMaskInput
                value={formData.telefone}
                onChange={(value) => handleInputChange("telefone", value)}
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
