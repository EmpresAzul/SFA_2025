
-- Primeiro criar a tabela de cadastros se não existir
CREATE TABLE IF NOT EXISTS public.cadastros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('cliente', 'fornecedor')),
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  documento TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para cadastros
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para cadastros
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

-- Agora criar tabela para estoques
CREATE TABLE public.estoques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data DATE NOT NULL,
  nome_produto TEXT NOT NULL,
  unidade_medida TEXT NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  quantidade_bruta DECIMAL(10,2) NOT NULL,
  quantidade_liquida DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para lançamentos financeiros
CREATE TABLE public.lancamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  valor DECIMAL(10,2) NOT NULL,
  cliente_id UUID REFERENCES public.cadastros(id),
  fornecedor_id UUID REFERENCES public.cadastros(id),
  categoria TEXT NOT NULL,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para estoques
ALTER TABLE public.estoques ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para estoques
CREATE POLICY "Users can view their own estoques" 
  ON public.estoques 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own estoques" 
  ON public.estoques 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own estoques" 
  ON public.estoques 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own estoques" 
  ON public.estoques 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Habilitar RLS para lançamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lançamentos
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

-- Índices para melhor performance
CREATE INDEX idx_cadastros_user_id ON public.cadastros(user_id);
CREATE INDEX idx_cadastros_nome ON public.cadastros(nome);
CREATE INDEX idx_cadastros_tipo ON public.cadastros(tipo);

CREATE INDEX idx_estoques_user_id ON public.estoques(user_id);
CREATE INDEX idx_estoques_data ON public.estoques(data);
CREATE INDEX idx_estoques_nome_produto ON public.estoques(nome_produto);

CREATE INDEX idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX idx_lancamentos_tipo ON public.lancamentos(tipo);
