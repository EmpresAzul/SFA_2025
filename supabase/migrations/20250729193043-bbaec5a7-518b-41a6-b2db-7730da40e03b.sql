-- 1. CRIAR TABELA SYSTEM_VIDEOS (faltante)
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

-- Habilitar RLS para system_videos
ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;

-- Política pública para visualizar vídeos ativos
CREATE POLICY "Anyone can view active system videos"
  ON public.system_videos
  FOR SELECT
  USING (status = 'active');

-- 2. ADICIONAR CAMPOS FALTANTES NA TABELA CADASTROS
ALTER TABLE public.cadastros 
ADD COLUMN IF NOT EXISTS pessoa TEXT CHECK (pessoa IN ('fisica', 'juridica')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));

-- Atualizar registros existentes com valores padrão
UPDATE public.cadastros 
SET pessoa = 'fisica', status = 'ativo' 
WHERE pessoa IS NULL OR status IS NULL;

-- 3. ADICIONAR CAMPOS FALTANTES NA TABELA LANCAMENTOS
ALTER TABLE public.lancamentos
ADD COLUMN IF NOT EXISTS recorrente BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS meses_recorrencia INTEGER,
ADD COLUMN IF NOT EXISTS lancamento_pai_id UUID REFERENCES public.lancamentos(id);

-- 4. AJUSTAR TABELA LEMBRETES - renomear data_vencimento para data_lembrete e hora_lembrete
ALTER TABLE public.lembretes 
ADD COLUMN IF NOT EXISTS data_lembrete DATE,
ADD COLUMN IF NOT EXISTS hora_lembrete TIME;

-- Migrar dados existentes
UPDATE public.lembretes 
SET 
  data_lembrete = data_vencimento::date,
  hora_lembrete = data_vencimento::time
WHERE data_lembrete IS NULL AND data_vencimento IS NOT NULL;

-- Tornar data_lembrete obrigatória após migração
ALTER TABLE public.lembretes 
ALTER COLUMN data_lembrete SET NOT NULL;

-- 5. INSERIR DADOS DE EXEMPLO PARA SYSTEM_VIDEOS
INSERT INTO public.system_videos (title, youtube_url, description, order_position, status) VALUES
('Como usar o Dashboard', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Aprenda a navegar pelo dashboard principal do FluxoAzul', 1, 'active'),
('Criando seu primeiro lançamento', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tutorial completo sobre como criar lançamentos financeiros', 2, 'active'),
('Gerenciando cadastros', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Como cadastrar clientes, fornecedores e funcionários', 3, 'active'),
('Relatórios e DRE', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Entenda como gerar relatórios e analisar o DRE', 4, 'active')
ON CONFLICT DO NOTHING;

-- 6. CRIAR ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_system_videos_status ON public.system_videos(status);
CREATE INDEX IF NOT EXISTS idx_system_videos_order ON public.system_videos(order_position);
CREATE INDEX IF NOT EXISTS idx_cadastros_pessoa ON public.cadastros(pessoa);
CREATE INDEX IF NOT EXISTS idx_cadastros_status ON public.cadastros(status);
CREATE INDEX IF NOT EXISTS idx_lancamentos_recorrente ON public.lancamentos(recorrente);
CREATE INDEX IF NOT EXISTS idx_lancamentos_pai ON public.lancamentos(lancamento_pai_id);

-- 7. TRIGGER PARA UPDATED_AT EM SYSTEM_VIDEOS
CREATE TRIGGER update_system_videos_updated_at 
  BEFORE UPDATE ON public.system_videos 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();