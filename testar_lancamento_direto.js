import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarLancamento() {
  console.log('🔍 Testando criação de lançamento...\n');

  try {
    // Fazer login
    const email = 'leandroazul@gmail.com';
    const password = 'sua_senha_aqui'; // ALTERE AQUI

    console.log('🔐 Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Erro ao fazer login:', authError.message);
      console.log('\n⚠️ IMPORTANTE: Edite o arquivo e coloque sua senha na linha 18');
      return;
    }

    console.log('✅ Login realizado!');
    const userId = authData.user.id;
    console.log(`👤 User ID: ${userId}\n`);

    // Testar criação de lançamento
    console.log('🚀 Testando criação de lançamento...');
    const lancamentoData = {
      user_id: userId,
      data: new Date().toISOString().split('T')[0],
      data_vencimento: new Date().toISOString().split('T')[0],
      data_recebimento: null,
      tipo: 'despesa',
      categoria: 'Fornecedores',
      valor: 100.50,
      descricao: 'Teste de lançamento',
      status: 'confirmado',
      recorrente: false,
      meses_recorrencia: null,
      cliente_id: null,
      fornecedor_id: null,
      observacoes: 'Teste via script'
    };

    console.log('📦 Dados do lançamento:', lancamentoData);

    const { data: created, error: createError } = await supabase
      .from('lancamentos')
      .insert([lancamentoData])
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar lançamento:', createError);
      console.error('Detalhes:', {
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
        code: createError.code
      });
    } else {
      console.log('✅ Lançamento criado com sucesso!');
      console.log(JSON.stringify(created, null, 2));
      
      // Deletar o lançamento de teste
      console.log('\n🗑️ Removendo lançamento de teste...');
      await supabase.from('lancamentos').delete().eq('id', created.id);
      console.log('✅ Lançamento de teste removido');
    }

    await supabase.auth.signOut();
    console.log('\n✅ Teste concluído!');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarLancamento();
