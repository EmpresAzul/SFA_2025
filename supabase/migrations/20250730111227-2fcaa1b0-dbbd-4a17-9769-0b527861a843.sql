-- Corrigir estrutura da tabela precificacao para incluir preco_final
ALTER TABLE precificacao 
  ADD COLUMN IF NOT EXISTS preco_final numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dados_json jsonb DEFAULT '{}';

-- Atualizar registros existentes que não têm preco_final
UPDATE precificacao 
SET preco_final = preco_venda 
WHERE preco_final IS NULL OR preco_final = 0;