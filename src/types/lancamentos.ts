export interface Lancamento {
  id: string;
  user_id: string;
  data: string;
  tipo: "receita" | "despesa";
  categoria: string;
  valor: number;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  status: string;
  recorrente: boolean;
  meses_recorrencia?: number | null;
  lancamento_pai_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

export type LancamentoCreateData = Omit<
  Lancamento,
  "id" | "created_at" | "updated_at"
>;
export type LancamentoUpdateData = Partial<Lancamento> & { id: string };
