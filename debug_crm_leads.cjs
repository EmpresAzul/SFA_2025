const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCrmLeads() {
  try {
    console.log('🔍 Verificando dados na tabela cadastros...\n');

    // 1. Verificar todos os cadastros
    const { data: allCadastros, error: allError } = await supabase
      .from('cadastros')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Erro ao buscar cadastros:', allError);
      return;
    }

    console.log(`📊 Total de cadastros encontrados: ${allCadastros?.length || 0}`);
    
    if (allCadastros && allCadastros.length > 0) {
      console.log('\n📋 Primeiros 5 cadastros:');
      allCadastros.slice(0, 5).forEach((cadastro, index) => {
        console.log(`${index + 1}. ID: ${cadastro.id}`);
        console.log(`   Nome: ${cadastro.nome}`);
        console.log(`   Tipo: ${cadastro.tipo}`);
        console.log(`   Status: ${cadastro.status}`);
        console.log(`   Email: ${cadastro.email || 'N/A'}`);
        console.log(`   Telefone: ${cadastro.telefone || 'N/A'}`);
        console.log(`   Created: ${cadastro.created_at}`);
        console.log('   ---');
      });
    }

    // 2. Verificar especificamente leads (tipo = 'lead')
    const { data: leads, error: leadsError } = await supabase
      .from('cadastros')
      .select('*')
      .eq('tipo', 'lead')
      .order('created_at', { ascending: false });

    if (leadsError) {
      console.error('❌ Erro ao buscar leads:', leadsError);
      return;
    }

    console.log(`\n🎯 Leads encontrados (tipo = 'lead'): ${leads?.length || 0}`);
    
    if (leads && leads.length > 0) {
      console.log('\n📋 Leads encontrados:');
      leads.forEach((lead, index) => {
        console.log(`${index + 1}. ID: ${lead.id}`);
        console.log(`   Nome: ${lead.nome}`);
        console.log(`   Status: ${lead.status}`);
        console.log(`   Email: ${lead.email || 'N/A'}`);
        console.log(`   Telefone: ${lead.telefone || 'N/A'}`);
        console.log(`   Observações: ${lead.observacoes || 'N/A'}`);
        console.log('   ---');
      });
    }

    // 3. Verificar cadastros que podem ser leads (clientes com status de pipeline)
    const pipelineStatuses = ['prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechado', 'perdido'];
    
    const { data: possibleLeads, error: possibleError } = await supabase
      .from('cadastros')
      .select('*')
      .in('status', pipelineStatuses)
      .order('created_at', { ascending: false });

    if (possibleError) {
      console.error('❌ Erro ao buscar possíveis leads:', possibleError);
      return;
    }

    console.log(`\n🔍 Cadastros com status de pipeline: ${possibleLeads?.length || 0}`);
    
    if (possibleLeads && possibleLeads.length > 0) {
      console.log('\n📋 Cadastros com status de pipeline:');
      possibleLeads.forEach((cadastro, index) => {
        console.log(`${index + 1}. ID: ${cadastro.id}`);
        console.log(`   Nome: ${cadastro.nome}`);
        console.log(`   Tipo: ${cadastro.tipo}`);
        console.log(`   Status: ${cadastro.status}`);
        console.log(`   Email: ${cadastro.email || 'N/A'}`);
        console.log('   ---');
      });
    }

    // 4. Verificar tipos únicos na tabela
    const { data: tipos, error: tiposError } = await supabase
      .from('cadastros')
      .select('tipo')
      .not('tipo', 'is', null);

    if (!tiposError && tipos) {
      const tiposUnicos = [...new Set(tipos.map(t => t.tipo))];
      console.log(`\n📊 Tipos únicos encontrados: ${tiposUnicos.join(', ')}`);
    }

    // 5. Verificar status únicos na tabela
    const { data: statuses, error: statusError } = await supabase
      .from('cadastros')
      .select('status')
      .not('status', 'is', null);

    if (!statusError && statuses) {
      const statusUnicos = [...new Set(statuses.map(s => s.status))];
      console.log(`📊 Status únicos encontrados: ${statusUnicos.join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugCrmLeads();