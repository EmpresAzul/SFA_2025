-- Limpar políticas existentes e recriar tudo
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

-- Recriar todas as políticas RLS
-- Políticas para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para cadastros
CREATE POLICY "Users can view their own cadastros" ON public.cadastros
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cadastros" ON public.cadastros
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cadastros" ON public.cadastros
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cadastros" ON public.cadastros
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para lancamentos
CREATE POLICY "Users can view their own lancamentos" ON public.lancamentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lancamentos" ON public.lancamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lancamentos" ON public.lancamentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lancamentos" ON public.lancamentos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para lembretes
CREATE POLICY "Users can view their own lembretes" ON public.lembretes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lembretes" ON public.lembretes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lembretes" ON public.lembretes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lembretes" ON public.lembretes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para saldos_bancarios
CREATE POLICY "Users can view their own saldos_bancarios" ON public.saldos_bancarios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saldos_bancarios" ON public.saldos_bancarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saldos_bancarios" ON public.saldos_bancarios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saldos_bancarios" ON public.saldos_bancarios
  FOR DELETE USING (auth.uid() = user_id);

-- Garantir que o usuário existe no auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '2915587e-6648-42fa-b75d-b78ed6d219c6'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'suporte@empresazul.com',
  crypt('jayafcg3', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"nome": "Suporte EmpresaZul"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = now();

-- Garantir que o perfil existe
INSERT INTO public.profiles (user_id, email, nome, empresa)
VALUES (
  '2915587e-6648-42fa-b75d-b78ed6d219c6',
  'suporte@empresazul.com',
  'Suporte EmpresaZul',
  'EmpresaZul'
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  empresa = EXCLUDED.empresa,
  updated_at = now();