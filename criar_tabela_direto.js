// Script para criar tabela system_videos via API REST
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function criarTabelaDireto() {
  console.log('🔧 Criando tabela system_videos via API...');
  
  try {
    // 1. Primeiro, vamos tentar inserir dados para ver se a tabela existe
    console.log('📋 Verificando se a tabela existe...');
    
    const { data: videos, error: checkError } = await supabase
      .from('system_videos')
      .select('*')
      .limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('❌ Tabela system_videos não existe');
      console.log('📝 Você precisa criar a tabela manualmente no Supabase');
      console.log('');
      console.log('🔧 PASSO A PASSO:');
      console.log('1. Acesse: https://supabase.com/dashboard');
      console.log('2. Selecione seu projeto');
      console.log('3. Vá em "Table Editor"');
      console.log('4. Clique em "New Table"');
      console.log('5. Configure a tabela:');
      console.log('   - Nome: system_videos');
      console.log('   - Colunas:');
      console.log('     * id (uuid, primary key)');
      console.log('     * title (text, not null)');
      console.log('     * youtube_url (text, not null)');
      console.log('     * description (text)');
      console.log('     * order_position (integer, default 0)');
      console.log('     * status (text, default "active")');
      console.log('     * created_at (timestamp with time zone)');
      console.log('     * updated_at (timestamp with time zone)');
      console.log('6. Clique em "Save"');
      console.log('');
      console.log('📋 Depois execute este script novamente para inserir os dados');
      return;
    }
    
    console.log('✅ Tabela system_videos existe');
    
    // 2. Inserir dados de exemplo
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
    console.log('🔍 Verificando se os dados foram inseridos...');
    
    const { data: videosFinais, error: finalError } = await supabase
      .from('system_videos')
      .select('*')
      .order('order_position', { ascending: true });
    
    if (finalError) {
      console.log('❌ Erro ao verificar dados:', finalError.message);
    } else {
      console.log('✅ Dados inseridos com sucesso!');
      console.log(`📊 Total de vídeos: ${videosFinais.length}`);
      
      if (videosFinais.length > 0) {
        console.log('📹 Vídeos disponíveis:');
        videosFinais.forEach(video => {
          console.log(`  - ${video.title}`);
        });
      }
    }

    console.log('');
    console.log('🎉 Processo concluído!');
    console.log('🌐 Acesse: http://192.168.1.109:8086');
    console.log('📝 Teste as páginas:');
    console.log('   - Lembretes: /lembretes');
    console.log('   - Vídeos: /videos-sistema');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar
criarTabelaDireto(); 