// Script para executar SQL diretamente no Supabase
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

async function executarSQL() {
  console.log('🔧 Executando SQL no Supabase...');
  
  try {
    // SQL para criar a tabela system_videos
    const sql = `
      -- Criar tabela system_videos
      CREATE TABLE IF NOT EXISTS public.system_videos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        youtube_url TEXT NOT NULL,
        description TEXT,
        order_position INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Habilitar RLS
      ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;

      -- Criar política RLS
      DROP POLICY IF EXISTS "Anyone can view active system videos" ON public.system_videos;
      CREATE POLICY "Anyone can view active system videos"
        ON public.system_videos
        FOR SELECT
        USING (status = 'active');

      -- Inserir dados de exemplo
      INSERT INTO public.system_videos (title, youtube_url, description, order_position, status) VALUES
      ('Como usar o Dashboard', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Aprenda a navegar pelo dashboard principal do FluxoAzul', 1, 'active'),
      ('Criando seu primeiro lançamento', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tutorial completo sobre como criar lançamentos financeiros', 2, 'active'),
      ('Gerenciando cadastros', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Como cadastrar clientes, fornecedores e funcionários', 3, 'active'),
      ('Relatórios e DRE', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Entenda como gerar relatórios e analisar o DRE', 4, 'active')
      ON CONFLICT DO NOTHING;

      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_system_videos_status ON public.system_videos(status);
      CREATE INDEX IF NOT EXISTS idx_system_videos_order ON public.system_videos(order_position);
    `;

    console.log('📝 Executando SQL...');
    
    // Tentar executar via RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.log('⚠️ Erro ao executar via RPC, tentando método alternativo...');
      
      // Método alternativo: criar tabela via API
      console.log('🔄 Criando tabela via API...');
      
      // Primeiro, vamos tentar inserir um vídeo para ver se a tabela existe
      const { error: insertError } = await supabase
        .from('system_videos')
        .insert({
          title: 'Teste',
          youtube_url: 'https://www.youtube.com/watch?v=test',
          description: 'Teste',
          order_position: 0,
          status: 'active'
        });
      
      if (insertError && insertError.code === '42P01') {
        console.log('❌ Tabela system_videos não existe');
        console.log('📝 Você precisa executar o SQL manualmente no Supabase Dashboard');
        console.log('📋 Vá em: https://supabase.com/dashboard');
        console.log('🔍 Selecione seu projeto');
        console.log('📝 Vá em SQL Editor');
        console.log('📋 Cole o conteúdo do arquivo criar_system_videos.sql');
        console.log('▶️ Execute o script');
        return;
      }
      
      console.log('✅ Tabela system_videos já existe');
    } else {
      console.log('✅ SQL executado com sucesso!');
    }

    // Verificar se funcionou
    console.log('🔍 Verificando se a tabela foi criada...');
    
    const { data: videos, error: checkError } = await supabase
      .from('system_videos')
      .select('*')
      .limit(5);
    
    if (checkError) {
      console.log('❌ Erro ao verificar tabela:', checkError.message);
      console.log('📝 Execute manualmente no Supabase SQL Editor');
    } else {
      console.log('✅ Tabela system_videos criada com sucesso!');
      console.log(`📊 Encontrados ${videos.length} vídeos`);
      
      if (videos.length > 0) {
        console.log('📹 Vídeos disponíveis:');
        videos.forEach(video => {
          console.log(`  - ${video.title}`);
        });
      }
    }

    console.log('🎉 Processo concluído!');
    console.log('🌐 Acesse: http://192.168.1.109:8086');
    console.log('📝 Teste as páginas:');
    console.log('   - Lembretes: /lembretes');
    console.log('   - Vídeos: /videos-sistema');

  } catch (error) {
    console.error('❌ Erro geral:', error);
    console.log('📝 Execute manualmente no Supabase SQL Editor');
  }
}

// Executar
executarSQL(); 