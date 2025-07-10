import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  DollarSign,
  Calendar,
  User,
  Building,
  FileText,
  Tag,
} from "lucide-react";
import { formatNumberToDisplay } from "@/utils/currency";
import type { LancamentoComRelacoes } from "@/types/lancamentosForm";

interface LancamentosViewModalProps {
  lancamento: LancamentoComRelacoes;
}

const LancamentosViewModal: React.FC<LancamentosViewModalProps> = ({
  lancamento,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "receita"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="Visualizar"
        >
          <Eye className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
            Detalhes do Lançamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tipo e Valor */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Badge className={getTipoColor(lancamento.tipo)}>
                {lancamento.tipo === "receita" ? "Receita" : "Despesa"}
              </Badge>
              <div
                className={`text-xl font-bold ${
                  lancamento.tipo === "receita"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatNumberToDisplay(lancamento.valor)}
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Data
              </h3>
              <p className="text-gray-700 bg-gray-50 p-2 rounded text-center">
                {formatDate(lancamento.data)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Categoria
              </h3>
              <p className="text-gray-700 bg-gray-50 p-2 rounded text-center">
                {lancamento.categoria}
              </p>
            </div>
          </div>

          {/* Cliente/Fornecedor */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              {lancamento.tipo === "receita" ? (
                <User className="h-4 w-4 mr-1" />
              ) : (
                <Building className="h-4 w-4 mr-1" />
              )}
              {lancamento.tipo === "receita" ? "Cliente" : "Fornecedor"}
            </h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {lancamento.tipo === "receita"
                ? lancamento.cliente?.nome || "Não informado"
                : lancamento.fornecedor?.nome || "Não informado"}
            </p>
          </div>

          {/* Observações */}
          {lancamento.observacoes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Observações
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {lancamento.observacoes}
              </p>
            </div>
          )}

          {/* Informações de Recorrência */}
          {lancamento.recorrente && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recorrência</h3>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                Lançamento recorrente{" "}
                {lancamento.meses_recorrencia
                  ? `por ${lancamento.meses_recorrencia} meses`
                  : ""}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t">
            <p>
              Criado em:{" "}
              {new Date(lancamento.created_at).toLocaleString("pt-BR")}
            </p>
            <p>
              Atualizado em:{" "}
              {new Date(lancamento.updated_at).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LancamentosViewModal;
