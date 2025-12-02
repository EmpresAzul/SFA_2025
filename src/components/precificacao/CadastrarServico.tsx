import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCurrencyInput } from "@/components/ui/enhanced-currency-input";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePrecificacao } from "@/hooks/usePrecificacao";
import { supabase } from "@/integrations/supabase/client";
import TaxasAdicionaisManager from "./forms/TaxasAdicionaisManager";
import ServicoCalculationsResults from "./forms/ServicoCalculationsResults";

import type { TaxaAdicional } from "./forms/TaxasAdicionaisManager";

interface Precificacao {
  id: string;
  [key: string]: any;
}

interface CustoServico {
  id: string;
  descricao: string;
  valor: number;
}

interface CadastrarServicoProps {
  editingItem?: Precificacao | null;
  onCancelEdit?: () => void;
  onSaveSuccess?: () => void;
}

const CadastrarServico: React.FC<CadastrarServicoProps> = ({
  editingItem,
  onCancelEdit,
  onSaveSuccess,
}) => {
  const { toast } = useToast();
  const { useCreate, useUpdate } = usePrecificacao();
  const createPrecificacao = useCreate();
  const updatePrecificacao = useUpdate();
  const [loading, setLoading] = useState(false);

  const [servicoData, setServicoData] = useState({
    nome: "",
    categoria: "",
    tempoEstimado: "",
    valorHora: 0,
    margemLucro: 20,
  });

  const [custos, setCustos] = useState<CustoServico[]>([
    { id: "1", descricao: "", valor: 0 },
  ]);

  const [taxasAdicionais, setTaxasAdicionais] = useState<TaxaAdicional[]>([
    { id: "1", descricao: "", percentual: 0 },
  ]);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingItem && editingItem.tipo === "Serviço") {
      const dados = editingItem.dados_json as Record<string, unknown>;

      setServicoData({
        nome: editingItem.nome,
        categoria: editingItem.categoria,
        tempoEstimado: dados?.tempo_estimado?.toString() || "",
        valorHora: Number(dados?.valor_hora) || 0,
        margemLucro: editingItem.margem_lucro || 20,
      });

      // Carregar custos de materiais do JSON
      if (dados?.custos_materiais) {
        const custosCarregados = (dados.custos_materiais as Array<Record<string, unknown>>).map((custo) => ({
          id: (custo.id as string) || Date.now().toString(),
          descricao: custo.descricao as string,
          valor: custo.valor as number,
        }));
        setCustos(
          custosCarregados.length > 0
            ? custosCarregados
            : [{ id: "1", descricao: "", valor: 0 }],
        );
      }

      // Carregar taxas adicionais do JSON
      if (dados?.taxas_adicionais) {
        const taxasCarregadas = (dados.taxas_adicionais as Array<Record<string, unknown>>).map((taxa) => ({
          id: (taxa.id as string) || Date.now().toString(),
          descricao: taxa.descricao as string,
          percentual: taxa.percentual as number,
        }));
        setTaxasAdicionais(
          taxasCarregadas.length > 0
            ? taxasCarregadas
            : [{ id: "1", descricao: "", percentual: 0 }],
        );
      }
    }
  }, [editingItem]);

  const adicionarCusto = () => {
    if (custos.length < 20) {
      const novoCusto: CustoServico = {
        id: Date.now().toString(),
        descricao: "",
        valor: 0,
      };
      setCustos([...custos, novoCusto]);
    }
  };

  const removerCusto = (id: string) => {
    if (custos.length > 1) {
      setCustos(custos.filter((custo) => custo.id !== id));
    }
  };

  const atualizarCusto = (
    id: string,
    campo: "descricao" | "valor",
    valor: string | number,
  ) => {
    setCustos(
      custos.map((custo) =>
        custo.id === id ? { ...custo, [campo]: valor } : custo,
      ),
    );
  };

  // Cálculos automáticos com taxas adicionais
  const custoMateriais = custos.reduce(
    (total, custo) => total + custo.valor,
    0,
  );
  const horasNumerico = parseFloat(servicoData.tempoEstimado) || 0;
  const custoMaoObra = horasNumerico * servicoData.valorHora;
  const custoTotal = custoMateriais + custoMaoObra;
  const totalTaxasPercentual = taxasAdicionais.reduce(
    (total, taxa) => total + taxa.percentual,
    0,
  );
  const percentualTotal = servicoData.margemLucro + totalTaxasPercentual;
  const margemDecimal = percentualTotal / 100;
  const precoFinal = custoTotal > 0 ? custoTotal / (1 - margemDecimal) : 0;
  const lucroValor = precoFinal - custoTotal;
  const valorTaxas = (custoTotal * totalTaxasPercentual) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!servicoData.nome) {
      toast({
        title: "Erro",
        description: "Nome do serviço é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!servicoData.categoria) {
      toast({
        title: "Erro",
        description: "Categoria é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    if (servicoData.valorHora <= 0) {
      toast({
        title: "Erro",
        description: "Valor por hora deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const custosMateriaisSerializados = custos
        .filter((c) => c.descricao && c.valor > 0)
        .map((custo) => ({
          id: custo.id,
          descricao: custo.descricao,
          valor: custo.valor,
        }));

      const taxasSerializadas = taxasAdicionais
        .filter((t) => t.descricao && t.percentual > 0)
        .map((taxa) => ({
          id: taxa.id,
          descricao: taxa.descricao,
          percentual: taxa.percentual,
        }));

      const dadosPrecificacao = {
        nome: servicoData.nome,
        tipo: "Serviço" as const,
        preco_venda: precoFinal,
        margem_lucro: servicoData.margemLucro,
        custo_materia_prima: custoMateriais,
        custo_mao_obra: custoMaoObra,
        despesas_fixas: 0,
        dados_json: {
          categoria: servicoData.categoria,
          tempo_estimado: horasNumerico,
          valor_hora: servicoData.valorHora,
          custo_mao_obra: custoMaoObra,
          custos_materiais: custosMateriaisSerializados,
          taxas_adicionais: taxasSerializadas,
          custo_materiais_total: custoMateriais,
          custo_total: custoTotal,
          total_taxas_percentual: totalTaxasPercentual,
          percentual_total: percentualTotal,
          lucro_valor: lucroValor,
          valor_taxas: valorTaxas,
        },
      };

      if (editingItem) {
        // Atualizar item existente
        await updatePrecificacao.mutateAsync({
          id: editingItem.id,
          data: dadosPrecificacao,
        });
        toast({
          title: "✅ Serviço Atualizado!",
          description: `O serviço "${servicoData.nome}" foi atualizado com sucesso.`,
          duration: 4000,
        });
      } else {
        // Criar novo item
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        await createPrecificacao.mutateAsync({
          ...dadosPrecificacao,
          user_id: user.id,
        });
        toast({
          title: "✅ Serviço Salvo com Sucesso!",
          description: `O serviço "${servicoData.nome}" foi cadastrado com sucesso no sistema.`,
          duration: 4000,
        });
      }

      // Reset form
      setServicoData({
        nome: "",
        categoria: "",
        tempoEstimado: "",
        valorHora: 0,
        margemLucro: 20,
      });
      setCustos([{ id: "1", descricao: "", valor: 0 }]);
      setTaxasAdicionais([{ id: "1", descricao: "", percentual: 0 }]);

      // Chamar callback de sucesso
      onSaveSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setServicoData({
      nome: "",
      categoria: "",
      tempoEstimado: "",
      valorHora: 0,
      margemLucro: 20,
    });
    setCustos([{ id: "1", descricao: "", valor: 0 }]);
    setTaxasAdicionais([{ id: "1", descricao: "", percentual: 0 }]);

    onCancelEdit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {editingItem && (
        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
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
            <h3 className="font-semibold text-purple-800">
              Editando: {editingItem.nome}
            </h3>
            <p className="text-sm text-purple-600">
              Modifique os campos e clique em "Salvar Alterações"
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome-servico">Nome do Serviço *</Label>
          <Input
            id="nome-servico"
            value={servicoData.nome}
            onChange={(e) =>
              setServicoData({ ...servicoData, nome: e.target.value })
            }
            placeholder="Digite o nome do serviço"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria-servico">Categoria *</Label>
          <Input
            id="categoria-servico"
            value={servicoData.categoria}
            onChange={(e) =>
              setServicoData({ ...servicoData, categoria: e.target.value })
            }
            placeholder="Ex: Consultoria, Manutenção, Design"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tempo-estimado">Tempo Estimado (horas) *</Label>
          <Input
            id="tempo-estimado"
            type="number"
            min="0"
            step="0.5"
            value={servicoData.tempoEstimado}
            onChange={(e) =>
              setServicoData({ ...servicoData, tempoEstimado: e.target.value })
            }
            placeholder="8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor-hora">Valor por Hora *</Label>
          <EnhancedCurrencyInput
            id="valor-hora"
            value={servicoData.valorHora}
            onChange={(numericValue) =>
              setServicoData({ ...servicoData, valorHora: numericValue })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="margem-lucro-servico">Margem de Lucro (%) *</Label>
          <Input
            id="margem-lucro-servico"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={servicoData.margemLucro}
            onChange={(e) =>
              setServicoData({
                ...servicoData,
                margemLucro: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="20"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Custos de Materiais (Opcional)
            </CardTitle>
            <Button
              type="button"
              onClick={adicionarCusto}
              disabled={custos.length >= 20}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Material
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600">
              <div className="col-span-6">Material/Recurso</div>
              <div className="col-span-4">Valor</div>
              <div className="col-span-2">Ação</div>
            </div>

            {custos.map((custo) => (
              <div key={custo.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <Input
                    value={custo.descricao}
                    onChange={(e) =>
                      atualizarCusto(custo.id, "descricao", e.target.value)
                    }
                    placeholder="Ex: Software, Material, Equipamento"
                  />
                </div>
                <div className="col-span-4">
                  <EnhancedCurrencyInput
                    value={custo.valor}
                    onChange={(numericValue) =>
                      atualizarCusto(custo.id, "valor", numericValue)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    onClick={() => removerCusto(custo.id)}
                    disabled={custos.length <= 1}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TaxasAdicionaisManager
        taxasAdicionais={taxasAdicionais}
        onUpdateTaxas={setTaxasAdicionais}
      />

      <ServicoCalculationsResults
        tempoEstimado={horasNumerico}
        valorHora={servicoData.valorHora}
        custoMaoObra={custoMaoObra}
        custoMateriais={custoMateriais}
        custoTotal={custoTotal}
        margemLucro={servicoData.margemLucro}
        totalTaxasPercentual={totalTaxasPercentual}
        precoFinal={precoFinal}
        lucroValor={lucroValor}
        valorTaxas={valorTaxas}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
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
              : "Cadastrar Serviço"}
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

export default CadastrarServico;
