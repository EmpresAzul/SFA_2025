
-- Criar tabela para lembretes
CREATE TABLE public.lembretes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_lembrete DATE NOT NULL,
  hora_lembrete TIME,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem apenas seus próprios lembretes
CREATE POLICY "Users can view their own lembretes" 
  ON public.lembretes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem seus próprios lembretes
CREATE POLICY "Users can create their own lembretes" 
  ON public.lembretes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios lembretes
CREATE POLICY "Users can update their own lembretes" 
  ON public.lembretes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios lembretes
CREATE POLICY "Users can delete their own lembretes" 
  ON public.lembretes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar índice para melhorar performance nas consultas por data
CREATE INDEX idx_lembretes_data_user ON public.lembretes(user_id, data_lembrete);
