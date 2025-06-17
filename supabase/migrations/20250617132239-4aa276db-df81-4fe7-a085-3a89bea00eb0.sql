
-- Criar tabela de precificação
CREATE TABLE public.precificacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Produto', 'Serviço', 'Hora')),
  categoria TEXT NOT NULL,
  preco_final NUMERIC NOT NULL DEFAULT 0,
  margem_lucro NUMERIC,
  dados_json JSONB,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar Row Level Security (RLS) para precificacao
ALTER TABLE public.precificacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own precificacao" 
  ON public.precificacao 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own precificacao" 
  ON public.precificacao 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own precificacao" 
  ON public.precificacao 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own precificacao" 
  ON public.precificacao 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX idx_precificacao_user_id ON public.precificacao(user_id);
CREATE INDEX idx_precificacao_tipo ON public.precificacao(tipo);
CREATE INDEX idx_precificacao_nome ON public.precificacao(nome);
CREATE INDEX idx_precificacao_status ON public.precificacao(status);
