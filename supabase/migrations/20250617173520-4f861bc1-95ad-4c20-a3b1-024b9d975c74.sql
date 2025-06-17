
-- Criar tabela para armazenar projeções do ponto de equilíbrio
CREATE TABLE public.projecoes_ponto_equilibrio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_projecao TEXT NOT NULL,
  dados_projecao JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.projecoes_ponto_equilibrio ENABLE ROW LEVEL SECURITY;

-- Política para visualizar apenas as próprias projeções
CREATE POLICY "Users can view their own projections" 
  ON public.projecoes_ponto_equilibrio 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para inserir projeções
CREATE POLICY "Users can create their own projections" 
  ON public.projecoes_ponto_equilibrio 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para atualizar projeções
CREATE POLICY "Users can update their own projections" 
  ON public.projecoes_ponto_equilibrio 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para deletar projeções
CREATE POLICY "Users can delete their own projections" 
  ON public.projecoes_ponto_equilibrio 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projecoes_ponto_equilibrio_updated_at 
  BEFORE UPDATE ON public.projecoes_ponto_equilibrio 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
