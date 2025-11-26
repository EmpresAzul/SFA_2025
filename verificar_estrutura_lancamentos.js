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

async function verificarEstrutura() {
  console.log('🔍 Verificando estrutura da tabela lancamentos...\n');

  try {
    // Tentar buscar um lançamento para ver a estrutura
    const { data, error } = await supabase
      .from('lancamentos')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao buscar lançamentos:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Estrutura da tabela lancamentos:');
      console.log(JSON.stringify(data[0], null, 2));
      console.log('\n📋 Campos disponíveis:');
      Object.keys(data[0]).forEach(key => {
        console.log(`  - ${key}: ${typeof data[0][key]}`);
      });
    } else {
      console.log('⚠️ Nenhum lançamento encontrado na tabela');
      console.log('Tentando inserir um lançamento de teste...\n');
      
      // Buscar user_id
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ Erro ao obter usuário:', authError);
        return;
      }

      const testData = {
        user_id: user.id,
        data: new Date().toISOString().split('T')[0],
        tipo: 'receita',
        categoria: 'Teste',
        valor: 100.00,
        descricao: 'Teste de estrutura',
        status: 'confirmado'
      };

      console.log('📦 Dados de teste:', testData);

      const { data: insertData, error: insertError } = await supabase
        .from('lancamentos')
        .insert([testData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao inserir lançamento de teste:', insertError);
        console.error('Detalhes:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
      } else {
        console.log('✅ Lançamento de teste inserido com sucesso!');
        console.log(JSON.stringify(insertData, null, 2));
        
        // Deletar o lançamento de teste
        await supabase.from('lancamentos').delete().eq('id', insertData.id);
        console.log('🗑️ Lançamento de teste removido');
      }
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarEstrutura();
