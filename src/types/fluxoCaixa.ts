
export interface Lancamento {
  id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  categoria: string;
  observacoes?: string;
}

export interface FluxoDiario {
  receitas: number;
  despesas: number;
  data: string;
}

export interface CategoriaData {
  name: string;
  value: number;
  color: string;
}
