
-- Criar tabela de cadastros (unificada para clientes, fornecedores e funcionários)
CREATE TABLE public.cadastros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Cliente', 'Fornecedor', 'Funcionário')),
  pessoa TEXT NOT NULL CHECK (pessoa IN ('Física', 'Jurídica')),
  cpf_cnpj TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  observacoes TEXT,
  salario NUMERIC,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de lançamentos
CREATE TABLE public.lancamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  cliente_id UUID REFERENCES public.cadastros(id),
  fornecedor_id UUID REFERENCES public.cadastros(id),
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar Row Level Security (RLS) para cadastros
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cadastros" 
  ON public.cadastros 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cadastros" 
  ON public.cadastros 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cadastros" 
  ON public.cadastros 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cadastros" 
  ON public.cadastros 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Adicionar Row Level Security (RLS) para lançamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lancamentos" 
  ON public.lancamentos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lancamentos" 
  ON public.lancamentos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lancamentos" 
  ON public.lancamentos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lancamentos" 
  ON public.lancamentos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX idx_cadastros_user_id ON public.cadastros(user_id);
CREATE INDEX idx_cadastros_tipo ON public.cadastros(tipo);
CREATE INDEX idx_cadastros_nome ON public.cadastros(nome);
CREATE INDEX idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX idx_lancamentos_tipo ON public.lancamentos(tipo);
