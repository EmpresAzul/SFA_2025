
-- Remover todas as tabelas relacionadas aos cadastros
DROP TABLE IF EXISTS public.cadastros CASCADE;
DROP TABLE IF EXISTS public.lancamentos CASCADE;

-- Remover índices relacionados se ainda existirem
DROP INDEX IF EXISTS idx_cadastros_user_id;
DROP INDEX IF EXISTS idx_cadastros_nome;
DROP INDEX IF EXISTS idx_cadastros_tipo;
DROP INDEX IF EXISTS idx_lancamentos_user_id;
DROP INDEX IF EXISTS idx_lancamentos_data;
DROP INDEX IF EXISTS idx_lancamentos_tipo;
