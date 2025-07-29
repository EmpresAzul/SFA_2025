-- =====================================================
-- CORREÇÕES DE SEGURANÇA - FLUXOAZUL SFA 2025
-- Execute este SQL no painel do Supabase (SQL Editor)
-- =====================================================

-- 1. CORRIGIR FUNÇÃO handle_new_user() - Search Path Seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- 2. ADICIONAR POLICY DE RLS PARA LANÇAMENTOS (PERMITE SALVAR)
CREATE POLICY "Users can insert their own lancamentos"
  ON public.lancamentos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own lancamentos"
  ON public.lancamentos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own lancamentos"
  ON public.lancamentos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lancamentos"
  ON public.lancamentos
  FOR DELETE
  USING (auth.uid() = user_id);

-- 3. CRIAR TABELAS DE SEGURANÇA (se não existirem)
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 4. HABILITAR RLS NAS TABELAS DE SEGURANÇA
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES PARA TABELAS DE SEGURANÇA
CREATE POLICY "Admins can view all security events"
  ON public.security_events
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "System can insert security events"
  ON public.security_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all security alerts"
  ON public.security_alerts
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "System can insert security alerts"
  ON public.security_alerts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own active sessions"
  ON public.active_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage active sessions"
  ON public.active_sessions
  FOR ALL
  USING (true);

-- 6. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved ON public.security_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON public.active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_expires_at ON public.active_sessions(expires_at);

-- 7. VERIFICAR SE A TABELA lancamentos TEM RLS HABILITADO
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
SELECT 'Correções de segurança aplicadas com sucesso!' as status;