export interface Estoque {
  id: string;
  user_id: string;
  data: string;
  nome_produto: string;
  unidade_medida: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  quantidade_bruta: number;
  quantidade_liquida: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const unidadesMedida = [
  "KG",
  "G",
  "L",
  "ML",
  "UN",
  "CX",
  "PC",
  "M",
  "CM",
  "M²",
  "M³",
];
