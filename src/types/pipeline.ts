export interface Negocio {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'perdido';
  value: number;
  probability: number;
  next_follow_up?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Interface para compatibilidade com o frontend
export interface Lead {
  id: string;
  nome_lead: string;
  email?: string;
  whatsapp?: string;
  valor_negocio?: number;
  status: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  observacoes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PipelineFilters {
  status?: string;
  search?: string;
}

export interface PipelineStats {
  total: number;
  prospeccao: number;
  qualificacao: number;
  proposta: number;
  negociacao: number;
  fechado: number;
  perdido: number;
  valorTotal: number;
  valorFechado: number;
}