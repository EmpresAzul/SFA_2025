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
    // Fazer login primeiro
    const email = 'leandroazul@gmail.com'; // Ajuste conforme necessário
    const password = 'sua_senha'; // Você precisará fornecer a senha

    console.log('🔐 Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Erro ao fazer login:', authError.message);
      console.log('\n⚠️ Por favor, faça login manualmente no navegador e tente criar um lançamento.');
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log('User ID:', authData.user.id);

    // Buscar lançamentos existentes
    console.log('\n📊 Buscando lançamentos existentes...');
    const { data: lancamentos, error: fetchError } = await supabase
      .from('lancamentos')
      .select('*')
      .limit(5);

    if (fetchError) {
      console.error('❌ Erro ao buscar lançamentos:', fetchError);
    } else {
      console.log(`✅ Encontrados ${lancamentos.length} lançamentos`);
      if (lancamentos.length > 0) {
        console.log('\n📋 Estrutura do primeiro lançamento:');
        console.log(JSON.stringify(lancamentos[0], null, 2));
      }
    }

    // Tentar criar um lançamento de teste
    console.log('\n🚀 Criando lançamento de teste...');
    const testData = {
      user_id: authData.user.id,
      data: new Date().toISOString().split('T')[0],
      tipo: 'receita',
      categoria: 'Teste API',
      valor: 150.00,
      descricao: 'Teste de criação via script',
      status: 'confirmado',
      recorrente: false,
      meses_recorrencia: null
    };

    console.log('📦 Dados:', testData);

    const { data: newLancamento, error: insertError } = await supabase
      .from('lancamentos')
      .insert([testData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao criar lançamento:', insertError);
      console.error('Detalhes:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
    } else {
      console.log('✅ Lançamento criado com sucesso!');
      console.log(JSON.stringify(newLancamento, null, 2));
      
      // Deletar o lançamento de teste
      console.log('\n🗑️ Removendo lançamento de teste...');
      await supabase.from('lancamentos').delete().eq('id', newLancamento.id);
      console.log('✅ Lançamento de teste removido');
    }

    // Fazer logout
    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarLancamento();
