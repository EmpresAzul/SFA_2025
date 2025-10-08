const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarUsuarios() {
  try {
    console.log('🔍 Verificando usuários no sistema...\n');

    // Tentar fazer login com credenciais de teste
    const testCredentials = [
      { email: 'admin@fluxoazul.com', password: 'admin123' },
      { email: 'teste@teste.com', password: '123456' },
      { email: 'user@example.com', password: 'password' }
    ];

    let authenticatedUser = null;

    for (const cred of testCredentials) {
      console.log(`🔐 Tentando login com: ${cred.email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });

      if (!error && data.user) {
        console.log(`✅ Login bem-sucedido!`);
        console.log(`   User ID: ${data.user.id}`);
        console.log(`   Email: ${data.user.email}`);
        authenticatedUser = data.user;
        break;
      } else {
        console.log(`❌ Falha no login: ${error?.message || 'Credenciais inválidas'}`);
      }
    }

    if (!authenticatedUser) {
      console.log('\n🆕 Criando usuário de teste...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@fluxoazul.com',
        password: 'admin123'
      });

      if (signUpError) {
        console.error('❌ Erro ao criar usuário:', signUpError);
        return null;
      }

      if (signUpData.user) {
        console.log('✅ Usuário criado com sucesso!');
        console.log(`   User ID: ${signUpData.user.id}`);
        authenticatedUser = signUpData.user;
      }
    }

    return authenticatedUser;

  } catch (error) {
    console.error('❌ Erro geral:', error);
    return null;
  }
}

async function inserirLeadsComUsuario() {
  const user = await verificarUsuarios();
  
  if (!user) {
    console.error('❌ Não foi possível autenticar usuário');
    return;
  }

  console.log(`\n🎯 Inserindo leads para o usuário: ${user.email}`);

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
      user_id: user.id
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
      user_id: user.id
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
      user_id: user.id
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
      user_id: user.id
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
      user_id: user.id
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
      user_id: user.id
    }
  ];

  console.log(`📝 Inserindo ${leadsExemplo.length} leads...`);

  let sucessos = 0;
  let erros = 0;

  for (const lead of leadsExemplo) {
    console.log(`📋 Inserindo: ${lead.nome} (${lead.status})`);
    
    const { data, error } = await supabase
      .from('cadastros')
      .insert([lead])
      .select()
      .single();

    if (error) {
      console.error(`❌ Erro ao inserir ${lead.nome}:`, error.message);
      erros++;
    } else {
      console.log(`✅ ${lead.nome} inserido com sucesso`);
      sucessos++;
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ Sucessos: ${sucessos}`);
  console.log(`   ❌ Erros: ${erros}`);

  // Verificar leads inseridos
  const { data: leadsVerificacao, error: errorVerificacao } = await supabase
    .from('cadastros')
    .select('*')
    .eq('tipo', 'lead')
    .eq('user_id', user.id);

  if (!errorVerificacao && leadsVerificacao) {
    console.log(`\n🎯 Total de leads no sistema: ${leadsVerificacao.length}`);
    
    const leadsPorStatus = leadsVerificacao.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📋 Leads por etapa:');
    Object.entries(leadsPorStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} leads`);
    });
  }
}

inserirLeadsComUsuario();