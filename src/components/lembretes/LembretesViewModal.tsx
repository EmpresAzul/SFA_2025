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
import { Eye, Calendar, Clock, FileText, User } from "lucide-react";
import { type Lembrete } from "@/hooks/useLembretes";

interface LembretesViewModalProps {
  lembrete: Lembrete;
}

const LembretesViewModal: React.FC<LembretesViewModalProps> = ({
  lembrete,
}) => {
  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
  };

  const formatTime = (time: string | null) => {
    if (!time) return "Não definido";
    return time.slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    return status === "ativo"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-blue-50">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Detalhes do Lembrete
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <User className="h-4 w-4 mr-1" />
              Título
            </h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {lembrete.titulo}
            </p>
          </div>

          {lembrete.descricao && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {lembrete.descricao}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Data
              </h3>
              <p className="text-gray-700 bg-gray-50 p-2 rounded text-center">
                {formatDate(lembrete.data_lembrete)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Horário
              </h3>
              <p className="text-gray-700 bg-gray-50 p-2 rounded text-center">
                {formatTime(lembrete.hora_lembrete)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
            <Badge className={getStatusColor(lembrete.status)}>
              {lembrete.status === "ativo" ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t">
            <p>
              Criado em: {new Date(lembrete.created_at).toLocaleString("pt-BR")}
            </p>
            <p>
              Atualizado em:{" "}
              {new Date(lembrete.updated_at).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LembretesViewModal;
