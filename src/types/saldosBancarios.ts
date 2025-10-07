export interface SaldoBancarioData {
  id?: string;
  banco: string;
  agencia?: string;
  conta_tipo?: string;
  cidade?: string;
  pix?: string;
  saldo: number;
  valor: number;
  data: string;
  tipo?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}