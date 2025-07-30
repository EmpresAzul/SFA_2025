export interface SaldoBancarioData {
  id?: string;
  banco: string;
  conta: string;
  saldo_atual: number;
  saldo_anterior?: number;
  data_atualizacao: string;
  ativo?: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}