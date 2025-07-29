// Script para corrigir políticas RLS
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function corrigirRLS() {
  console.log('🔧 Corrigindo políticas RLS...');
  
  // Aplicar políticas RLS corretas
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
      console.log(`🔄 Aplicando política: ${policy.name}`);
      
      // Tentar criar a política
      const { error } = await supabase.rpc('create_policy', {
        table_name: policy.table,
        policy_name: policy.name,
        operation: policy.operation,
        definition: policy.definition
      });
      
      if (error) {
        console.error(`❌ Erro ao criar política ${policy.name}:`, error);
      } else {
        console.log(`✅ Política ${policy.name} criada com sucesso`);
      }
    } catch (err) {
      console.error(`❌ Exceção ao criar política ${policy.name}:`, err);
    }
  }
  
  console.log('🎉 Correções aplicadas!');
}

corrigirRLS(); 