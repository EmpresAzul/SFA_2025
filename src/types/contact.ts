
export interface Contact {
  id: string;
  tipo: string;
  nome: string;
  documento: string;
  endereco: string;
  cidade: string;
  estado: string;
  email?: string;
  telefone?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  tipo: string;
  nome: string;
  documento: string;
  endereco: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
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
