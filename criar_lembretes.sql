-- Script para criar tabela lembretes
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR TABELA LEMBRETES
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

-- 2. HABILITAR RLS
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICA RLS
DROP POLICY IF EXISTS "Users can view own lembretes" ON public.lembretes;
CREATE POLICY "Users can view own lembretes"
  ON public.lembretes
  FOR ALL
  USING (auth.uid() = user_id);

-- 4. INSERIR DADOS DE EXEMPLO
INSERT INTO public.lembretes (user_id, titulo, descricao, data_lembrete, hora_lembrete, status) VALUES
('00000000-0000-0000-0000-000000000000', 'Reunião com cliente', 'Preparar apresentação para reunião', '2024-01-15', '14:00:00', 'ativo'),
('00000000-0000-0000-0000-000000000000', 'Pagamento de contas', 'Vencimento das contas principais', '2024-01-20', '09:00:00', 'ativo'),
('00000000-0000-0000-0000-000000000000', 'Backup do sistema', 'Realizar backup semanal', '2024-01-25', '18:00:00', 'ativo')
ON CONFLICT DO NOTHING;

-- 5. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_lembretes_user_id ON public.lembretes(user_id);
CREATE INDEX IF NOT EXISTS idx_lembretes_data ON public.lembretes(data_lembrete);
CREATE INDEX IF NOT EXISTS idx_lembretes_status ON public.lembretes(status);

-- 6. CRIAR TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lembretes_updated_at 
  BEFORE UPDATE ON public.lembretes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 7. VERIFICAR SE FOI CRIADA
SELECT 
  'lembretes' as tabela,
  COUNT(*) as registros
FROM public.lembretes; 