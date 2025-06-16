
export interface Contact {
  id: string;
  data: string;
  tipo: string;
  pessoa: string;
  nome: string;
  documento: string;
  endereco: string;
  numero?: string;
  cidade: string;
  estado: string;
  email?: string;
  telefone?: string;
  observacoes?: string;
  anexo_url?: string;
  salario?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  data: string;
  tipo: string;
  pessoa: string;
  nome: string;
  documento: string;
  endereco: string;
  numero: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
  observacoes: string;
  anexo_url: string;
  salario: number;
  status: string;
}

export interface ContactStats {
  activeClients: number;
  inactiveClients: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  activeEmployees: number;
  inactiveEmployees: number;
}
