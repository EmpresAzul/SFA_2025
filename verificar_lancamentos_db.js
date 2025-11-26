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

async function verificarLancamentos() {
  console.log('🔍 Verificando lançamentos no banco de dados...\n');

  try {
    // Buscar todos os lançamentos (sem filtro de usuário para ver se existem)
    console.log('1️⃣ Buscando TODOS os lançamentos (sem filtro)...');
    const { data: allData, error: allError, count: allCount } = await supabase
      .from('lancamentos')
      .select('*', { count: 'exact' });

    if (allError) {
      console.error('❌ Erro ao buscar todos os lançamentos:', allError);
    } else {
      console.log(`✅ Total de lançamentos no banco: ${allCount || 0}`);
      if (allData && allData.length > 0) {
        console.log('\n📋 Primeiros 3 lançamentos:');
        allData.slice(0, 3).forEach((lanc, idx) => {
          console.log(`\n${idx + 1}. ID: ${lanc.id}`);
          console.log(`   User ID: ${lanc.user_id}`);
          console.log(`   Data: ${lanc.data}`);
          console.log(`   Tipo: ${lanc.tipo}`);
          console.log(`   Categoria: ${lanc.categoria}`);
          console.log(`   Valor: R$ ${lanc.valor}`);
          console.log(`   Status: ${lanc.status}`);
          console.log(`   Descrição: ${lanc.descricao || 'N/A'}`);
        });
      }
    }

    // Buscar usuários únicos
    console.log('\n\n2️⃣ Verificando usuários com lançamentos...');
    const { data: users } = await supabase
      .from('lancamentos')
      .select('user_id')
      .limit(100);

    if (users) {
      const uniqueUsers = [...new Set(users.map(u => u.user_id))];
      console.log(`✅ Usuários com lançamentos: ${uniqueUsers.length}`);
      uniqueUsers.forEach((userId, idx) => {
        console.log(`   ${idx + 1}. ${userId}`);
      });
    }

    // Verificar estrutura da tabela
    console.log('\n\n3️⃣ Verificando estrutura da tabela...');
    if (allData && allData.length > 0) {
      console.log('📋 Campos disponíveis:');
      Object.keys(allData[0]).forEach(key => {
        const value = allData[0][key];
        const type = value === null ? 'null' : typeof value;
        console.log(`   - ${key}: ${type}`);
      });
    }

    // Verificar se há problemas com RLS
    console.log('\n\n4️⃣ Testando acesso com autenticação...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (session) {
      console.log('✅ Sessão ativa encontrada');
      console.log(`   User ID: ${session.user.id}`);
      
      const { data: userLanc, error: userError, count: userCount } = await supabase
        .from('lancamentos')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      if (userError) {
        console.error('❌ Erro ao buscar lançamentos do usuário:', userError);
      } else {
        console.log(`✅ Lançamentos do usuário autenticado: ${userCount || 0}`);
      }
    } else {
      console.log('⚠️ Nenhuma sessão ativa - faça login no navegador primeiro');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarLancamentos();
