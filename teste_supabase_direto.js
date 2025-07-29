// Script para testar autenticação direta
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase (mesmas do frontend)
const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

// Criar cliente Supabase com configurações idênticas ao frontend
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

async function testarAutenticacaoDireta() {
  try {
    console.log('🔐 Testando autenticação direta...');
    
    // Verificar sessão atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao verificar sessão:', sessionError);
      return;
    }
    
    console.log('📋 Sessão atual:', session ? 'Ativa' : 'Nenhuma');
    
    if (session) {
      console.log('👤 Usuário ID:', session.user.id);
      console.log('📧 Email:', session.user.email);
      
      // Testar inserção com usuário autenticado
      console.log('🧪 Testando inserção com usuário autenticado...');
      
      const lancamentoTeste = {
        data: '2025-01-29',
        tipo: 'receita',
        categoria: 'Vendas',
        valor: 100.00,
        descricao: 'Teste de inserção com usuário autenticado',
        observacoes: 'Teste direto',
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
    } else {
      console.log('⚠️ Nenhuma sessão ativa - você precisa estar logado na aplicação');
      console.log('📋 Abra a aplicação em http://localhost:8084/ e faça login primeiro');
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Executar teste
testarAutenticacaoDireta();