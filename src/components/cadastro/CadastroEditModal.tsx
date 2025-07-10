import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { X, Save } from "lucide-react";

// Tipo unificado para cadastro
export type CadastroData = {
  nome: string;
  pessoa?: "Física" | "Jurídica";
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
  bairro?: string;
  cep?: string;
  observacoes?: string;
  salario?: string;
  razao_social?: string;
  tipo_fornecedor?: string;
  cargo?: string;
  data_admissao?: string;
  status?: string;
  tipo?: string;
  tipoDisplay?: string;
};

interface CadastroEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: CadastroData | null;
  onSave: (data: CadastroData) => void;
  loading: boolean;
}

const CadastroEditModal: React.FC<CadastroEditModalProps> = ({
  isOpen,
  onClose,
  editingItem,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = React.useState<CadastroData>(editingItem || {} as CadastroData);

  React.useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        // Garantir que todos os campos estejam presentes
        cpf_cnpj: editingItem.cpf_cnpj || "",
        telefone: editingItem.telefone || "",
        email: editingItem.email || "",
        endereco: editingItem.endereco || "",
        numero: editingItem.numero || "",
        cidade: editingItem.cidade || "",
        estado: editingItem.estado || "",
        bairro: editingItem.bairro || "",
        cep: editingItem.cep || "",
        observacoes: editingItem.observacoes || "",
        salario: editingItem.salario || "",
      });
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof CadastroData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!editingItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            ✏️ Editar {editingItem.tipoDisplay || editingItem.tipo}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">
                Nome *
              </Label>
              <Input
                id="nome"
                value={formData.nome || ""}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Nome completo"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj" className="text-sm font-medium">
                CPF/CNPJ
              </Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj || ""}
                onChange={(e) => handleInputChange("cpf_cnpj", e.target.value)}
                placeholder="CPF ou CNPJ"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={formData.telefone || ""}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                placeholder="Telefone"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="E-mail"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-sm font-medium">
                Endereço
              </Label>
              <Input
                id="endereco"
                value={formData.endereco || ""}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                placeholder="Endereço"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero" className="text-sm font-medium">
                Número
              </Label>
              <Input
                id="numero"
                value={formData.numero || ""}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                placeholder="Número"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-sm font-medium">
                Cidade
              </Label>
              <Input
                id="cidade"
                value={formData.cidade || ""}
                onChange={(e) => handleInputChange("cidade", e.target.value)}
                placeholder="Cidade"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium">
                Estado
              </Label>
              <Input
                id="estado"
                value={formData.estado || ""}
                onChange={(e) => handleInputChange("estado", e.target.value)}
                placeholder="UF"
                className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status || ""}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(editingItem.tipo === "Funcionário" ||
              editingItem.tipoDisplay === "Funcionário") && (
              <div className="space-y-2">
                <Label htmlFor="salario" className="text-sm font-medium">
                  Salário
                </Label>
                <Input
                  id="salario"
                  type="number"
                  value={formData.salario || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "salario",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder="Salário"
                  className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="observacoes" className="text-sm font-medium">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes || ""}
                onChange={(e) =>
                  handleInputChange("observacoes", e.target.value)
                }
                placeholder="Observações adicionais..."
                className="border-2 border-gray-200 focus:border-teal-500 rounded-lg"
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-10"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 hover:bg-gray-50 rounded-lg h-10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroEditModal;
