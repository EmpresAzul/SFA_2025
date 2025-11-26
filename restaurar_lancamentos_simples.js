import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// IMPORTANTE: Coloque seu email e senha aqui
const EMAIL = 'leandroazul@gmail.com'; // ALTERE AQUI
const PASSWORD = 'sua_senha_aqui'; // ALTERE AQUI

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function restaurar() {
  console.log('🔄 Restaurando Lançamentos Financeiros\n');

  try {
    // Fazer login
    console.log('🔐 Fazendo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD
    });

    if (authError) {
      console.error('❌ Erro ao fazer login:', authError.message);
      console.log('\n⚠️ IMPORTANTE: Edite o arquivo restaurar_lancamentos_simples.js');
      console.log('   e coloque seu email e senha nas linhas 9 e 10');
      process.exit(1);
    }

    console.log('✅ Login realizado!');
    const userId = authData.user.id;
    console.log(`👤 User ID: ${userId}\n`);

    // Verificar lançamentos existentes
    const { count: existingCount } = await supabase
      .from('lancamentos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    console.log(`📊 Lançamentos existentes: ${existingCount || 0}\n`);

    // Criar lançamentos
    console.log('📝 Criando lançamentos de exemplo...\n');

    const lancamentos = [
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

    const { data: inserted, error: insertError } = await supabase
      .from('lancamentos')
      .insert(lancamentos)
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError.message);
      process.exit(1);
    }

    console.log(`✅ ${inserted.length} lançamentos criados!\n`);
    
    // Resumo
    const receitas = inserted.filter(l => l.tipo === 'receita');
    const despesas = inserted.filter(l => l.tipo === 'despesa');
    const totalReceitas = receitas.reduce((sum, l) => sum + parseFloat(l.valor), 0);
    const totalDespesas = despesas.reduce((sum, l) => sum + parseFloat(l.valor), 0);

    console.log('📊 Resumo:');
    console.log(`   ✅ Receitas: ${receitas.length} - R$ ${totalReceitas.toFixed(2)}`);
    console.log(`   ❌ Despesas: ${despesas.length} - R$ ${totalDespesas.toFixed(2)}`);
    console.log(`   💰 Saldo: R$ ${(totalReceitas - totalDespesas).toFixed(2)}\n`);
    
    console.log('🎉 Pronto! Recarregue a página de Lançamentos (F5)');

    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

restaurar();
