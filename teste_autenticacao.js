// Script de teste para verificar autenticação
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

// Criar cliente Supabase com anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testarAutenticacao() {
  try {
    console.log('🔐 Testando autenticação...');
    
    // Verificar sessão atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao verificar sessão:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('⚠️ Nenhuma sessão ativa encontrada');
      console.log('📋 Para testar, você precisa estar logado na aplicação');
      return;
    }
    
    console.log('✅ Sessão ativa encontrada');
    console.log('👤 Usuário ID:', session.user.id);
    console.log('📧 Email:', session.user.email);
    
    // Testar inserção com usuário real
    console.log('🧪 Testando inserção com usuário autenticado...');
    
    const lancamentoTeste = {
      data: '2025-01-29',
      tipo: 'receita',
      categoria: 'Vendas',
      valor: 100.00,
      observacoes: 'Teste de inserção com usuário autenticado',
      user_id: session.user.id
    };
    
    console.log('📝 Dados do lançamento de teste:', lancamentoTeste);
    
    // Tentar inserir
    const { data, error } = await supabase
      .from('lancamentos')
      .insert([lancamentoTeste])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao inserir lançamento:', error);
      console.error('📋 Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Lançamento inserido com sucesso:', data);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Executar teste
testarAutenticacao();