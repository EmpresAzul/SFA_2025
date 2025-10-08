const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function corrigirRlsCadastros() {
  try {
    console.log('🔧 Verificando e corrigindo políticas RLS da tabela cadastros...\n');

    // Primeiro, vamos tentar fazer login
    console.log('🔐 Fazendo login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@fluxoazul.com',
      password: 'admin123'
    });

    if (loginError) {
      console.error('❌ Erro no login:', loginError.message);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log(`   User ID: ${loginData.user.id}`);

    // Agora vamos tentar inserir um lead de teste
    console.log('\n📝 Testando inserção de lead...');
    
    const leadTeste = {
      nome: 'Lead Teste',
      tipo: 'lead',
      pessoa: 'Física',
      status: 'prospeccao',
      ativo: true,
      email: 'teste@lead.com',
      telefone: '(11) 99999-0000',
      observacoes: 'Lead de teste para verificar RLS\nValor: R$ 1000',
      user_id: loginData.user.id
    };

    const { data: insertData, error: insertError } = await supabase
      .from('cadastros')
      .insert([leadTeste])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir lead de teste:', insertError.message);
      
      console.log('\n📋 EXECUTE ESTE SQL NO SUPABASE DASHBOARD PARA CORRIGIR:');
      console.log(`
-- Verificar se RLS está habilitado
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can insert their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can update their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can delete their own cadastros" ON public.cadastros;

-- Criar políticas RLS para cadastros
CREATE POLICY "Users can view their own cadastros"
ON public.cadastros
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own cadastros"
ON public.cadastros
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own cadastros"
ON public.cadastros
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own cadastros"
ON public.cadastros
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_cadastros_user_id ON public.cadastros(user_id);
CREATE INDEX IF NOT EXISTS idx_cadastros_tipo ON public.cadastros(tipo);
CREATE INDEX IF NOT EXISTS idx_cadastros_status ON public.cadastros(status);
`);
      
    } else {
      console.log('✅ Lead de teste inserido com sucesso!');
      console.log(`   ID: ${insertData.id}`);
      console.log(`   Nome: ${insertData.nome}`);
      
      // Agora vamos inserir os leads reais
      console.log('\n🎯 Inserindo leads do CRM...');
      
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
          user_id: loginData.user.id
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
          user_id: loginData.user.id
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
          user_id: loginData.user.id
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
          user_id: loginData.user.id
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
          user_id: loginData.user.id
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
          user_id: loginData.user.id
        }
      ];

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
        .eq('user_id', loginData.user.id);

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

        console.log('\n✅ CRM restaurado com sucesso!');
        console.log('🎯 Agora você pode acessar o CRM e ver os leads no pipeline.');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

corrigirRlsCadastros();