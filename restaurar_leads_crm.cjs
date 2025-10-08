const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function restaurarLeadsCrm() {
  try {
    console.log('🔄 Restaurando leads no CRM...\n');

    // Primeiro, vamos verificar se há um usuário autenticado ou usar um user_id padrão
    // Para este exemplo, vamos usar um user_id genérico que pode ser ajustado
    const defaultUserId = '00000000-0000-0000-0000-000000000000';

    // Leads de exemplo para cada etapa do pipeline
    const leadsExemplo = [
      {
        nome: 'João Silva',
        tipo: 'lead',
        pessoa: 'Física',
        status: 'prospeccao',
        ativo: true,
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-1111',
        observacoes: 'Interessado em consultoria empresarial\nValor: R$ 5000',
        user_id: defaultUserId
      },
      {
        nome: 'Maria Santos',
        tipo: 'lead',
        pessoa: 'Física',
        status: 'qualificacao',
        ativo: true,
        email: 'maria.santos@email.com',
        telefone: '(11) 99999-2222',
        observacoes: 'Precisa de sistema de gestão\nValor: R$ 8000',
        user_id: defaultUserId
      },
      {
        nome: 'Empresa ABC Ltda',
        tipo: 'lead',
        pessoa: 'Jurídica',
        status: 'proposta',
        ativo: true,
        email: 'contato@empresaabc.com',
        telefone: '(11) 99999-3333',
        cpf_cnpj: '12.345.678/0001-90',
        observacoes: 'Proposta enviada para automação\nValor: R$ 15000',
        user_id: defaultUserId
      },
      {
        nome: 'Pedro Oliveira',
        tipo: 'lead',
        pessoa: 'Física',
        status: 'negociacao',
        ativo: true,
        email: 'pedro.oliveira@email.com',
        telefone: '(11) 99999-4444',
        observacoes: 'Negociando desconto e prazo\nValor: R$ 12000',
        user_id: defaultUserId
      },
      {
        nome: 'Tech Solutions',
        tipo: 'lead',
        pessoa: 'Jurídica',
        status: 'fechado',
        ativo: true,
        email: 'vendas@techsolutions.com',
        telefone: '(11) 99999-5555',
        cpf_cnpj: '98.765.432/0001-10',
        observacoes: 'Contrato assinado - implementação iniciada\nValor: R$ 25000',
        user_id: defaultUserId
      },
      {
        nome: 'Ana Costa',
        tipo: 'lead',
        pessoa: 'Física',
        status: 'perdido',
        ativo: true,
        email: 'ana.costa@email.com',
        telefone: '(11) 99999-6666',
        observacoes: 'Optou por concorrente - preço\nValor: R$ 7000',
        user_id: defaultUserId
      },
      {
        nome: 'Carlos Mendes',
        tipo: 'lead',
        pessoa: 'Física',
        status: 'prospeccao',
        ativo: true,
        email: 'carlos.mendes@email.com',
        telefone: '(11) 99999-7777',
        observacoes: 'Primeiro contato realizado\nValor: R$ 3000',
        user_id: defaultUserId
      },
      {
        nome: 'Inovação Digital',
        tipo: 'lead',
        pessoa: 'Jurídica',
        status: 'qualificacao',
        ativo: true,
        email: 'comercial@inovacaodigital.com',
        telefone: '(11) 99999-8888',
        cpf_cnpj: '11.222.333/0001-44',
        observacoes: 'Reunião de qualificação agendada\nValor: R$ 18000',
        user_id: defaultUserId
      }
    ];

    console.log(`📝 Inserindo ${leadsExemplo.length} leads de exemplo...`);

    // Inserir leads um por um para melhor controle
    for (let i = 0; i < leadsExemplo.length; i++) {
      const lead = leadsExemplo[i];
      
      console.log(`${i + 1}. Inserindo: ${lead.nome} (${lead.status})`);
      
      const { data, error } = await supabase
        .from('cadastros')
        .insert([lead])
        .select()
        .single();

      if (error) {
        console.error(`❌ Erro ao inserir ${lead.nome}:`, error);
      } else {
        console.log(`✅ ${lead.nome} inserido com sucesso (ID: ${data.id})`);
      }
    }

    // Verificar se os leads foram inseridos
    console.log('\n🔍 Verificando leads inseridos...');
    
    const { data: leadsInseridos, error: verificacaoError } = await supabase
      .from('cadastros')
      .select('*')
      .eq('tipo', 'lead')
      .order('created_at', { ascending: false });

    if (verificacaoError) {
      console.error('❌ Erro ao verificar leads:', verificacaoError);
      return;
    }

    console.log(`\n📊 Total de leads no sistema: ${leadsInseridos?.length || 0}`);
    
    if (leadsInseridos && leadsInseridos.length > 0) {
      console.log('\n📋 Leads por etapa:');
      
      const leadsPorEtapa = leadsInseridos.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});

      Object.entries(leadsPorEtapa).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} leads`);
      });

      const valorTotal = leadsInseridos.reduce((total, lead) => {
        // Extrair valor das observações (formato: "Valor: R$ 5000")
        const match = lead.observacoes?.match(/Valor:\s*R\$\s*([\d.]+)/);
        const valor = match ? parseFloat(match[1]) : 0;
        return total + valor;
      }, 0);

      console.log(`\n💰 Valor total do pipeline: R$ ${valorTotal.toLocaleString('pt-BR')}`);
    }

    console.log('\n✅ Restauração dos leads concluída com sucesso!');
    console.log('🎯 Agora você pode acessar o CRM e ver os leads no pipeline.');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

restaurarLeadsCrm();