import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-white";
import { CadastroData } from "../CadastroEditModal";

interface FornecedorFormProps {
  formData: CadastroData;
  setFormData: (data: CadastroData) => void;
}

export const FornecedorForm: React.FC<FornecedorFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="razao_social">Razão Social *</Label>
        <Input
          id="razao_social"
          value={formData.razao_social || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              razao_social: e.target.value,
              nome: e.target.value,
            })
          }
          placeholder="Digite a razão social da empresa"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf_cnpj">CNPJ *</Label>
        <Input
          id="cpf_cnpj"
          value={formData.cpf_cnpj}
          onChange={(e) =>
            setFormData({ ...formData, cpf_cnpj: e.target.value })
          }
          placeholder="00.000.000/0000-00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_fornecedor">Tipo de Fornecedor</Label>
        <Select
          value={formData.tipo_fornecedor || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, tipo_fornecedor: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Produtos">Produtos</SelectItem>
            <SelectItem value="Serviços">Serviços</SelectItem>
            <SelectItem value="Matéria Prima">Matéria Prima</SelectItem>
            <SelectItem value="Equipamentos">Equipamentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone *</Label>
        <Input
          id="telefone"
          value={formData.telefone}
          onChange={(e) =>
            setFormData({ ...formData, telefone: e.target.value })
          }
          placeholder="(00) 00000-0000"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
          required
        />
      </div>
    </>
  );
};
