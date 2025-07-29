// Script para verificar a estrutura da tabela lancamentos
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

// Criar cliente Supabase com anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verificarEstrutura() {
  try {
    console.log('🔍 Verificando estrutura da tabela lancamentos...');
    
    // Tentar inserir com diferentes estruturas para identificar o problema
    const testes = [
      {
        nome: 'Teste 1 - Estrutura básica',
        dados: {
          data: '2025-01-29',
          tipo: 'receita',
          categoria: 'Vendas',
          valor: 100.00,
          descricao: 'Teste básico',
          user_id: '00000000-0000-0000-0000-000000000000'
        }
      },
      {
        nome: 'Teste 2 - Com observacoes',
        dados: {
          data: '2025-01-29',
          tipo: 'receita',
          categoria: 'Vendas',
          valor: 100.00,
          descricao: 'Teste com observações',
          observacoes: 'Observação de teste',
          user_id: '00000000-0000-0000-0000-000000000000'
        }
      },
      {
        nome: 'Teste 3 - Com cliente_id',
        dados: {
          data: '2025-01-29',
          tipo: 'receita',
          categoria: 'Vendas',
          valor: 100.00,
          descricao: 'Teste com cliente',
          cliente_id: null,
          user_id: '00000000-0000-0000-0000-000000000000'
        }
      }
    ];
    
    for (const teste of testes) {
      console.log(`\n🧪 ${teste.nome}:`);
      console.log('📝 Dados:', teste.dados);
      
      try {
        const { data, error } = await supabase
          .from('lancamentos')
          .insert([teste.dados])
          .select()
          .single();
        
        if (error) {
          console.error(`❌ Erro:`, error);
          console.error('📋 Detalhes:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        } else {
          console.log(`✅ Sucesso:`, data);
        }
      } catch (err) {
        console.error(`❌ Exceção:`, err);
      }
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Executar verificação
verificarEstrutura();