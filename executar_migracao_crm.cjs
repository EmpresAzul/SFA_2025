const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

// Usar a service role key para operações administrativas
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function executeMigration() {
  try {
    console.log('🚀 Iniciando migração do CRM...');
    
    // Verificar se a tabela já existe tentando inserir dados de teste
    console.log('🔍 Verificando se a tabela crm_leads existe...');
    
    const testData = {
      name: 'Lead Teste',
      company: 'Empresa Teste',
      email: 'teste@teste.com',
      phone: '(11) 99999-9999',
      source: 'Manual',
      status: 'prospeccao',
      value: 1000,
      probability: 25,
      notes: 'Lead de teste criado automaticamente'
    };
    
    // Tentar inserir dados de teste
    const { data: insertData, error: insertError } = await supabase
      .from('crm_leads')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.log('❌ Tabela não existe. Erro:', insertError.message);
      console.log('');
      console.log('📝 INSTRUÇÕES PARA CRIAR A TABELA:');
      console.log('   1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
      console.log('   2. Selecione seu projeto');
      console.log('   3. Vá em "SQL Editor" no menu lateral');
      console.log('   4. Clique em "New Query"');
      console.log('   5. Cole e execute o seguinte SQL:');
      console.log('');
      console.log('-- COPIE E COLE NO SUPABASE SQL EDITOR:');
      console.log(`
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_crm_leads_user_id ON public.crm_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
      `);
      console.log('');
      console.log('   6. Clique em "Run" para executar');
      console.log('   7. Após executar, teste novamente o sistema CRM');
      
    } else {
      console.log('✅ Tabela crm_leads existe e funcionando!');
      console.log('🗑️ Removendo dados de teste...');
      await supabase.from('crm_leads').delete().eq('email', 'teste@teste.com');
      console.log('✅ Sistema CRM pronto para uso!');
    }
    
  } catch (err) {
    console.log('❌ Erro geral:', err.message);
  }
}

executeMigration();