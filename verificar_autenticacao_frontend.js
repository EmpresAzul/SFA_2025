// Script para verificar autenticação no frontend
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

async function verificarAutenticacaoFrontend() {
  try {
    console.log('🔐 Verificando autenticação no frontend...');
    
    // Verificar sessão atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao verificar sessão:', sessionError);
      return;
    }
    
    console.log('📋 Sessão atual:', session ? 'Ativa' : 'Nenhuma');
    
    if (session) {
      console.log('✅ Usuário autenticado!');
      console.log('👤 Usuário ID:', session.user.id);
      console.log('📧 Email:', session.user.email);
      
      // Testar inserção com usuário autenticado
      console.log('🧪 Testando inserção com usuário autenticado...');
      
      const lancamentoData = {
        data: '2025-01-29',
        tipo: 'receita',
        categoria: 'Vendas',
        valor: 100.00,
        descricao: 'Teste de inserção com usuário autenticado',
        observacoes: 'Teste direto',
        user_id: session.user.id
      };
      
      console.log('📝 Dados do lançamento:', lancamentoData);
      
      // Tentar inserir
      const { data, error } = await supabase
        .from('lancamentos')
        .insert([lancamentoData])
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
      console.log('⚠️ Nenhuma sessão ativa');
      console.log('📋 Para testar, você precisa:');
      console.log('   1. Abrir a aplicação em http://localhost:8084/');
      console.log('   2. Fazer login com suas credenciais');
      console.log('   3. Executar este script novamente');
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Executar verificação
verificarAutenticacaoFrontend();