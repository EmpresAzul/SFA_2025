
export interface Lancamento {
  id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface FluxoPorDia {
  data: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface CategoriaTotais {
  categoria: string;
  total: number;
}

export interface FluxoDiario {
  data: string;
  receitas: number;
  despesas: number;
}

export interface CategoriaData {
  name: string;
  value: number;
  color: string;
}
