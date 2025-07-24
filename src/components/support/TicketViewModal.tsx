import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, XCircle, User, Calendar, Tag, Flag } from "lucide-react";
import { Ticket } from "@/types/support";

interface TicketViewModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketViewModal: React.FC<TicketViewModalProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  if (!ticket) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'em_andamento':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'aguardando_cliente':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'resolvido':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fechado':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto':
        return <Badge variant="destructive">Aberto</Badge>;
      case 'em_andamento':
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case 'aguardando_cliente':
        return <Badge className="bg-yellow-500">Aguardando Cliente</Badge>;
      case 'resolvido':
        return <Badge className="bg-green-500">Resolvido</Badge>;
      case 'fechado':
        return <Badge variant="secondary">Fechado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'alta':
        return <Badge className="bg-red-500">Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-500">Média</Badge>;
      case 'baixa':
        return <Badge variant="secondary">Baixa</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tecnico':
        return 'Suporte Técnico';
      case 'financeiro':
        return 'Financeiro';
      case 'comercial':
        return 'Comercial';
      case 'outro':
        return 'Outro';
      default:
        return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(ticket.status)}
            Chamado #{ticket.id.slice(-6)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Prioridade */}
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(ticket.status)}
            {getPriorityBadge(ticket.priority)}
            <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
          </div>

          {/* Título */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {ticket.title}
            </h3>
          </div>

          {/* Descrição */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Descrição</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Informações do Chamado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Criado em:</span>
                <span>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Atualizado em:</span>
                <span>{new Date(ticket.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Categoria:</span>
                <span>{getCategoryLabel(ticket.category)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Flag className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Prioridade:</span>
                <span className="capitalize">{ticket.priority}</span>
              </div>
            </div>
          </div>

          {/* Mensagem de Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Status do Chamado</h4>
                <p className="text-sm text-blue-700">
                  {ticket.status === 'aberto' && 
                    "Seu chamado foi recebido e está aguardando análise da nossa equipe."
                  }
                  {ticket.status === 'em_andamento' && 
                    "Nossa equipe está trabalhando na resolução do seu chamado."
                  }
                  {ticket.status === 'aguardando_cliente' && 
                    "Aguardamos sua resposta para dar continuidade ao atendimento."
                  }
                  {ticket.status === 'resolvido' && 
                    "Seu chamado foi resolvido. Se precisar de mais ajuda, abra um novo chamado."
                  }
                  {ticket.status === 'fechado' && 
                    "Este chamado foi finalizado."
                  }
                </p>
              </div>
            </div>
          </div>

          {ticket.resolved_at && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Resolvido em {new Date(ticket.resolved_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};