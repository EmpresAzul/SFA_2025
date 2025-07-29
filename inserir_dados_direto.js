// Script para inserir dados diretamente via API REST
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

async function inserirDadosDireto() {
  console.log('🚀 Inserindo dados diretamente via API REST...');
  
  try {
    // 1. INSERIR LEMBRETES
    console.log('📝 Inserindo lembretes...');
    
    const lembretesExemplo = [
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        titulo: 'Reunião com cliente',
        descricao: 'Preparar apresentação para reunião',
        data_lembrete: '2024-01-15',
        hora_lembrete: '14:00:00',
        status: 'ativo'
      },
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        titulo: 'Pagamento de contas',
        descricao: 'Vencimento das contas principais',
        data_lembrete: '2024-01-20',
        hora_lembrete: '09:00:00',
        status: 'ativo'
      },
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        titulo: 'Backup do sistema',
        descricao: 'Realizar backup semanal',
        data_lembrete: '2024-01-25',
        hora_lembrete: '18:00:00',
        status: 'ativo'
      }
    ];

    for (const lembrete of lembretesExemplo) {
      try {
        const { error } = await supabase
          .from('lembretes')
          .upsert(lembrete, { onConflict: 'titulo' });
        
        if (error) {
          console.log(`⚠️ Erro ao inserir lembrete "${lembrete.titulo}":`, error.message);
        } else {
          console.log(`✅ Lembrete "${lembrete.titulo}" inserido/atualizado`);
        }
      } catch (err) {
        console.log(`⚠️ Lembrete "${lembrete.titulo}" já existe`);
      }
    }

    // 2. INSERIR VÍDEOS
    console.log('📹 Inserindo vídeos...');
    
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

    // 3. VERIFICAR RESULTADOS
    console.log('🔍 Verificando resultados...');
    
    const { data: lembretes, error: lembretesError } = await supabase
      .from('lembretes')
      .select('*')
      .order('data_lembrete', { ascending: true });
    
    const { data: videos, error: videosError } = await supabase
      .from('system_videos')
      .select('*')
      .order('order_position', { ascending: true });
    
    console.log('📊 Resultados:');
    console.log(`- Lembretes: ${lembretesError ? '❌ Erro' : '✅ OK'} (${lembretes?.length || 0} registros)`);
    console.log(`- System Videos: ${videosError ? '❌ Erro' : '✅ OK'} (${videos?.length || 0} registros)`);

    if (lembretes && lembretes.length > 0) {
      console.log('📝 Lembretes disponíveis:');
      lembretes.forEach(lembrete => {
        console.log(`  - ${lembrete.titulo} (${lembrete.data_lembrete})`);
      });
    }

    if (videos && videos.length > 0) {
      console.log('📹 Vídeos disponíveis:');
      videos.forEach(video => {
        console.log(`  - ${video.title}`);
      });
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
inserirDadosDireto(); 