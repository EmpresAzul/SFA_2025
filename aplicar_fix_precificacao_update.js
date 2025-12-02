import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.log('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function aplicarFix() {
  console.log('🔧 Aplicando correção na política de UPDATE da tabela precificacao...\n');

  try {
    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('supabase/migrations/20250202000000_fix_precificacao_update_policy.sql', 'utf8');
    
    console.log('📄 SQL a ser executado:');
    console.log('─'.repeat(60));
    console.log(sqlContent);
    console.log('─'.repeat(60));
    console.log('');

    console.log('⚠️ IMPORTANTE:');
    console.log('Este script precisa ser executado manualmente no Supabase SQL Editor');
    console.log('');
    console.log('🔧 PASSO A PASSO:');
    console.log('1. Acesse: https://supabase.com/dashboard');
    console.log('2. Selecione seu projeto');
    console.log('3. Vá em "SQL Editor" no menu lateral');
    console.log('4. Clique em "New Query"');
    console.log('5. Cole o SQL acima');
    console.log('6. Clique em "Run" ou pressione Ctrl+Enter');
    console.log('');
    console.log('✅ Após executar, o sistema de precificação funcionará corretamente!');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

aplicarFix();
