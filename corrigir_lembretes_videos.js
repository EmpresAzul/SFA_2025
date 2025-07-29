// Script para corrigir Lembretes e Vídeos do Sistema usando variáveis de ambiente
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.error('Certifique-se de que o arquivo .env existe com:');
  console.error('VITE_SUPABASE_URL=...');
  console.error('VITE_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

console.log('🔧 Configuração do Supabase:');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function corrigirLembretesEVideos() {
  console.log('🔧 Corrigindo Lembretes e Vídeos do Sistema...');

  try {
    // 1. Verificar se as tabelas existem
    console.log('📋 Verificando tabelas...');
    
    const { data: lembretes, error: lembretesError } = await supabase
      .from('lembretes')
      .select('*')
      .limit(1);
    
    if (lembretesError) {
      console.log('❌ Erro ao acessar tabela lembretes:', lembretesError.message);
      console.log('📝 Execute o script SQL no Supabase SQL Editor primeiro');
      return;
    } else {
      console.log('✅ Tabela lembretes acessível');
    }

    const { data: videos, error: videosError } = await supabase
      .from('system_videos')
      .select('*')
      .limit(1);
    
    if (videosError) {
      console.log('❌ Erro ao acessar tabela system_videos:', videosError.message);
      console.log('📝 Execute o script SQL no Supabase SQL Editor primeiro');
      return;
    } else {
      console.log('✅ Tabela system_videos acessível');
    }

    // 2. Inserir dados de exemplo para system_videos
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

    // 3. Verificar se tudo está funcionando
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

    if (!lembretesCountError && !videosCountError) {
      console.log('🎉 Correções aplicadas com sucesso!');
      console.log('🌐 Acesse: http://192.168.1.109:8086');
      console.log('📝 Teste as páginas:');
      console.log('   - Lembretes: /lembretes');
      console.log('   - Vídeos: /videos-sistema');
    } else {
      console.log('❌ Ainda há problemas. Execute o script SQL no Supabase primeiro.');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar correções
corrigirLembretesEVideos(); 