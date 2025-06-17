
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import LancamentosFormFields from './form/LancamentosFormFields';
import LancamentosFormCategories from './form/LancamentosFormCategories';
import LancamentosFormActions from './form/LancamentosFormActions';
import type { Cadastro } from '@/hooks/useCadastros';
import type { FormData, LancamentoComRelacoes } from '@/types/lancamentosForm';

interface LancamentosFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  editingLancamento: LancamentoComRelacoes | null;
  loading: boolean;
  clientes: Cadastro[] | undefined;
  fornecedores: Cadastro[] | undefined;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const LancamentosForm: React.FC<LancamentosFormProps> = ({
  formData,
  setFormData,
  editingLancamento,
  loading,
  clientes,
  fornecedores,
  onSubmit,
  onCancel,
}) => {
  console.log('LancamentosForm: Dados atuais do formulário:', formData);
  console.log('LancamentosForm: Editando lançamento:', editingLancamento);

  const renderCategoriasByGroup = () => {
    return <LancamentosFormCategories tipo={formData.tipo} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          As categorias selecionadas alimentarão automaticamente a estrutura do DRE
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <LancamentosFormFields
            formData={formData}
            setFormData={setFormData}
            editingLancamento={editingLancamento}
            clientes={clientes}
            fornecedores={fornecedores}
            renderCategoriasByGroup={renderCategoriasByGroup}
          />

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações opcionais sobre este lançamento..."
              rows={3}
            />
          </div>

          <LancamentosFormActions
            loading={loading}
            editingLancamento={editingLancamento}
            onCancel={onCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default LancamentosForm;
