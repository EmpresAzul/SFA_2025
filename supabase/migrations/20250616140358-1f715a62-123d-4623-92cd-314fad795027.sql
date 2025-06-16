
-- Verificar e criar políticas RLS para a tabela cadastros se não existirem
-- Habilitar RLS na tabela cadastros
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios cadastros
DROP POLICY IF EXISTS "Users can view their own cadastros" ON public.cadastros;
CREATE POLICY "Users can view their own cadastros" 
  ON public.cadastros 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários criem seus próprios cadastros
DROP POLICY IF EXISTS "Users can create their own cadastros" ON public.cadastros;
CREATE POLICY "Users can create their own cadastros" 
  ON public.cadastros 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem seus próprios cadastros
DROP POLICY IF EXISTS "Users can update their own cadastros" ON public.cadastros;
CREATE POLICY "Users can update their own cadastros" 
  ON public.cadastros 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem seus próprios cadastros
DROP POLICY IF EXISTS "Users can delete their own cadastros" ON public.cadastros;
CREATE POLICY "Users can delete their own cadastros" 
  ON public.cadastros 
  FOR DELETE 
  USING (auth.uid() = user_id);
