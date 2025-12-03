
import type { Lancamento } from "@/types/lancamentos";

export type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

export interface LancamentoFormData {
  descricao: string;
  valor: string;
  data: string;
  data_vencimento?: string;
  data_recebimento?: string;
  tipo: "receita" | "despesa";
  categoria: string;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  recorrente?: boolean;
  meses_recorrencia?: number | null;
}

// Alias para compatibilidade com código existente
export type FormData = LancamentoFormData;

export interface LancamentoFormErrors {
  descricao?: string;
  valor?: string;
  data?: string;
  tipo?: string;
  categoria?: string;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
}

export interface LancamentoFormParams {
  createLancamento: { mutateAsync: (data: Omit<Lancamento, "id" | "created_at" | "updated_at">) => Promise<void> };
  updateLancamento: { mutateAsync: (data: { id: string } & Partial<Lancamento>) => Promise<void> };
  editingLancamento: LancamentoComRelacoes | null;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  setEditingLancamento: (lancamento: LancamentoComRelacoes | null) => void;
}
