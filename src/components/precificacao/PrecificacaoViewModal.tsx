import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Wrench,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  FileText,
  Timer,
} from "lucide-react";
import { formatNumberToDisplay } from "@/utils/currency";


interface Precificacao {
  id: string;
  [key: string]: any;
}

interface PrecificacaoViewModalProps {
  item: Precificacao | null;
  isOpen: boolean;
  onClose: () => void;
}

const PrecificacaoViewModal: React.FC<PrecificacaoViewModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [produtoData, setProdutoData] = useState({
    nome: "",
    categoria: "",
    custoMateriais: 0,
    custoMaoObra: 0,
    margemLucro: 20,
  });
  const [custos, setCustos] = useState<Array<{ id: string; descricao: string; valor: number }>>([]);
  const [taxasAdicionais, setTaxasAdicionais] = useState<Array<{ id: string; descricao: string; percentual: number }>>([]);

  useEffect(() => {
    if (item && item.dados_json) {
      const dados = item.dados_json as Record<string, unknown>;
      
      if (item.tipo === "Produto") {
        setProdutoData({
          nome: item.nome,
          categoria: item.categoria,
          custoMateriais: (dados.custo_materiais as number) || 0,
          custoMaoObra: (dados.custo_mao_obra as number) || 0,
          margemLucro: item.margem_lucro || 20,
        });

        if (dados.custos_materiais) {
          const custosCarregados = (dados.custos_materiais as Array<Record<string, unknown>>).map((custo) => ({
            id: (custo.id as string) || Date.now().toString(),
            descricao: custo.descricao as string,
            valor: custo.valor as number,
          }));
          setCustos(custosCarregados);
        }

        if (dados.taxas_adicionais) {
          const taxasCarregadas = (dados.taxas_adicionais as Array<Record<string, unknown>>).map((taxa) => ({
            id: (taxa.id as string) || Date.now().toString(),
            descricao: taxa.descricao as string,
            percentual: taxa.percentual as number,
          }));
          setTaxasAdicionais(taxasCarregadas);
        }
      }
    }
  }, [item]);

  if (!item) return null;

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Produto":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "Serviço":
        return <Wrench className="h-5 w-5 text-purple-600" />;
      case "Hora":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderDetalhesEspecificos = () => {
    if (!item.dados_json) return null;

    const dados = item.dados_json as Record<string, unknown>;

    if (item.tipo === "Produto") {
      return (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Detalhes do Produto
          </h3>
          <div className="space-y-3">
            {dados.custos && Array.isArray(dados.custos) && dados.custos.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Custos de Produção:
                </h4>
                <div className="space-y-2">
                  {dados.custos.map((custo: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white rounded p-2"
                    >
                      <span className="text-sm">{String(custo.descricao || "")}</span>
                      <span className="font-semibold">
                        {formatNumberToDisplay(Number(custo.valor) || 0)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Custo Total:</span>
                    <span>{formatNumberToDisplay(Number(dados.custo_total) || 0)}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Lucro Estimado:</span>
              <span className="font-semibold text-green-600">
                {formatNumberToDisplay(Number(dados.lucro_valor) || 0)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (item.tipo === "Serviço") {
      return (
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-purple-600" />
            Detalhes do Serviço
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tempo Estimado
                </label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  {String(dados.tempo_estimado || 0)} horas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Valor por Hora
                </label>
                <p className="text-gray-900 font-semibold">
                  {formatNumberToDisplay(Number(dados.valor_hora) || 0)}
                </p>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span>Custo Mão de Obra:</span>
                <span className="font-semibold">
                  {formatNumberToDisplay(Number(dados.custo_mao_obra) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Custo Materiais:</span>
                <span className="font-semibold">
                  {formatNumberToDisplay(Number(dados.custo_materiais_total) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span>Lucro Estimado:</span>
                <span className="font-semibold text-green-600">
                  {formatNumberToDisplay(Number(dados.lucro_valor) || 0)}
                </span>
              </div>
            </div>
            {dados.custos_materiais && Array.isArray(dados.custos_materiais) && dados.custos_materiais.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Materiais Utilizados:
                </h4>
                <div className="space-y-2">
                  {dados.custos_materiais.map(
                    (material: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white rounded p-2"
                      >
                        <span className="text-sm">{String(material.descricao || "")}</span>
                        <span className="font-semibold">
                          {formatNumberToDisplay(Number(material.valor) || 0)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (item.tipo === "Hora") {
      return (
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Detalhes da Precificação de Hora
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Pró-labore
                </label>
                <p className="text-gray-900 font-semibold">
                  {formatNumberToDisplay(Number(dados.pro_labore) || 0)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Dias Trabalhados/Mês
                </label>
                <p className="text-gray-900">
                  {String(dados.dias_trabalhados || 0)} dias
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Horas por Dia
                </label>
                <p className="text-gray-900">
                  {String(dados.horas_por_dia || 0)} horas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Horas Totais/Mês
                </label>
                <p className="text-gray-900 font-semibold">
                  {String(dados.horas_trabalhadas_mes || 0)} horas
                </p>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span>Custos Fixos:</span>
                <span className="font-semibold">
                  {formatNumberToDisplay(Number(dados.total_custos_fixos) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Custo Total Mensal:</span>
                <span className="font-semibold">
                  {formatNumberToDisplay(Number(dados.custo_total_mensal) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span>Valor da Hora:</span>
                <span className="font-semibold text-green-600">
                  {formatNumberToDisplay(Number(dados.valor_hora_trabalhada) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Valor do Dia:</span>
                <span className="font-semibold text-blue-600">
                  {formatNumberToDisplay(Number(dados.valor_dia_trabalhado) || 0)}
                </span>
              </div>
            </div>
            {dados.despesas_fixas && Array.isArray(dados.despesas_fixas) && dados.despesas_fixas.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Despesas Fixas:
                </h4>
                <div className="space-y-2">
                  {dados.despesas_fixas.map((despesa: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white rounded p-2"
                    >
                      <span className="text-sm">{String(despesa.descricao || "")}</span>
                      <span className="font-semibold">
                        {formatNumberToDisplay(Number(despesa.valor) || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTipoIcon(item.tipo)}
            Detalhes - {item.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome
                </label>
                <p className="text-gray-900 font-medium">{item.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tipo
                </label>
                <div className="flex items-center gap-2">
                  {getTipoIcon(item.tipo)}
                  <Badge variant="outline">{item.tipo}</Badge>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Categoria
                </label>
                <p className="text-gray-900">{item.categoria}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <Badge
                  variant={item.status === "ativo" ? "default" : "secondary"}
                >
                  {item.status === "ativo" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Informações Financeiras */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Preço Final
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumberToDisplay(item.preco_venda || item.preco_final || 0)}
                </p>
              </div>
              {item.margem_lucro && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Margem de Lucro
                  </label>
                  <p className="text-lg font-semibold text-blue-600 flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    {item.margem_lucro}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes Específicos por Tipo */}
          {renderDetalhesEspecificos()}

          {/* Informações de Sistema */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Informações de Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Criado em
                </label>
                <p className="text-gray-900">{formatDate(item.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Última atualização
                </label>
                <p className="text-gray-900">{formatDate(item.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrecificacaoViewModal;