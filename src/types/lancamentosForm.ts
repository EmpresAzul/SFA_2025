import type { Lancamento } from "@/types/lancamentos";

export type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

export interface LancamentoFormData {
  descricao: string;
  valor: string;
  data: string;
  tipo: "receita" | "despesa";
  categoria: string;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  recorrente: boolean;
  meses_recorrencia?: number;
  lancamento_pai_id?: string;
}

export interface LancamentoFormErrors {
  descricao?: string;
  valor?: string;
  data?: string;
  tipo?: string;
  categoria?: string;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  recorrente?: string;
  meses_recorrencia?: string;
  lancamento_pai_id?: string;
}

export interface LancamentoFormParams {
  createLancamento: (data: Omit<Lancamento, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateLancamento: (id: string, data: Partial<Lancamento>) => Promise<void>;
  editingLancamento: LancamentoComRelacoes | null;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  setEditingLancamento: (lancamento: LancamentoComRelacoes | null) => void;
}
