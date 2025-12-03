# 🚀 EXECUTAR NO SUPABASE AGORA

## ⚡ AÇÃO IMEDIATA NECESSÁRIA

Você precisa executar este SQL no Supabase Dashboard para corrigir a estrutura da tabela `lancamentos`.

## 📋 PASSO A PASSO

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login
- Selecione seu projeto FluxoAzul

### 2. Abra o SQL Editor
- No menu lateral, clique em **SQL Editor**
- Clique em **New Query**

### 3. Cole e Execute o SQL Abaixo

```sql
-- ============================================
-- FIX: Estrutura da tabela lancamentos
-- ============================================

-- 1. Adicionar campos que podem estar faltando
ALTER TABLE public.lancamentos 
ADD COLUMN IF NOT EXISTS descricao TEXT,
ADD COLUMN IF NOT EXISTS data_vencimento DATE,
ADD COLUMN IF NOT EXISTS data_recebimento DATE,
ADD COLUMN IF NOT EXISTS recorrente BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS meses_recorrencia INTEGER,
ADD COLUMN IF NOT EXISTS lancamento_pai_id UUID;

-- 2. Tornar descricao opcional (pode ser NULL)
ALTER TABLE public.lancamentos 
ALTER COLUMN descricao DROP NOT NULL;

-- 3. Garantir que status tem valor padrão correto
ALTER TABLE public.lancamentos 
ALTER COLUMN status SET DEFAULT 'confirmado';

-- 4. Atualizar lançamentos existentes sem descrição
UPDATE public.lancamentos 
SET descricao = COALESCE(observacoes, categoria || ' - ' || tipo)
WHERE descricao IS NULL OR descricao = '';

-- 5. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON public.lancamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_lancamentos_status ON public.lancamentos(status);
CREATE INDEX IF NOT EXISTS idx_lancamentos_pai_id ON public.lancamentos(lancamento_pai_id);

-- 6. Garantir que RLS está habilitado
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- 7. Recriar políticas RLS para garantir consistência
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

-- 8. Adicionar constraint para meses_recorrencia
ALTER TABLE public.lancamentos 
DROP CONSTRAINT IF EXISTS check_meses_recorrencia;

ALTER TABLE public.lancamentos 
ADD CONSTRAINT check_meses_recorrencia 
CHECK (
  (recorrente = false AND meses_recorrencia IS NULL) OR 
  (recorrente = true AND meses_recorrencia > 0)
);

-- 9. Adicionar constraint para hierarquia de lançamentos
ALTER TABLE public.lancamentos 
DROP CONSTRAINT IF EXISTS check_lancamento_pai_hierarquia;

ALTER TABLE public.lancamentos 
ADD CONSTRAINT check_lancamento_pai_hierarquia 
CHECK (
  (lancamento_pai_id IS NULL) OR 
  (lancamento_pai_id IS NOT NULL AND recorrente = false AND meses_recorrencia IS NULL)
);

-- 10. Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'lancamentos'
ORDER BY ordinal_position;
```

### 4. Clique em RUN (ou pressione Ctrl+Enter)

Você deve ver uma mensagem de sucesso e a lista de colunas da tabela.

### 5. Verifique o Resultado

Você deve ver algo como:

```
column_name          | data_type | is_nullable | column_default
---------------------|-----------|-------------|----------------
id                   | uuid      | NO          | gen_random_uuid()
user_id              | uuid      | NO          | 
data                 | date      | NO          | 
tipo                 | text      | NO          | 
categoria            | text      | NO          | 
valor                | numeric   | NO          | 
descricao            | text      | YES         | NULL
cliente_id           | uuid      | YES         | NULL
fornecedor_id        | uuid      | YES         | NULL
observacoes          | text      | YES         | NULL
status               | text      | NO          | 'confirmado'
recorrente           | boolean   | NO          | false
meses_recorrencia    | integer   | YES         | NULL
lancamento_pai_id    | uuid      | YES         | NULL
data_vencimento      | date      | YES         | NULL
data_recebimento     | date      | YES         | NULL
created_at           | timestamp | NO          | now()
updated_at           | timestamp | NO          | now()
```

## ✅ PRONTO!

Após executar o SQL:

1. ✅ A estrutura da tabela estará correta
2. ✅ Os lançamentos poderão ser salvos
3. ✅ Os lançamentos aparecerão na lista
4. ✅ Os saldos serão calculados corretamente

## 🧪 TESTE AGORA

1. Volte para o aplicativo (http://localhost:8080)
2. Vá na aba **Lançamentos Financeiros**
3. Clique em **Novo Lançamento**
4. Preencha:
   - Data: hoje
   - Tipo: Receita
   - Categoria: Vendas
   - Valor: 1000
   - Observações: Teste de lançamento
5. Clique em **Salvar**
6. Verifique se:
   - ✅ Aparece mensagem de sucesso
   - ✅ O lançamento aparece na lista
   - ✅ Os cards de resumo mostram os valores
   - ✅ O saldo está correto

## 🚨 SE DER ERRO

Se aparecer algum erro ao executar o SQL:

1. **Copie a mensagem de erro completa**
2. **Me envie a mensagem**
3. Vou ajustar o SQL conforme necessário

## 📝 DEPOIS DO TESTE

Quando confirmar que está funcionando:

1. Me avise que funcionou
2. Vou fazer o commit e push
3. Vou fazer o deploy no Netlify
4. Sistema estará 100% funcional! 🎉
