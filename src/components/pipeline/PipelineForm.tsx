import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Negocio } from "@/types/pipeline";
import { CurrencyInput } from "@/components/ui/currency-input";
import { parseStringToNumber } from "@/utils/currency";

interface PipelineFormProps {
  negocio?: Negocio;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const PipelineForm: React.FC<PipelineFormProps> = ({
  negocio,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome_lead: negocio?.nome_lead || "",
      email: negocio?.email || "",
      whatsapp: negocio?.whatsapp || "",
      valor_negocio: negocio?.valor_negocio ? String(negocio.valor_negocio) : "",
      status: negocio?.status || "prospeccao",
      observacoes: negocio?.observacoes || "",
    },
  });

  const statusValue = watch("status");
  const valorNegocioValue = watch("valor_negocio");

  // Atualiza o valor do campo ao digitar na máscara
  const handleCurrencyChange = (formatted: string) => {
    setValue("valor_negocio", formatted);
  };

  // Adapta o submit para converter o valor formatado em número
  const handleFormSubmit = async (data: any) => {
    const valorNumerico = parseStringToNumber(data.valor_negocio);
    await onSubmit({ ...data, valor_negocio: valorNumerico });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome_lead">Nome do Lead *</Label>
          <Input
            id="nome_lead"
            {...register("nome_lead", { required: "Nome é obrigatório" })}
            placeholder="Digite o nome do lead"
          />
          {errors.nome_lead && (
            <p className="text-red-500 text-sm">{errors.nome_lead.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Digite o e-mail"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            {...register("whatsapp")}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor_negocio">Valor do Negócio</Label>
          <CurrencyInput
            id="valor_negocio"
            value={valorNegocioValue || ""}
            onChange={handleCurrencyChange}
            placeholder="R$ 0,00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={statusValue as string}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospeccao">Prospecção</SelectItem>
              <SelectItem value="qualificacao">Qualificação</SelectItem>
              <SelectItem value="proposta">Proposta</SelectItem>
              <SelectItem value="negociacao">Negociação</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          {...register("observacoes")}
          placeholder="Digite observações sobre o negócio"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : negocio ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};