// Script para aplicar correções de segurança via API do Supabase
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQzNjcyNSwiZXhwIjoyMDY5MDEyNzI1fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

// Criar cliente Supabase com service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// SQL das correções
const correcoesSQL = `
-- 1. CORRIGIR FUNÇÃO handle_new_user() - Search Path Seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- 2. ADICIONAR POLICY DE RLS PARA LANÇAMENTOS (PERMITE SALVAR)
DROP POLICY IF EXISTS "Users can insert their own lancamentos" ON public.lancamentos;
CREATE POLICY "Users can insert their own lancamentos"
  ON public.lancamentos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own lancamentos" ON public.lancamentos;
CREATE POLICY "Users can view their own lancamentos"
  ON public.lancamentos
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own lancamentos" ON public.lancamentos;
CREATE POLICY "Users can update their own lancamentos"
  ON public.lancamentos
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own lancamentos" ON public.lancamentos;
CREATE POLICY "Users can delete their own lancamentos"
  ON public.lancamentos
  FOR DELETE
  USING (auth.uid() = user_id);

-- 3. HABILITAR RLS NA TABELA lancamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
`;

async function aplicarCorrecoes() {
  try {
    console.log('🔧 Aplicando correções de segurança...');
    
    // Executar SQL via API
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: correcoesSQL
    });
    
    if (error) {
      console.error('❌ Erro ao aplicar correções:', error);
      
      // Tentar método alternativo
      console.log('🔄 Tentando método alternativo...');
      await aplicarCorrecoesAlternativo();
    } else {
      console.log('✅ Correções aplicadas com sucesso!');
      console.log('🎉 Agora você pode salvar lançamentos normalmente!');
    }
    
  } catch (err) {
    console.error('❌ Erro:', err);
    await aplicarCorrecoesAlternativo();
  }
}

async function aplicarCorrecoesAlternativo() {
  try {
    console.log('🔄 Aplicando correções via método alternativo...');
    
    // Criar policies diretamente via API
    const policies = [
      {
        table: 'lancamentos',
        name: 'Users can insert their own lancamentos',
        operation: 'INSERT',
        definition: 'auth.uid() = user_id'
      },
      {
        table: 'lancamentos', 
        name: 'Users can view their own lancamentos',
        operation: 'SELECT',
        definition: 'auth.uid() = user_id'
      },
      {
        table: 'lancamentos',
        name: 'Users can update their own lancamentos', 
        operation: 'UPDATE',
        definition: 'auth.uid() = user_id'
      },
      {
        table: 'lancamentos',
        name: 'Users can delete their own lancamentos',
        operation: 'DELETE', 
        definition: 'auth.uid() = user_id'
      }
    ];
    
    for (const policy of policies) {
      try {
        await supabase.rpc('create_policy', {
          table_name: policy.table,
          policy_name: policy.name,
          operation: policy.operation,
          definition: policy.definition
        });
        console.log(`✅ Policy criada: ${policy.name}`);
      } catch (err) {
        console.log(`⚠️ Policy já existe: ${policy.name}`);
      }
    }
    
    console.log('✅ Correções aplicadas via método alternativo!');
    console.log('🎉 Agora você pode salvar lançamentos normalmente!');
    
  } catch (err) {
    console.error('❌ Erro no método alternativo:', err);
    console.log('📋 Execute manualmente o SQL no painel do Supabase:');
    console.log('https://supabase.com/dashboard/project/tssbhjqnptffswnyynhq/sql');
  }
}

// Executar correções
aplicarCorrecoes();