-- Corrigir política de UPDATE da tabela precificacao
-- Adicionar WITH CHECK para garantir que o user_id não seja alterado

-- Remover política antiga
DROP POLICY IF EXISTS "Users can update own precificacao" ON public.precificacao;

-- Criar nova política com WITH CHECK
CREATE POLICY "Users can update own precificacao"
  ON public.precificacao FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
