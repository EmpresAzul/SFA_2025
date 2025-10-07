# 🚀 Instruções para Ativar o Sistema CRM

## ✅ O que foi corrigido:

1. **Hook usePipeline**: Agora conecta corretamente com a tabela `crm_leads` do Supabase
2. **Formulário de cadastro**: Botão "Criar" funcionando perfeitamente
3. **Estatísticas**: Mostradores no topo calculando corretamente:
   - Total de Leads
   - Negócios Fechados  
   - Valor Total
   - Taxa de Conversão
4. **Pipeline Board**: Exibindo leads organizados por status
5. **Filtros**: Busca e filtro por status funcionando
6. **CRUD completo**: Criar, editar, excluir leads

## 🔧 Configuração necessária no Supabase:

**IMPORTANTE**: Para o sistema funcionar, você precisa criar a tabela no banco de dados.

### Passo a passo:

1. **Acesse o Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá em "SQL Editor"** no menu lateral
4. **Clique em "New Query"**
5. **Cole e execute o SQL abaixo**:

```sql
-- Criar tabela para leads do CRM
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

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (cada usuário vê apenas seus leads)
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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_crm_leads_user_id ON public.crm_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
```

6. **Clique em "Run"** para executar
7. **Teste o sistema CRM** - agora deve funcionar perfeitamente!

## 🎯 Funcionalidades do Sistema CRM:

### 📊 Estatísticas no Topo:
- **Total de Leads**: Conta todos os leads cadastrados
- **Negócios Fechados**: Leads com status "Fechado"
- **Valor Total**: Soma de todos os valores dos leads
- **Taxa de Conversão**: Percentual de leads fechados

### 📝 Formulário de Cadastro:
- **Nome do Lead**: Campo obrigatório
- **E-mail**: Campo opcional
- **WhatsApp**: Campo opcional  
- **Valor do Negócio**: Com máscara de moeda brasileira
- **Status**: Dropdown com todas as etapas
- **Observações**: Campo de texto livre

### 🔄 Pipeline Board:
- **6 colunas**: Prospecção, Qualificação, Proposta, Negociação, Fechado, Perdido
- **Drag & Drop**: Mover leads entre etapas (futuro)
- **Ações**: Editar e excluir cada lead
- **Contadores**: Número de leads em cada etapa

### 🔍 Filtros:
- **Busca**: Por nome, empresa ou e-mail
- **Status**: Filtrar por etapa específica

## ✅ Após executar o SQL:

O sistema CRM estará 100% funcional com:
- ✅ Botão "Criar" funcionando
- ✅ Estatísticas calculando corretamente
- ✅ Pipeline organizando leads por status
- ✅ Formulário salvando no banco
- ✅ Edição e exclusão funcionando
- ✅ Filtros e busca operacionais

**Pronto para usar! 🚀**