// Script de teste para verificar inserção de cadastros
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

// Criar cliente Supabase com anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testarInsercaoCadastro() {
  try {
    console.log('🧪 Testando inserção de cadastro...');
    
    // Dados de teste - apenas campos que existem na tabela
    const cadastroTeste = {
      nome: 'Teste Cliente',
      tipo: 'Cliente',
      cpf_cnpj: '123.456.789-00',
      telefone: '(11) 99999-9999',
      email: 'teste@email.com',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      user_id: '00000000-0000-0000-0000-000000000000' // ID fictício para teste
    };
    
    console.log('📝 Dados do cadastro de teste:', cadastroTeste);
    
    // Tentar inserir
    const { data, error } = await supabase
      .from('cadastros')
      .insert([cadastroTeste])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao inserir cadastro:', error);
      console.error('📋 Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Cadastro inserido com sucesso:', data);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Executar teste
testarInsercaoCadastro();