-- Corrigir problema de search_path na função
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Recriar todas as políticas RLS para restringir apenas usuários autenticados
-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can create their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can update their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can delete their own cadastros" ON public.cadastros;

DROP POLICY IF EXISTS "Users can view their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can create their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can update their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can delete their own lancamentos" ON public.lancamentos;

DROP POLICY IF EXISTS "Users can view their own lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Users can create their own lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Users can update their own lembretes" ON public.lembretes;
DROP POLICY IF EXISTS "Users can delete their own lembretes" ON public.lembretes;

DROP POLICY IF EXISTS "Users can view their own saldos_bancarios" ON public.saldos_bancarios;
DROP POLICY IF EXISTS "Users can create their own saldos_bancarios" ON public.saldos_bancarios;
DROP POLICY IF EXISTS "Users can update their own saldos_bancarios" ON public.saldos_bancarios;
DROP POLICY IF EXISTS "Users can delete their own saldos_bancarios" ON public.saldos_bancarios;

-- Criar políticas restritivas apenas para usuários autenticados
-- Políticas para profiles
CREATE POLICY "Authenticated users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Políticas para cadastros
CREATE POLICY "Authenticated users can view their own cadastros" ON public.cadastros
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own cadastros" ON public.cadastros
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own cadastros" ON public.cadastros
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own cadastros" ON public.cadastros
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Políticas para lancamentos
CREATE POLICY "Authenticated users can view their own lancamentos" ON public.lancamentos
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own lancamentos" ON public.lancamentos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own lancamentos" ON public.lancamentos
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own lancamentos" ON public.lancamentos
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Políticas para lembretes
CREATE POLICY "Authenticated users can view their own lembretes" ON public.lembretes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own lembretes" ON public.lembretes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own lembretes" ON public.lembretes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own lembretes" ON public.lembretes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Políticas para saldos_bancarios
CREATE POLICY "Authenticated users can view their own saldos_bancarios" ON public.saldos_bancarios
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own saldos_bancarios" ON public.saldos_bancarios
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own saldos_bancarios" ON public.saldos_bancarios
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own saldos_bancarios" ON public.saldos_bancarios
  FOR DELETE TO authenticated USING (auth.uid() = user_id);