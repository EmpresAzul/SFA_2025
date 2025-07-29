export interface CadastroData {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'cliente' | 'fornecedor' | 'funcionario';
  status: 'ativo' | 'inativo';
  pessoa: 'Física' | 'Jurídica';
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  documento?: {
    tipo: 'cpf' | 'cnpj';
    numero: string;
  };
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClienteData extends Omit<CadastroData, 'tipo'> {
  tipo: 'cliente';
  limite_credito?: number;
  data_cadastro: string;
}

export interface FornecedorData extends Omit<CadastroData, 'tipo'> {
  tipo: 'fornecedor';
  ramo_atividade: string;
  contato_principal: string;
}

export interface FuncionarioData extends Omit<CadastroData, 'tipo'> {
  tipo: 'funcionario';
  cargo: string;
  salario: number;
  data_admissao: string;
  data_demissao?: string;
}

export type CadastroFormData = Omit<CadastroData, 'id' | 'created_at' | 'updated_at'>;

// Alias para compatibilidade
export type Cadastro = CadastroData;