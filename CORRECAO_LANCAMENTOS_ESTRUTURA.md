# ✅ CORREÇÃO - Estrutura da Tabela Lançamentos

## 🎯 Problema Identificado

**Sintoma:** Lançamentos não estão sendo salvos e listados corretamente. Os saldos não estão sendo atualizados.

**Causa Raiz:** 
1. A tabela `lancamentos` pode ter o campo `descricao` como NOT NULL, mas o código estava enviando apenas `observacoes`
2. Campos adicionais como `data_vencimento`, `data_recebimento` podem estar faltando
3. Possível problema com políticas RLS

## 🔧 Solução Aplicada

### 1. Migration Criada

**Arquivo:** `supabase/migrations/20251203000000_fix_lancamentos_structure.sql`

Esta migration:
- ✅ Adiciona campos faltantes (`descricao`, `data_vencimento`, `data_recebimento`, `recorrente`, etc.)
- ✅ Torna o campo `descricao` opcional (nullable)
- ✅ Define `status` padrão como 'confirmado'
- ✅ Atualiza lançamentos existentes sem descrição
- ✅ Cria índices para melhor performance
- ✅ Recria políticas RLS para garantir consistência

### 2. Estrutura Final da Tabela

```sql
CREATE TABLE public.lancamentos (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL,
  data_vencimento DATE,
  data_recebimento DATE,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  descricao TEXT,  -- OPCIONAL
  cliente_id UUID,
  fornecedor_id UUID,
  observacoes TEXT,
  status TEXT DEFAULT 'confirmado',
  recorrente BOOLEAN DEFAULT false,
  meses_recorrencia INTEGER,
  lancamento_pai_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 3. Código Atualizado

O código em `useLancamentosMutations.ts` já está preparado para enviar:
- ✅ `descricao` (gerada automaticamente se não fornecida)
- ✅ `data_vencimento` e `data_recebimento`
- ✅ `status` com valor padrão 'confirmado'
- ✅ Campos de recorrência

## 📋 Passos para Aplicar a Correção

### Opção 1: Via Supabase Dashboard (RECOMENDADO)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de `corrigir_lancamentos_estrutura.sql`
4. Execute o SQL
5. Verifique se não há erros

### Opção 2: Via Migration

1. A migration já foi criada em `supabase/migrations/20251203000000_fix_lancamentos_structure.sql`
2. Se você usa Supabase CLI localmente:
   ```bash
   supabase db push
   ```
3. Ou faça upload manual da migration no dashboard

### Opção 3: Via Script Node.js

```bash
node executar_correcao_lancamentos.js
```

Este script verifica a estrutura atual e fornece informações sobre o estado da tabela.

## 🧪 Como Testar

1. **Verificar estrutura:**
   ```sql
   SELECT column_name, data_type, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_name = 'lancamentos'
   ORDER BY ordinal_position;
   ```

2. **Criar um lançamento de teste:**
   - Acesse a aba "Lançamentos Financeiros"
   - Clique em "Novo Lançamento"
   - Preencha os campos obrigatórios
   - Salve

3. **Verificar se foi salvo:**
   ```sql
   SELECT * FROM lancamentos ORDER BY created_at DESC LIMIT 5;
   ```

4. **Verificar saldos:**
   - Os cards de resumo devem mostrar os valores corretos
   - Receitas, Despesas e Saldo devem estar atualizados

## 🔍 Diagnóstico

### Verificar Lançamentos Existentes

```sql
-- Contar lançamentos por usuário
SELECT user_id, COUNT(*) as total
FROM lancamentos
GROUP BY user_id;

-- Ver últimos lançamentos
SELECT id, data, tipo, categoria, valor, descricao, status, created_at
FROM lancamentos
ORDER BY created_at DESC
LIMIT 10;
```

### Verificar Políticas RLS

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'lancamentos';
```

### Verificar Índices

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'lancamentos';
```

## 📊 Impacto Esperado

Após aplicar a correção:

- ✅ Lançamentos serão salvos corretamente
- ✅ Lançamentos aparecerão na lista imediatamente
- ✅ Saldos serão calculados e exibidos corretamente
- ✅ Filtros funcionarão normalmente
- ✅ Edição e exclusão funcionarão sem problemas

## 🚨 Troubleshooting

### Se os lançamentos ainda não aparecerem:

1. **Verificar autenticação:**
   ```javascript
   console.log('User ID:', session?.user?.id);
   ```

2. **Verificar RLS:**
   - As políticas RLS devem permitir SELECT para o usuário autenticado
   - Verifique se `auth.uid()` retorna o ID correto

3. **Verificar console do navegador:**
   - Abra DevTools (F12)
   - Vá na aba Console
   - Procure por erros relacionados a "lancamentos"

4. **Verificar query:**
   - O hook `useLancamentosQuery` deve estar buscando com o `user_id` correto
   - Verifique os logs no console

### Se os saldos não atualizarem:

1. **Verificar invalidação de cache:**
   ```javascript
   queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
   ```

2. **Forçar refresh:**
   - Recarregue a página (F5)
   - Ou faça logout/login

## ✨ Status

- ✅ Migration criada
- ✅ Scripts de verificação criados
- ✅ Código do frontend já preparado
- ⏳ Aguardando execução da migration no Supabase
- ⏳ Aguardando testes

## 📝 Próximos Passos

1. Execute a migration no Supabase
2. Teste criar um novo lançamento
3. Verifique se aparece na lista
4. Verifique se os saldos atualizam
5. Faça commit e push das alterações
6. Deploy automático no Netlify
