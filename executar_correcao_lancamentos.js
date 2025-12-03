import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executarCorrecao() {
  console.log('🔧 Iniciando correção da estrutura de lançamentos...\n');

  try {
    // 1. Verificar estrutura atual
    console.log('📋 1. Verificando estrutura atual...');
    const { data: colunas, error: erroCol } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = 'lancamentos'
          ORDER BY ordinal_position;
        `
      });
    
    if (erroCol) {
      console.log('⚠️ Não foi possível verificar estrutura via RPC');
    } else {
      console.log('✅ Estrutura atual:', colunas);
    }

    // 2. Verificar lançamentos existentes
    console.log('\n📊 2. Verificando lançamentos existentes...');
    const { data: lancamentos, error: erroLanc, count } = await supabase
      .from('lancamentos')
      .select('*', { count: 'exact', head: false });

    if (erroLanc) {
      console.error('❌ Erro ao buscar lançamentos:', erroLanc.message);
    } else {
      console.log(`✅ Total de lançamentos encontrados: ${count || lancamentos?.length || 0}`);
      if (lancamentos && lancamentos.length > 0) {
        console.log('📝 Exemplo de lançamento:', lancamentos[0]);
      }
    }

    // 3. Verificar políticas RLS
    console.log('\n🔒 3. Verificando políticas RLS...');
    const { data: policies, error: erroPol } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT policyname, cmd, qual, with_check
          FROM pg_policies
          WHERE tablename = 'lancamentos';
        `
      });

    if (erroPol) {
      console.log('⚠️ Não foi possível verificar políticas via RPC');
    } else {
      console.log('✅ Políticas RLS:', policies);
    }

    console.log('\n✅ Verificação concluída!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. Execute o arquivo "corrigir_lancamentos_estrutura.sql" no SQL Editor do Supabase');
    console.log('2. Isso garantirá que a estrutura está correta');
    console.log('3. Depois teste criar um novo lançamento');

  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
  }
}

executarCorrecao();
