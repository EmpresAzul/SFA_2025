// Script para executar tudo automaticamente no Supabase
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

async function executarTudo() {
  console.log('🚀 Executando tudo automaticamente no Supabase...');
  
  try {
    // 1. CRIAR TABELA LEMBRETES
    console.log('📝 Criando tabela lembretes...');
    
    const sqlLembretes = `
      -- Criar tabela lembretes
      CREATE TABLE IF NOT EXISTS public.lembretes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        titulo TEXT NOT NULL,
        descricao TEXT,
        data_lembrete DATE NOT NULL,
        hora_lembrete TIME,
        status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Habilitar RLS
      ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

      -- Criar política RLS
      DROP POLICY IF EXISTS "Users can view own lembretes" ON public.lembretes;
      CREATE POLICY "Users can view own lembretes"
        ON public.lembretes
        FOR ALL
        USING (auth.uid() = user_id);

      -- Inserir dados de exemplo
      INSERT INTO public.lembretes (user_id, titulo, descricao, data_lembrete, hora_lembrete, status) VALUES
      ('00000000-0000-0000-0000-000000000000', 'Reunião com cliente', 'Preparar apresentação para reunião', '2024-01-15', '14:00:00', 'ativo'),
      ('00000000-0000-0000-0000-000000000000', 'Pagamento de contas', 'Vencimento das contas principais', '2024-01-20', '09:00:00', 'ativo'),
      ('00000000-0000-0000-0000-000000000000', 'Backup do sistema', 'Realizar backup semanal', '2024-01-25', '18:00:00', 'ativo')
      ON CONFLICT DO NOTHING;

      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_lembretes_user_id ON public.lembretes(user_id);
      CREATE INDEX IF NOT EXISTS idx_lembretes_data ON public.lembretes(data_lembrete);
      CREATE INDEX IF NOT EXISTS idx_lembretes_status ON public.lembretes(status);
    `;

    // 2. CRIAR TABELA SYSTEM_VIDEOS
    console.log('📹 Criando tabela system_videos...');
    
    const sqlVideos = `
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

    // 3. EXECUTAR VIA API REST
    console.log('🔄 Executando via API REST...');
    
    // Tentar criar lembretes via API
    try {
      const { error: lembretesError } = await supabase
        .from('lembretes')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          titulo: 'Teste',
          descricao: 'Teste',
          data_lembrete: '2024-01-01',
          status: 'ativo'
        });
      
      if (lembretesError && lembretesError.code === '42P01') {
        console.log('❌ Tabela lembretes não existe - criando via SQL...');
        
        // Tentar executar SQL via RPC
        const { error: sqlError } = await supabase.rpc('exec_sql', { 
          sql_query: sqlLembretes 
        });
        
        if (sqlError) {
          console.log('⚠️ Erro ao executar SQL via RPC:', sqlError.message);
          console.log('📝 Você precisa executar manualmente no Supabase SQL Editor');
          console.log('');
          console.log('🔧 PASSO A PASSO:');
          console.log('1. Acesse: https://supabase.com/dashboard');
          console.log('2. Selecione seu projeto');
          console.log('3. Vá em "SQL Editor"');
          console.log('4. Cole o conteúdo dos arquivos:');
          console.log('   - criar_lembretes.sql');
          console.log('   - criar_system_videos.sql');
          console.log('5. Execute cada script');
          return;
        } else {
          console.log('✅ Tabela lembretes criada via SQL!');
        }
      } else {
        console.log('✅ Tabela lembretes já existe');
      }
    } catch (err) {
      console.log('⚠️ Erro ao verificar lembretes:', err.message);
    }

    // Tentar criar system_videos via API
    try {
      const { error: videosError } = await supabase
        .from('system_videos')
        .insert({
          title: 'Teste',
          youtube_url: 'https://www.youtube.com/watch?v=test',
          description: 'Teste',
          order_position: 0,
          status: 'active'
        });
      
      if (videosError && videosError.code === '42P01') {
        console.log('❌ Tabela system_videos não existe - criando via SQL...');
        
        // Tentar executar SQL via RPC
        const { error: sqlError } = await supabase.rpc('exec_sql', { 
          sql_query: sqlVideos 
        });
        
        if (sqlError) {
          console.log('⚠️ Erro ao executar SQL via RPC:', sqlError.message);
          console.log('📝 Execute manualmente no Supabase SQL Editor');
        } else {
          console.log('✅ Tabela system_videos criada via SQL!');
        }
      } else {
        console.log('✅ Tabela system_videos já existe');
      }
    } catch (err) {
      console.log('⚠️ Erro ao verificar system_videos:', err.message);
    }

    // 4. VERIFICAR SE TUDO FUNCIONOU
    console.log('🔍 Verificando se tudo foi criado...');
    
    const { data: lembretes, error: lembretesCheck } = await supabase
      .from('lembretes')
      .select('*')
      .limit(5);
    
    const { data: videos, error: videosCheck } = await supabase
      .from('system_videos')
      .select('*')
      .limit(5);
    
    console.log('📊 Status das tabelas:');
    console.log(`- Lembretes: ${lembretesCheck ? '❌ Erro' : '✅ OK'} (${lembretes?.length || 0} registros)`);
    console.log(`- System Videos: ${videosCheck ? '❌ Erro' : '✅ OK'} (${videos?.length || 0} registros)`);

    if (!lembretesCheck && !videosCheck) {
      console.log('');
      console.log('🎉 TUDO FUNCIONANDO PERFEITAMENTE!');
      console.log('🌐 Acesse: http://192.168.1.109:8086');
      console.log('📝 Teste as páginas:');
      console.log('   - Lembretes: /lembretes');
      console.log('   - Vídeos: /videos-sistema');
    } else {
      console.log('');
      console.log('❌ Ainda há problemas');
      console.log('📝 Execute manualmente no Supabase SQL Editor:');
      console.log('1. criar_lembretes.sql');
      console.log('2. criar_system_videos.sql');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
    console.log('📝 Execute manualmente no Supabase SQL Editor');
  }
}

// Executar
executarTudo(); 