# 🚨 SOLUÇÃO URGENTE - CRM NÃO FUNCIONA

## ❌ PROBLEMA IDENTIFICADO:
A tabela `crm_leads` não existe no banco Supabase.

## ✅ SOLUÇÃO IMEDIATA:

### 1. Acesse o Supabase Dashboard:
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: **ugfdngpqehufdhanfsqt**

### 2. Abra o SQL Editor:
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New Query"**

### 3. Cole e Execute este SQL:

```sql
-- Criar tabela crm_leads
CREATE TABLE IF NOT EXISTS public.crm_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'Website',
  status TEXT NOT NULL DEFAULT 'prospeccao' CHECK (status IN ('prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechamento', 'perdido')),
  value DECIMAL(10,2) DEFAULT 0,
  probability INTEGER DEFAULT 25 CHECK (probability >= 0 AND probability <= 100),
  next_follow_up DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own leads" 
ON public.crm_leads 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own leads" 
ON public.crm_leads 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own leads" 
ON public.crm_leads 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own leads" 
ON public.crm_leads 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- Índices
CREATE INDEX IF NOT EXISTS idx_crm_leads_user_id ON public.crm_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
```

### 4. Execute:
- Clique no botão **"Run"** (ou Ctrl+Enter)
- Aguarde a confirmação de sucesso

### 5. Teste o Sistema:
- Volte para o sistema CRM
- Recarregue a página (F5)
- O botão "Criar" agora deve funcionar
- As estatísticas devem aparecer corretamente

## 🎯 RESULTADO ESPERADO:

Após executar o SQL:
- ✅ Botão "Novo Lead" funcionando
- ✅ Formulário salvando dados
- ✅ Estatísticas calculando (Total, Fechados, Valor, Taxa)
- ✅ Pipeline organizando leads por status
- ✅ Filtros e busca operacionais

## 🔧 CÓDIGO CORRIGIDO:

O sistema já está com o código correto:
- ✅ Hook `usePipeline` conectado à tabela
- ✅ Formulário `PipelineForm` validando campos
- ✅ Componente `PipelineStats` calculando métricas
- ✅ Componente `PipelineBoard` organizando pipeline
- ✅ Tratamento de erros implementado

**EXECUTE APENAS O SQL NO SUPABASE E O SISTEMA FUNCIONARÁ!**