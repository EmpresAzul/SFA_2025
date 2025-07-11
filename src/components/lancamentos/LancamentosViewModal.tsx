import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Calendar,
  User,
  Building,
  FileText,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import type { Lancamento } from "@/hooks/useLancamentos";

interface LancamentosViewModalProps {
  lancamento: Lancamento | null;
  isOpen: boolean;
  onClose: () => void;
}

const LancamentosViewModal: React.FC<LancamentosViewModalProps> = ({
  lancamento,
  isOpen,
  onClose,
}) => {
  if (!lancamento) return null;


  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === "receita" ? (
      <ArrowUpRight className="h-5 w-5 text-green-600" />
    ) : (
      <ArrowDownRight className="h-5 w-5 text-red-600" />
    );
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === "receita" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Receita
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        Despesa
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <DollarSign className="h-6 w-6 mr-3 text-blue-600" />
            Detalhes do Lançamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo e Valor */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTipoIcon(lancamento.tipo)}
                {getTipoBadge(lancamento.tipo)}
              </div>
              <div
                className={`text-3xl font-bold ${
                  lancamento.tipo === "receita"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(lancamento.valor)}
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Data do Lançamento
              </h3>
              <p className="text-gray-700 text-lg font-medium">
                {formatDate(lancamento.data)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-600" />
                Categoria
              </h3>
              <Badge variant="outline" className="text-base px-3 py-1">
                {lancamento.categoria || 'Sem categoria'}
              </Badge>
            </div>
          </div>

          {/* Cliente/Fornecedor */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              {lancamento.tipo === "receita" ? (
                <User className="h-5 w-5 mr-2 text-blue-600" />
              ) : (
                <Building className="h-5 w-5 mr-2 text-blue-600" />
              )}
              {lancamento.tipo === "receita" ? "Cliente" : "Fornecedor"}
            </h3>
            <p className="text-gray-700 text-lg">
              {lancamento.tipo === "receita"
                ? "Cliente não informado"
                : "Fornecedor não informado"}
            </p>
          </div>

          {/* Observações */}
          {lancamento.observacoes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Observações
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {lancamento.observacoes}
              </p>
            </div>
          )}

          {/* Informações de Recorrência */}
          {lancamento.recorrente && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Recorrência</h3>
              <p className="text-blue-700">
                Lançamento recorrente{" "}
                {lancamento.meses_recorrencia
                  ? `por ${lancamento.meses_recorrencia} meses`
                  : ""}
              </p>
            </div>
          )}

          {/* Informações do Sistema */}
          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <span className="font-medium">Criado em:</span>{" "}
                {new Date(lancamento.created_at).toLocaleString("pt-BR")}
              </p>
              <p>
                <span className="font-medium">Atualizado em:</span>{" "}
                {new Date(lancamento.updated_at).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LancamentosViewModal;
