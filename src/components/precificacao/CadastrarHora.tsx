import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { useHoraForm } from "@/hooks/useHoraForm";
import HoraFormFields from "./forms/HoraFormFields";
import DespesasFixasManager from "./forms/DespesasFixasManager";
import HoraCalculationsResults from "./forms/HoraCalculationsResults";
import type { Database } from "@/integrations/supabase/types";

type Precificacao = Database["public"]["Tables"]["precificacao"]["Row"];

interface CadastrarHoraProps {
  editingItem?: Precificacao | null;
  onCancelEdit?: () => void;
  onSaveSuccess?: () => void;
}

const CadastrarHora: React.FC<CadastrarHoraProps> = ({
  editingItem,
  onCancelEdit,
  onSaveSuccess,
}) => {
  console.log("🏗️ CadastrarHora renderizando com props:", {
    editingItem,
    onCancelEdit,
    onSaveSuccess,
  });

  const {
    horaData,
    setHoraData,
    despesasFixas,
    setDespesasFixas,
    loading,
    handleSubmit,
    handleCancel,
  } = useHoraForm(editingItem, onCancelEdit, onSaveSuccess);

  const handleUpdateHora = (updates: Partial<typeof horaData>) => {
    console.log("📝 Atualizando dados da hora:", updates);
    setHoraData((prev) => ({ ...prev, ...updates }));
  };

  const onFormSubmit = (e: React.FormEvent) => {
    console.log("📝 Form submit disparado no CadastrarHora");
    console.log("📊 Estado atual do loading:", loading);
    console.log("📊 Estado atual dos dados:", horaData);
    handleSubmit(e);
  };

  // Cálculos automáticos (sem taxas adicionais)
  const diasTrabalhadosNumerico = parseFloat(horaData.diasTrabalhados) || 0;
  const horasPorDiaNumerico = parseFloat(horaData.horasPorDia) || 0;
  const totalCustosFixos = despesasFixas.reduce(
    (total, despesa) => total + despesa.valor,
    0,
  );
  const horasTrabalhadasMes = diasTrabalhadosNumerico * horasPorDiaNumerico;
  const custoTotalMensal = horaData.proLabore + totalCustosFixos;
  const valorHoraTrabalhada =
    horasTrabalhadasMes > 0 ? custoTotalMensal / horasTrabalhadasMes : 0;
  const valorDiaTrabalhado =
    horasPorDiaNumerico > 0 ? valorHoraTrabalhada * horasPorDiaNumerico : 0;

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {editingItem && (
        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancelar Edição
          </Button>
          <div>
            <h3 className="font-semibold text-orange-800">
              Editando: {editingItem.nome}
            </h3>
            <p className="text-sm text-orange-600">
              Modifique os campos e clique em "Salvar Alterações"
            </p>
          </div>
        </div>
      )}

      <HoraFormFields horaData={horaData} onUpdateHora={handleUpdateHora} />

      <DespesasFixasManager
        despesasFixas={despesasFixas}
        onUpdateDespesas={setDespesasFixas}
      />

      <HoraCalculationsResults
        diasTrabalhados={horaData.diasTrabalhados}
        horasPorDia={horaData.horasPorDia}
        horasTrabalhadasMes={horasTrabalhadasMes}
        valorHoraTrabalhada={valorHoraTrabalhada}
        valorHoraFinal={valorHoraTrabalhada}
        valorDiaTrabalhado={valorDiaTrabalhado}
        totalTaxasPercentual={0}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
          onClick={() => console.log("🖱️ Botão de submit clicado!")}
        >
          {editingItem ? (
            <Save className="w-4 h-4 mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {loading
            ? "Salvando..."
            : editingItem
              ? "Salvar Alterações"
              : "Cadastrar Precificação de Hora"}
        </Button>

        {editingItem && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default CadastrarHora;
