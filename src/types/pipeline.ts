export interface Negocio {
  id: string;
  nome_lead: string;
  email?: string;
  whatsapp?: string;
  valor_negocio?: number;
  status: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  posicao?: number;
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