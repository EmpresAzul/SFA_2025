import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function restaurarLancamentos() {
  console.log('🔄 Restaurador de Lançamentos Financeiros\n');

  try {
    // Pedir email e senha
    const email = await question('Digite seu email: ');
    const password = await question('Digite sua senha: ');

    console.log('\n🔐 Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });

    if (authError) {
      console.error('❌ Erro ao fazer login:', authError.message);
      rl.close();
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log(`👤 User ID: ${authData.user.id}\n`);

    const userId = authData.user.id;

    // Verificar lançamentos existentes
    const { data: existing, count: existingCount } = await supabase
      .from('lancamentos')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    console.log(`📊 Lançamentos existentes: ${existingCount || 0}\n`);

    if (existingCount > 0) {
      const resposta = await question('Deseja deletar os lançamentos existentes? (s/n): ');
      if (resposta.toLowerCase() === 's') {
        console.log('🗑️ Deletando lançamentos existentes...');
        const { error: deleteError } = await supabase
          .from('lancamentos')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error('❌ Erro ao deletar:', deleteError.message);
        } else {
          console.log('✅ Lançamentos deletados com sucesso!\n');
        }
      }
    }

    // Criar lançamentos de exemplo
    console.log('📝 Criando lançamentos de exemplo...\n');

    const lancamentos = [
      // Receitas
      {
        user_id: userId,
        data: '2025-11-01',
        tipo: 'receita',
        categoria: 'Receitas Financeiras',
        valor: 1000.00,
        descricao: 'Cobrança de Juros',
        status: 'confirmado',
        observacoes: 'Juros recebidos de aplicação'
      },
      {
        user_id: userId,
        data: '2025-11-05',
        tipo: 'receita',
        categoria: 'Venda de Produtos',
        valor: 250.00,
        descricao: 'Venda de Capa',
        status: 'confirmado',
        observacoes: 'Venda de produtos diversos'
      },
      {
        user_id: userId,
        data: '2025-11-10',
        tipo: 'receita',
        categoria: 'Venda de Produtos',
        valor: 14000.00,
        descricao: 'Venda parcelada de 28 mil reais',
        status: 'confirmado',
        observacoes: 'Primeira parcela'
      },
      {
        user_id: userId,
        data: '2025-11-12',
        tipo: 'receita',
        categoria: 'Venda de Produtos',
        valor: 14000.00,
        descricao: 'Venda parcelada de 28 mil reais',
        status: 'confirmado',
        observacoes: 'Segunda parcela'
      },
      {
        user_id: userId,
        data: '2025-11-15',
        tipo: 'receita',
        categoria: 'Venda de Produtos',
        valor: 250.00,
        descricao: 'Venda de Capa',
        status: 'confirmado',
        observacoes: 'Venda adicional'
      },
      // Despesas
      {
        user_id: userId,
        data: '2025-11-04',
        tipo: 'despesa',
        categoria: 'Custo da Matéria-Prima',
        valor: 17500.00,
        descricao: 'Matéria Prima',
        status: 'confirmado',
        observacoes: 'Compra de matéria prima'
      },
      {
        user_id: userId,
        data: '2025-11-05',
        tipo: 'despesa',
        categoria: 'Custo da Matéria-Prima',
        valor: 17500.00,
        descricao: 'Matéria Prima',
        status: 'confirmado',
        observacoes: 'Compra adicional de matéria prima'
      }
    ];

    console.log(`📦 Inserindo ${lancamentos.length} lançamentos...\n`);

    const { data: inserted, error: insertError } = await supabase
      .from('lancamentos')
      .insert(lancamentos)
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir lançamentos:', insertError.message);
      console.error('Detalhes:', insertError);
    } else {
      console.log(`✅ ${inserted.length} lançamentos criados com sucesso!\n`);
      
      // Mostrar resumo
      const receitas = inserted.filter(l => l.tipo === 'receita');
      const despesas = inserted.filter(l => l.tipo === 'despesa');
      
      const totalReceitas = receitas.reduce((sum, l) => sum + parseFloat(l.valor), 0);
      const totalDespesas = despesas.reduce((sum, l) => sum + parseFloat(l.valor), 0);
      const saldo = totalReceitas - totalDespesas;

      console.log('📊 Resumo:');
      console.log(`   Receitas: ${receitas.length} lançamentos - R$ ${totalReceitas.toFixed(2)}`);
      console.log(`   Despesas: ${despesas.length} lançamentos - R$ ${totalDespesas.toFixed(2)}`);
      console.log(`   Saldo: R$ ${saldo.toFixed(2)}\n`);
    }

    // Fazer logout
    await supabase.auth.signOut();
    console.log('✅ Processo concluído!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    rl.close();
  }
}

restaurarLancamentos();
