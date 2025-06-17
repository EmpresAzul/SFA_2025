
-- Adicionar campos para lançamentos recorrentes na tabela lancamentos
ALTER TABLE public.lancamentos 
ADD COLUMN recorrente BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN meses_recorrencia INTEGER DEFAULT NULL,
ADD COLUMN lancamento_pai_id UUID DEFAULT NULL;

-- Criar índice para melhor performance nas consultas de lançamentos recorrentes
CREATE INDEX IF NOT EXISTS idx_lancamentos_pai_id ON public.lancamentos(lancamento_pai_id);

-- Adicionar constraint para garantir que meses_recorrencia seja positivo quando recorrente for true
ALTER TABLE public.lancamentos 
ADD CONSTRAINT check_meses_recorrencia 
CHECK (
  (recorrente = false AND meses_recorrencia IS NULL) OR 
  (recorrente = true AND meses_recorrencia > 0)
);

-- Adicionar constraint para garantir que apenas lançamentos principais podem ter filhos
ALTER TABLE public.lancamentos 
ADD CONSTRAINT check_lancamento_pai_hierarquia 
CHECK (
  (lancamento_pai_id IS NULL) OR 
  (lancamento_pai_id IS NOT NULL AND recorrente = false AND meses_recorrencia IS NULL)
);
