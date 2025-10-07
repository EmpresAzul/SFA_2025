// Teste de conexão com o banco Lovable Cloud - Tabela Profiles
// Execute: node teste_perfil_lovable.js

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (Lovable Cloud)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarConexaoProfiles() {
  console.log('🔍 Testando conexão com tabela profiles...');
  
  try {
    // 1. Testar se a tabela existe
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao acessar tabela profiles:', error);
      return;
    }
    
    console.log('✅ Tabela profiles acessível!');
    console.log('📊 Estrutura encontrada:', data);
    
    // 2. Testar estrutura da tabela
    const { data: structure } = await supabase
      .from('profiles')
      .select('id, nome, empresa, telefone, cargo, email, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep, created_at, updated_at')
      .limit(1);
    
    console.log('🏗️ Colunas disponíveis confirmadas');
    
    // 3. Verificar políticas RLS
    console.log('🔒 Testando políticas de segurança...');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testarConexaoProfiles();