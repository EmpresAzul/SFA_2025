-- ============================================
-- EXECUTAR ESTE SQL NO SUPABASE DASHBOARD
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Clique em "SQL Editor" no menu lateral
-- 4. Clique em "New Query"
-- 5. Cole TODO este conteúdo
-- 6. Clique em "Run" ou pressione Ctrl+Enter
-- 7. Aguarde a mensagem "Success. No rows returned"
--
-- ============================================

-- Remover política antiga de UPDATE
DROP POLICY IF EXISTS "Users can update own precificacao" ON public.precificacao;

-- Criar nova política com WITH CHECK
-- Isso garante que o user_id não pode ser alterado durante o UPDATE
CREATE POLICY "Users can update own precificacao"
  ON public.precificacao FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PRONTO! Agora teste a edição de:
-- - Produtos
-- - Serviços
-- - Horas
-- ============================================
