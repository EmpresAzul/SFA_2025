-- ============================================
-- CORREÇÃO ESTRUTURA TABELA LANCAMENTOS
-- ============================================

-- 1. Verificar estrutura atual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'lancamentos'
ORDER BY ordinal_position;

-- 2. Adicionar campos que podem estar faltando
ALTER TABLE public.lancamentos 
ADD COLUMN IF NOT EXISTS descricao TEXT,
ADD COLUMN IF NOT EXISTS data_vencimento DATE,
ADD COLUMN IF NOT EXISTS data_recebimento DATE,
ADD COLUMN IF NOT EXISTS recorrente BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS meses_recorrencia INTEGER,
ADD COLUMN IF NOT EXISTS lancamento_pai_id UUID;

-- 3. Tornar descricao opcional (pode ser NULL)
ALTER TABLE public.lancamentos 
ALTER COLUMN descricao DROP NOT NULL;

-- 4. Garantir que status tem valor padrão correto
ALTER TABLE public.lancamentos 
ALTER COLUMN status SET DEFAULT 'confirmado';

-- 5. Atualizar lançamentos existentes sem descrição
UPDATE public.lancamentos 
SET descricao = COALESCE(observacoes, categoria || ' - ' || tipo)
WHERE descricao IS NULL OR descricao = '';

-- 6. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON public.lancamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_lancamentos_status ON public.lancamentos(status);
CREATE INDEX IF NOT EXISTS idx_lancamentos_pai_id ON public.lancamentos(lancamento_pai_id);

-- 7. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'lancamentos';

-- 8. Recriar políticas RLS se necessário
DROP POLICY IF EXISTS "Users can view their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can create their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can update their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can delete their own lancamentos" ON public.lancamentos;

CREATE POLICY "Users can view their own lancamentos" 
ON public.lancamentos 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lancamentos" 
ON public.lancamentos 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lancamentos" 
ON public.lancamentos 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lancamentos" 
ON public.lancamentos 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- 9. Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'lancamentos'
ORDER BY ordinal_position;

-- 10. Contar lançamentos por usuário
SELECT user_id, COUNT(*) as total_lancamentos
FROM public.lancamentos
GROUP BY user_id;
