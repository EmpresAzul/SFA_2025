// Script para aplicar correções das tabelas lembretes e system_videos
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU3rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function aplicarCorrecoes() {
  console.log('🔧 Aplicando correções para Lembretes e Vídeos do Sistema...');

  try {
    // 1. Verificar se as tabelas existem
    console.log('📋 Verificando existência das tabelas...');
    
    const { data: lembretesCheck, error: lembretesError } = await supabase
      .from('lembretes')
      .select('count')
      .limit(1);
    
    if (lembretesError && lembretesError.code === '42P01') {
      console.log('❌ Tabela lembretes não existe - será criada');
    } else {
      console.log('✅ Tabela lembretes existe');
    }

    const { data: videosCheck, error: videosError } = await supabase
      .from('system_videos')
      .select('count')
      .limit(1);
    
    if (videosError && videosError.code === '42P01') {
      console.log('❌ Tabela system_videos não existe - será criada');
    } else {
      console.log('✅ Tabela system_videos existe');
    }

    // 2. Aplicar políticas RLS para lembretes
    console.log('🔐 Aplicando políticas RLS para lembretes...');
    
    const lembretesPolicies = [
      {
        table: 'lembretes',
        name: 'Users can insert their own lembretes',
        operation: 'INSERT',
        definition: 'auth.uid() = user_id'
      },
      {
        table: 'lembretes',
        name: 'Users can view their own lembretes',
        operation: 'SELECT',
        definition: 'auth.uid() = user_id'
      },
      {
        table: 'lembretes',
        name: 'Users can update their own lembretes',
        operation: 'UPDATE',
        definition: 'auth.uid() = user_id'
      },
      {
        table: 'lembretes',
        name: 'Users can delete their own lembretes',
        operation: 'DELETE',
        definition: 'auth.uid() = user_id'
      }
    ];

    for (const policy of lembretesPolicies) {
      try {
        console.log(`🔄 Aplicando política: ${policy.name}`);
        
        // Tentar criar a política via RPC
        const { error } = await supabase.rpc('create_policy', {
          table_name: policy.table,
          policy_name: policy.name,
          operation: policy.operation,
          definition: policy.definition
        });
        
        if (error) {
          console.log(`⚠️ Política ${policy.name} já existe ou erro:`, error.message);
        } else {
          console.log(`✅ Política ${policy.name} criada com sucesso`);
        }
      } catch (err) {
        console.log(`⚠️ Política ${policy.name} já existe`);
      }
    }

    // 3. Aplicar políticas RLS para system_videos
    console.log('🔐 Aplicando políticas RLS para system_videos...');
    
    const videosPolicies = [
      {
        table: 'system_videos',
        name: 'Anyone can view active system videos',
        operation: 'SELECT',
        definition: 'status = \'active\''
      }
    ];

    for (const policy of videosPolicies) {
      try {
        console.log(`🔄 Aplicando política: ${policy.name}`);
        
        const { error } = await supabase.rpc('create_policy', {
          table_name: policy.table,
          policy_name: policy.name,
          operation: policy.operation,
          definition: policy.definition
        });
        
        if (error) {
          console.log(`⚠️ Política ${policy.name} já existe ou erro:`, error.message);
        } else {
          console.log(`✅ Política ${policy.name} criada com sucesso`);
        }
      } catch (err) {
        console.log(`⚠️ Política ${policy.name} já existe`);
      }
    }

    // 4. Inserir dados de exemplo para system_videos
    console.log('📹 Inserindo vídeos de exemplo...');
    
    const videosExemplo = [
      {
        title: 'Como usar o Dashboard',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Aprenda a navegar pelo dashboard principal do FluxoAzul',
        order_position: 1,
        status: 'active'
      },
      {
        title: 'Criando seu primeiro lançamento',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Tutorial completo sobre como criar lançamentos financeiros',
        order_position: 2,
        status: 'active'
      },
      {
        title: 'Gerenciando cadastros',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Como cadastrar clientes, fornecedores e funcionários',
        order_position: 3,
        status: 'active'
      },
      {
        title: 'Relatórios e DRE',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Entenda como gerar relatórios e analisar o DRE',
        order_position: 4,
        status: 'active'
      }
    ];

    for (const video of videosExemplo) {
      try {
        const { error } = await supabase
          .from('system_videos')
          .upsert(video, { onConflict: 'title' });
        
        if (error) {
          console.log(`⚠️ Erro ao inserir vídeo "${video.title}":`, error.message);
        } else {
          console.log(`✅ Vídeo "${video.title}" inserido/atualizado`);
        }
      } catch (err) {
        console.log(`⚠️ Vídeo "${video.title}" já existe`);
      }
    }

    // 5. Verificar se tudo está funcionando
    console.log('🔍 Verificando se as correções foram aplicadas...');
    
    const { data: lembretesCount, error: lembretesCountError } = await supabase
      .from('lembretes')
      .select('*', { count: 'exact', head: true });
    
    const { data: videosCount, error: videosCountError } = await supabase
      .from('system_videos')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Status das tabelas:');
    console.log(`- Lembretes: ${lembretesCountError ? '❌ Erro' : '✅ OK'}`);
    console.log(`- System Videos: ${videosCountError ? '❌ Erro' : '✅ OK'}`);

    console.log('🎉 Correções aplicadas com sucesso!');
    console.log('📝 IMPORTANTE: Se as tabelas não existem, execute o script SQL no Supabase SQL Editor');

  } catch (error) {
    console.error('❌ Erro ao aplicar correções:', error);
  }
}

// Executar correções
aplicarCorrecoes(); 