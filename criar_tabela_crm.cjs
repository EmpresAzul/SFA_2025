const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createCRMTable() {
  try {
    console.log('🚀 Criando tabela crm_leads...');
    
    // Primeiro, vamos tentar inserir um registro de teste para ver se a tabela existe
    const testData = {
      name: 'Teste Lead',
      company: 'Empresa Teste',
      email: 'teste@teste.com',
      phone: '(11) 99999-9999',
      source: 'Manual',
      status: 'prospeccao',
      value: 1000,
      probability: 25,
      notes: 'Lead de teste'
    };
    
    console.log('🔍 Testando inserção de dados...');
    
    const { data, error } = await supabase
      .from('crm_leads')
      .insert([testData])
      .select();
    
    if (error) {
      console.log('❌ Tabela não existe. Erro:', error.message);
      console.log('');
      console.log('📋 EXECUTE ESTE SQL NO SUPABASE DASHBOARD:');
      console.log('');
      console.log(`-- Criar tabela crm_leads
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
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);`);
      
    } else {
      console.log('✅ Tabela existe e funcionando!');
      console.log('📊 Dados inseridos:', data);
      
      // Remover dados de teste
      console.log('🗑️ Removendo dados de teste...');
      await supabase.from('crm_leads').delete().eq('email', 'teste@teste.com');
      console.log('✅ Sistema CRM pronto!');
    }
    
  } catch (err) {
    console.log('❌ Erro:', err.message);
  }
}

createCRMTable();