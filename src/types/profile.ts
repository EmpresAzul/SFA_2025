export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInfo {
  id: string;
  user_id: string;
  plano: 'basico' | 'profissional' | 'empresarial';
  status: 'ativo' | 'inativo' | 'cancelado' | 'expirado';
  data_ativacao: string;
  data_expiracao: string;
  valor_mensal: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  nome: string;
  telefone: string;
  empresa: string;
  cargo: string;
  endereco: {
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}