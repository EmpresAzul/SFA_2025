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

async function testarPrecificacao() {
  console.log('🔍 Testando sistema de precificação...\n');

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

    // Buscar itens existentes
    console.log('📊 Buscando itens de precificação...');
    const { data: items, count, error: fetchError } = await supabase
      .from('precificacao')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (fetchError) {
      console.error('❌ Erro ao buscar:', fetchError);
      return;
    }

    console.log(`✅ Encontrados ${count || 0} itens\n`);
    if (items && items.length > 0) {
      console.log('📋 Primeiros itens:');
      items.slice(0, 3).forEach((item, idx) => {
        console.log(`\n${idx + 1}. ${item.nome}`);
        console.log(`   Tipo: ${item.tipo}`);
        console.log(`   Preço: R$ ${item.preco_venda}`);
      });
    }

    // Testar criação
    console.log('\n\n🚀 Testando criação de item...');
    const testData = {
      user_id: userId,
      nome: 'Produto Teste',
      tipo: 'Produto',
      preco_venda: 100.00,
      custo_materia_prima: 50.00,
      custo_mao_obra: 0,
      despesas_fixas: 0,
      margem_lucro: 30,
      dados_json: {
        categoria: 'Teste',
        custos_materiais: [],
        taxas_adicionais: []
      }
    };

    console.log('📦 Dados:', testData);

    const { data: created, error: createError } = await supabase
      .from('precificacao')
      .insert([testData])
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar:', createError);
      console.error('Detalhes:', {
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
        code: createError.code
      });
    } else {
      console.log('✅ Item criado com sucesso!');
      console.log(JSON.stringify(created, null, 2));
      
      // Deletar o item de teste
      console.log('\n🗑️ Removendo item de teste...');
      await supabase.from('precificacao').delete().eq('id', created.id);
      console.log('✅ Item de teste removido');
    }

    await supabase.auth.signOut();
    console.log('\n✅ Teste concluído!');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarPrecificacao();
