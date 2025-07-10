import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CadastroData } from "../CadastroEditModal";

interface ClienteFormProps {
  formData: CadastroData;
  setFormData: (data: CadastroData) => void;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Digite o nome completo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pessoa">Tipo de Pessoa *</Label>
        <Select
          value={formData.pessoa}
          onValueChange={(value: "Física" | "Jurídica") =>
            setFormData({ ...formData, pessoa: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Física">Pessoa Física</SelectItem>
            <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf_cnpj">
          {formData.pessoa === "Física" ? "CPF *" : "CNPJ *"}
        </Label>
        <Input
          id="cpf_cnpj"
          value={formData.cpf_cnpj}
          onChange={(e) =>
            setFormData({ ...formData, cpf_cnpj: e.target.value })
          }
          placeholder={
            formData.pessoa === "Física"
              ? "000.000.000-00"
              : "00.000.000/0000-00"
          }
          required
        />
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
