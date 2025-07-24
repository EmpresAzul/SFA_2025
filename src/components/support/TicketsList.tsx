import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Ticket } from "@/types/support";

interface TicketsListProps {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
}

export const TicketsList: React.FC<TicketsListProps> = ({ tickets, onViewTicket }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'em_andamento':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'aguardando_cliente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'resolvido':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fechado':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto':
        return <Badge variant="destructive" className="text-xs">Aberto</Badge>;
      case 'em_andamento':
        return <Badge variant="default" className="text-xs bg-blue-500">Em Andamento</Badge>;
      case 'aguardando_cliente':
        return <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">Aguardando</Badge>;
      case 'resolvido':
        return <Badge variant="default" className="text-xs bg-green-500">Resolvido</Badge>;
      case 'fechado':
        return <Badge variant="secondary" className="text-xs">Fechado</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return <Badge variant="destructive" className="text-xs">Urgente</Badge>;
      case 'alta':
        return <Badge variant="default" className="text-xs bg-red-500">Alta</Badge>;
      case 'media':
        return <Badge variant="default" className="text-xs bg-yellow-500">Média</Badge>;
      case 'baixa':
        return <Badge variant="secondary" className="text-xs">Baixa</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">-</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tecnico':
        return 'Técnico';
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

  if (tickets.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum chamado encontrado</h3>
          <p className="text-gray-600">Você ainda não possui chamados abertos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Meus Chamados ({tickets.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3 p-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(ticket.status)}
                    <h4 className="font-medium text-gray-900 truncate">
                      {ticket.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {ticket.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewTicket(ticket)}
                  className="ml-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Visualizar chamado"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(ticket.category)}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                </span>
                <span>#{ticket.id.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};