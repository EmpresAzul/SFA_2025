export interface Cadastro {
  id: string;
  user_id: string;
  nome: string;
  tipo: string;
  pessoa: string;
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  salario?: number;
  status: string;
  data: string;
  created_at: string;
  updated_at: string;
}

export interface CadastroFormData {
  nome: string;
  tipo: string;
  pessoa: string;
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  salario?: number;
  status: string;
  data: string;
  user_id: string;
}

export interface UseCadastrosReturn {
  cadastros: Cadastro[];
  loading: boolean;
  error: string | null;
  createCadastro: (data: CadastroFormData) => Promise<void>;
  updateCadastro: (id: string, data: Partial<CadastroFormData>) => Promise<void>;
  deleteCadastro: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  refreshCadastros: () => Promise<void>;
  useCreate: () => ({ mutateAsync: (data: CadastroFormData) => Promise<void> });
  useQuery: () => ({ data: Cadastro[]; isLoading: boolean; error: string | null });
  useUpdate: () => ({ mutateAsync: (params: { id: string; data: Partial<CadastroFormData> }) => Promise<void> });
  useDelete: () => ({ mutateAsync: (id: string) => Promise<void> });
}