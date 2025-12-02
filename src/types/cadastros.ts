// Tipo unificado para cadastros - compatível com o banco de dados
export interface CadastroData {
  id: string;
  user_id: string;
  nome: string;
  tipo: string; // 'Cliente', 'Fornecedor', 'Funcionário'
  pessoa?: string; // 'Física' | 'Jurídica'
  status: string; // 'ativo' | 'inativo'
  ativo?: boolean;
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
  data_nascimento?: string;
  cargo?: string;
  salario?: number;
  // Campos específicos de fornecedor
  razao_social?: string;
  tipo_fornecedor?: string;
  contato_principal?: string;
  ramo_atividade?: string;
  // Campos específicos de funcionário
  data_admissao?: string;
  data_demissao?: string;
  // Campos específicos de cliente
  limite_credito?: number;
  data_cadastro?: string;
  created_at?: string;
  updated_at?: string;
}

// Alias para compatibilidade com código existente
export type Cadastro = CadastroData;

// Tipo para formulário de criação
export interface CadastroFormData {
  nome: string;
  tipo: string;
  pessoa?: string;
  status?: string;
  ativo?: boolean;
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
  data_nascimento?: string;
  cargo?: string;
  salario?: number;
  razao_social?: string;
  tipo_fornecedor?: string;
  data_admissao?: string;
  user_id?: string;
}

// Tipos específicos para formulários legados (compatibilidade)
export interface ClienteData extends CadastroData {
  limite_credito?: number;
  data_cadastro?: string;
}

export interface FornecedorData extends CadastroData {
  ramo_atividade?: string;
  contato_principal?: string;
}

export interface FuncionarioData extends CadastroData {
  data_admissao?: string;
  data_demissao?: string;
}
