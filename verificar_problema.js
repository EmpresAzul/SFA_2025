// Script para verificar problema específico no frontend
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verificarProblema() {
  console.log('🔍 Verificando problema específico...');
  
  // Testar inserção com dados mínimos
  const dados = {
    data: '2025-01-29',
    tipo: 'receita',
    categoria: 'Teste',
    valor: 100,
    descricao: 'Teste mínimo',
    user_id: '12345678-1234-1234-1234-123456789012'
  };
  
  console.log('📝 Tentando inserir:', dados);
  
  try {
    const { data, error } = await supabase
      .from('lancamentos')
      .insert([dados])
      .select();
    
    if (error) {
      console.error('❌ Erro:', error);
      console.error('📋 Código:', error.code);
      console.error('📋 Mensagem:', error.message);
    } else {
      console.log('✅ Sucesso:', data);
    }
  } catch (err) {
    console.error('❌ Exceção:', err);
  }
}

verificarProblema(); 