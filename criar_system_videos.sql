-- Script para criar tabela system_videos
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR TABELA SYSTEM_VIDEOS
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

-- 2. HABILITAR RLS
ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICA RLS (público)
DROP POLICY IF EXISTS "Anyone can view active system videos" ON public.system_videos;
CREATE POLICY "Anyone can view active system videos"
  ON public.system_videos
  FOR SELECT
  USING (status = 'active');

-- 4. INSERIR DADOS DE EXEMPLO
INSERT INTO public.system_videos (title, youtube_url, description, order_position, status) VALUES
('Como usar o Dashboard', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Aprenda a navegar pelo dashboard principal do FluxoAzul', 1, 'active'),
('Criando seu primeiro lançamento', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tutorial completo sobre como criar lançamentos financeiros', 2, 'active'),
('Gerenciando cadastros', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Como cadastrar clientes, fornecedores e funcionários', 3, 'active'),
('Relatórios e DRE', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Entenda como gerar relatórios e analisar o DRE', 4, 'active')
ON CONFLICT DO NOTHING;

-- 5. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_system_videos_status ON public.system_videos(status);
CREATE INDEX IF NOT EXISTS idx_system_videos_order ON public.system_videos(order_position);

-- 6. CRIAR TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_videos_updated_at 
  BEFORE UPDATE ON public.system_videos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 7. VERIFICAR SE FOI CRIADA
SELECT 
  'system_videos' as tabela,
  COUNT(*) as registros
FROM public.system_videos; 