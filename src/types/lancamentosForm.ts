
import type { Lancamento } from '@/hooks/useLancamentos';

export type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

export interface FormData {
  data: string;
  tipo: 'receita' | 'despesa';
  valor: string;
  cliente_id: string;
  fornecedor_id: string;
  categoria: string;
  observacoes: string;
  recorrente: boolean;
  meses_recorrencia: number | null;
}

export interface LancamentoFormParams {
  createLancamento: any;
  updateLancamento: any;
  editingLancamento: LancamentoComRelacoes | null;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  setEditingLancamento: (lancamento: LancamentoComRelacoes | null) => void;
}
