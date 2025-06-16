
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FuncionarioFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf_cnpj">CPF *</Label>
        <Input
          id="cpf_cnpj"
          value={formData.cpf_cnpj}
          onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
          placeholder="000.000.000-00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cargo">Cargo *</Label>
        <Input
          id="cargo"
          value={formData.cargo || ''}
          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone *</Label>
        <Input
          id="telefone"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
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

      <div className="space-y-2">
        <Label htmlFor="data_admissao">Data de Admissão *</Label>
        <Input
          id="data_admissao"
          type="date"
          value={formData.data_admissao || ''}
          onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
          required
        />
      </div>
    </>
  );
};
