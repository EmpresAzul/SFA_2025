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

async function testarUpdatePrecificacao() {
  console.log('🔍 Testando UPDATE de precificação...\n');

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

    // Buscar primeiro item
    console.log('📊 Buscando primeiro item...');
    const { data: items, error: fetchError } = await supabase
      .from('precificacao')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (fetchError) {
      console.error('❌ Erro ao buscar:', fetchError);
      return;
    }

    if (!items || items.length === 0) {
      console.log('⚠️ Nenhum item encontrado para testar');
      return;
    }

    const item = items[0];
    console.log('✅ Item encontrado:', {
      id: item.id,
      nome: item.nome,
      tipo: item.tipo,
      preco_venda: item.preco_venda
    });

    // Testar UPDATE
    console.log('\n🚀 Testando UPDATE...');
    const dadosUpdate = {
      nome: item.nome + ' (TESTE)',
      preco_venda: item.preco_venda + 10,
      margem_lucro: item.margem_lucro || 30
    };

    console.log('📦 Dados para update:', dadosUpdate);

    const { data: updated, error: updateError } = await supabase
      .from('precificacao')
      .update(dadosUpdate)
      .eq('id', item.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ ERRO ao atualizar:', updateError);
      console.error('Detalhes:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
    } else {
      console.log('✅ Item atualizado com sucesso!');
      console.log(JSON.stringify(updated, null, 2));
      
      // Reverter o update
      console.log('\n🔄 Revertendo alteração...');
      await supabase
        .from('precificacao')
        .update({
          nome: item.nome,
          preco_venda: item.preco_venda
        })
        .eq('id', item.id);
      console.log('✅ Alteração revertida');
    }

    await supabase.auth.signOut();
    console.log('\n✅ Teste concluído!');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarUpdatePrecificacao();
