-- Script para criar tabelas faltantes
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR TABELA LEMBRETES
CREATE TABLE IF NOT EXISTS public.lembretes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_lembrete DATE NOT NULL,
  hora_lembrete TIME,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR TABELA SYSTEM_VIDEOS
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

-- 3. HABILITAR RLS NAS TABELAS
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS RLS PARA LEMBRETES
DROP POLICY IF EXISTS "Users can insert their own lembretes" ON public.lembretes;
CREATE POLICY "Users can insert their own lembretes"
  ON public.lembretes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own lembretes" ON public.lembretes;
CREATE POLICY "Users can view their own lembretes"
  ON public.lembretes
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own lembretes" ON public.lembretes;
CREATE POLICY "Users can update their own lembretes"
  ON public.lembretes
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own lembretes" ON public.lembretes;
CREATE POLICY "Users can delete their own lembretes"
  ON public.lembretes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. CRIAR POLÍTICAS RLS PARA SYSTEM_VIDEOS (público)
DROP POLICY IF EXISTS "Anyone can view active system videos" ON public.system_videos;
CREATE POLICY "Anyone can view active system videos"
  ON public.system_videos
  FOR SELECT
  USING (status = 'active');

-- 6. INSERIR DADOS DE EXEMPLO PARA SYSTEM_VIDEOS
INSERT INTO public.system_videos (title, youtube_url, description, order_position, status) VALUES
('Como usar o Dashboard', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Aprenda a navegar pelo dashboard principal do FluxoAzul', 1, 'active'),
('Criando seu primeiro lançamento', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tutorial completo sobre como criar lançamentos financeiros', 2, 'active'),
('Gerenciando cadastros', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Como cadastrar clientes, fornecedores e funcionários', 3, 'active'),
('Relatórios e DRE', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Entenda como gerar relatórios e analisar o DRE', 4, 'active')
ON CONFLICT DO NOTHING;

-- 7. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_lembretes_user_id ON public.lembretes(user_id);
CREATE INDEX IF NOT EXISTS idx_lembretes_data_lembrete ON public.lembretes(data_lembrete);
CREATE INDEX IF NOT EXISTS idx_lembretes_status ON public.lembretes(status);
CREATE INDEX IF NOT EXISTS idx_system_videos_status ON public.system_videos(status);
CREATE INDEX IF NOT EXISTS idx_system_videos_order ON public.system_videos(order_position);

-- 8. CRIAR TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lembretes_updated_at BEFORE UPDATE ON public.lembretes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_videos_updated_at BEFORE UPDATE ON public.system_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. VERIFICAR SE AS TABELAS FORAM CRIADAS
SELECT 
  'lembretes' as tabela,
  COUNT(*) as registros
FROM public.lembretes
UNION ALL
SELECT 
  'system_videos' as tabela,
  COUNT(*) as registros
FROM public.system_videos; 