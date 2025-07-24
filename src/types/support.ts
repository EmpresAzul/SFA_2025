export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export interface SupportState {
  messages: Message[];
  isLoading: boolean;
}

export interface Ticket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'tecnico' | 'financeiro' | 'comercial' | 'outro';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'aguardando_cliente' | 'resolvido' | 'fechado';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTime: string;
}