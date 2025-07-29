// Script simples para testar autenticação
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testeSimples() {
  console.log('🧪 Teste simples de autenticação...');
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  console.log('📋 Sessão:', session ? 'Ativa' : 'Nenhuma');
  
  if (session) {
    console.log('✅ Usuário logado:', session.user.email);
    
    // Testar inserção
    const { data, error: insertError } = await supabase
      .from('lancamentos')
      .insert([{
        data: '2025-01-29',
        tipo: 'receita',
        categoria: 'Teste',
        valor: 100,
        descricao: 'Teste simples',
        user_id: session.user.id
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError);
    } else {
      console.log('✅ Inserido com sucesso:', data);
    }
  } else {
    console.log('⚠️ Nenhuma sessão ativa');
  }
}

testeSimples(); 