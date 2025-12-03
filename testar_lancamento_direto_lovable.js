import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarLancamento() {
  console.log('🧪 Testando criação de lançamento no Lovable Cloud...\n');

  try {
    // 1. Verificar autenticação
    console.log('1️⃣ Verificando sessão...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('⚠️ Nenhuma sessão ativa. Você precisa estar logado no app.');
      console.log('💡 Faça login no app primeiro, depois rode este script.\n');
      return;
    }

    console.log('✅ Sessão ativa:', session.user.email);
    console.log('👤 User ID:', session.user.id, '\n');

    // 2. Verificar estrutura da tabela
    console.log('2️⃣ Verificando estrutura da tabela lancamentos...');
    const { data: lancamentos, error: selectError } = await supabase
      .from('lancamentos')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Erro ao acessar tabela:', selectError.message);
      return;
    }

    console.log('✅ Tabela acessível\n');

    // 3. Tentar inserir um lançamento de teste
    console.log('3️⃣ Tentando inserir lançamento de teste...');
    
    const lancamentoTeste = {
      data: new Date().toISOString().split('T')[0],
      tipo: 'receita',
      categoria: 'Vendas',
      valor: 1000.00,
      descricao: 'Teste de lançamento via script',
      observacoes: 'Teste automático',
      user_id: session.user.id,
      status: 'confirmado',
      recorrente: false,
    };

    console.log('📦 Dados do lançamento:', lancamentoTeste);

    const { data, error } = await supabase
      .from('lancamentos')
      .insert([lancamentoTeste])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao inserir:', error.message);
      console.error('📋 Detalhes:', error);
      
      if (error.message.includes('column')) {
        console.log('\n💡 PROBLEMA: Coluna não existe na tabela!');
        console.log('🔧 SOLUÇÃO: A migration precisa ser aplicada no Lovable Cloud.');
        console.log('📝 AÇÃO: Acesse o Lovable Dashboard e aplique a migration.');
      } else if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('\n💡 PROBLEMA: Política RLS bloqueando inserção!');
        console.log('🔧 SOLUÇÃO: Verificar políticas RLS no Supabase.');
      }
      
      return;
    }

    console.log('✅ Lançamento criado com sucesso!');
    console.log('📄 Dados:', data);
    console.log('\n🎉 TESTE PASSOU! O sistema está funcionando!\n');

    // 4. Limpar teste
    console.log('4️⃣ Limpando lançamento de teste...');
    const { error: deleteError } = await supabase
      .from('lancamentos')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.log('⚠️ Não foi possível deletar o teste:', deleteError.message);
      console.log('💡 Delete manualmente o lançamento ID:', data.id);
    } else {
      console.log('✅ Lançamento de teste removido\n');
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testarLancamento();
