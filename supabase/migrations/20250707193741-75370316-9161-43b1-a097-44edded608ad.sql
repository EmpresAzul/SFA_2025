-- Criar tabela para vídeos do sistema
CREATE TABLE public.system_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT,
  order_position INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos os usuários autenticados vejam os vídeos
CREATE POLICY "Authenticated users can view system videos" 
ON public.system_videos 
FOR SELECT 
TO authenticated
USING (status = 'active');

-- Apenas administradores podem gerenciar os vídeos (será implementado posteriormente)
-- Por enquanto, sem políticas de INSERT/UPDATE/DELETE para usuários comuns

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_system_videos_updated_at
BEFORE UPDATE ON public.system_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns vídeos de exemplo
INSERT INTO public.system_videos (title, youtube_url, description, order_position) VALUES
('Introdução ao Sistema FluxoAzul', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Aprenda os conceitos básicos do sistema', 1),
('Como fazer lançamentos financeiros', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tutorial completo sobre lançamentos', 2),
('Gerenciamento de estoque', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Como controlar seu estoque eficientemente', 3),
('Relatório DRE explicado', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Entenda seu Demonstrativo de Resultado', 4);