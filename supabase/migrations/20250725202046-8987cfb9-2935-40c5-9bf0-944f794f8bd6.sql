-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela de perfis dos usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  nome TEXT,
  email TEXT,
  empresa TEXT,
  telefone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at na tabela profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de cadastros (clientes, fornecedores, funcionários)
CREATE TABLE IF NOT EXISTS public.cadastros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('cliente', 'fornecedor', 'funcionario')),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf_cnpj TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela cadastros
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para cadastros
CREATE POLICY "Users can view their own cadastros" ON public.cadastros
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cadastros" ON public.cadastros
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cadastros" ON public.cadastros
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cadastros" ON public.cadastros
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at na tabela cadastros
CREATE TRIGGER update_cadastros_updated_at
  BEFORE UPDATE ON public.cadastros
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de lançamentos financeiros
CREATE TABLE IF NOT EXISTS public.lancamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT,
  subcategoria TEXT,
  metodo_pagamento TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  cliente_id UUID,
  fornecedor_id UUID,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela lancamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lancamentos
CREATE POLICY "Users can view their own lancamentos" ON public.lancamentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lancamentos" ON public.lancamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lancamentos" ON public.lancamentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lancamentos" ON public.lancamentos
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at na tabela lancamentos
CREATE TRIGGER update_lancamentos_updated_at
  BEFORE UPDATE ON public.lancamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de lembretes
CREATE TABLE IF NOT EXISTS public.lembretes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado')),
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela lembretes
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lembretes
CREATE POLICY "Users can view their own lembretes" ON public.lembretes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lembretes" ON public.lembretes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lembretes" ON public.lembretes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lembretes" ON public.lembretes
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at na tabela lembretes
CREATE TRIGGER update_lembretes_updated_at
  BEFORE UPDATE ON public.lembretes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de saldos bancários
CREATE TABLE IF NOT EXISTS public.saldos_bancarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  banco TEXT NOT NULL,
  conta TEXT NOT NULL,
  saldo_atual NUMERIC NOT NULL DEFAULT 0,
  saldo_anterior NUMERIC DEFAULT 0,
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela saldos_bancarios
ALTER TABLE public.saldos_bancarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para saldos_bancarios
CREATE POLICY "Users can view their own saldos_bancarios" ON public.saldos_bancarios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saldos_bancarios" ON public.saldos_bancarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saldos_bancarios" ON public.saldos_bancarios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saldos_bancarios" ON public.saldos_bancarios
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at na tabela saldos_bancarios
CREATE TRIGGER update_saldos_bancarios_updated_at
  BEFORE UPDATE ON public.saldos_bancarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário se cadastra
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir o usuário de teste
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

-- Inserir perfil para o usuário de teste
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cadastros_user_id ON public.cadastros(user_id);
CREATE INDEX IF NOT EXISTS idx_cadastros_tipo ON public.cadastros(tipo);
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON public.lancamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_lembretes_user_id ON public.lembretes(user_id);
CREATE INDEX IF NOT EXISTS idx_lembretes_data_vencimento ON public.lembretes(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_saldos_bancarios_user_id ON public.saldos_bancarios(user_id);