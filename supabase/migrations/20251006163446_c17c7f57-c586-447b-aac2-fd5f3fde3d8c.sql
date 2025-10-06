-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  empresa TEXT,
  email TEXT,
  telefone TEXT,
  cargo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create cadastros table (contacts/registrations)
CREATE TABLE public.cadastros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  pessoa TEXT DEFAULT 'Física',
  status TEXT DEFAULT 'ativo',
  ativo BOOLEAN DEFAULT true,
  cpf_cnpj TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  numero TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  observacoes TEXT,
  data_nascimento TEXT,
  cargo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cadastros"
  ON public.cadastros FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cadastros"
  ON public.cadastros FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cadastros"
  ON public.cadastros FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cadastros"
  ON public.cadastros FOR DELETE
  USING (auth.uid() = user_id);

-- Create lancamentos table (financial transactions)
CREATE TABLE public.lancamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  descricao TEXT NOT NULL,
  cliente_id TEXT,
  fornecedor_id TEXT,
  observacoes TEXT,
  status TEXT DEFAULT 'pendente',
  recorrente BOOLEAN DEFAULT false,
  meses_recorrencia INTEGER DEFAULT 1,
  lancamento_pai_id UUID REFERENCES public.lancamentos(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lancamentos"
  ON public.lancamentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own lancamentos"
  ON public.lancamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lancamentos"
  ON public.lancamentos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lancamentos"
  ON public.lancamentos FOR DELETE
  USING (auth.uid() = user_id);

-- Create estoques table (inventory)
CREATE TABLE public.estoques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_produto TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0,
  quantidade_bruta NUMERIC NOT NULL DEFAULT 0,
  quantidade_liquida NUMERIC NOT NULL DEFAULT 0,
  unidade_medida TEXT NOT NULL DEFAULT 'un',
  valor_unitario NUMERIC NOT NULL DEFAULT 0,
  valor_total NUMERIC NOT NULL DEFAULT 0,
  data TEXT NOT NULL,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.estoques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own estoques"
  ON public.estoques FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own estoques"
  ON public.estoques FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own estoques"
  ON public.estoques FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own estoques"
  ON public.estoques FOR DELETE
  USING (auth.uid() = user_id);

-- Create precificacao table (pricing)
CREATE TABLE public.precificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  preco_venda NUMERIC NOT NULL DEFAULT 0,
  custo_materia_prima NUMERIC DEFAULT 0,
  custo_mao_obra NUMERIC DEFAULT 0,
  despesas_fixas NUMERIC DEFAULT 0,
  margem_lucro NUMERIC DEFAULT 0,
  dados_json JSONB,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.precificacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own precificacao"
  ON public.precificacao FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own precificacao"
  ON public.precificacao FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own precificacao"
  ON public.precificacao FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own precificacao"
  ON public.precificacao FOR DELETE
  USING (auth.uid() = user_id);

-- Create saldos_bancarios table (bank balances)
CREATE TABLE public.saldos_bancarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banco TEXT NOT NULL,
  saldo NUMERIC NOT NULL DEFAULT 0,
  valor NUMERIC NOT NULL DEFAULT 0,
  data TEXT NOT NULL,
  tipo TEXT DEFAULT 'corrente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.saldos_bancarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saldos_bancarios"
  ON public.saldos_bancarios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saldos_bancarios"
  ON public.saldos_bancarios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saldos_bancarios"
  ON public.saldos_bancarios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saldos_bancarios"
  ON public.saldos_bancarios FOR DELETE
  USING (auth.uid() = user_id);

-- Create lembretes table (reminders)
CREATE TABLE public.lembretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_vencimento TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  prioridade TEXT DEFAULT 'media',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lembretes"
  ON public.lembretes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own lembretes"
  ON public.lembretes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lembretes"
  ON public.lembretes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lembretes"
  ON public.lembretes FOR DELETE
  USING (auth.uid() = user_id);

-- Create ponto_equilibrio table (break-even point)
CREATE TABLE public.ponto_equilibrio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  gastos_fixos NUMERIC NOT NULL DEFAULT 0,
  custos_variaveis NUMERIC NOT NULL DEFAULT 0,
  faturamento_estimado NUMERIC NOT NULL DEFAULT 0,
  dados_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ponto_equilibrio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ponto_equilibrio"
  ON public.ponto_equilibrio FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ponto_equilibrio"
  ON public.ponto_equilibrio FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ponto_equilibrio"
  ON public.ponto_equilibrio FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ponto_equilibrio"
  ON public.ponto_equilibrio FOR DELETE
  USING (auth.uid() = user_id);

-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view system_settings"
  ON public.system_settings FOR SELECT
  TO authenticated
  USING (true);

-- Create system_videos table
CREATE TABLE public.system_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  status TEXT DEFAULT 'ativo',
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.system_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view system_videos"
  ON public.system_videos FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cadastros_updated_at BEFORE UPDATE ON public.cadastros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lancamentos_updated_at BEFORE UPDATE ON public.lancamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estoques_updated_at BEFORE UPDATE ON public.estoques
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_precificacao_updated_at BEFORE UPDATE ON public.precificacao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saldos_bancarios_updated_at BEFORE UPDATE ON public.saldos_bancarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lembretes_updated_at BEFORE UPDATE ON public.lembretes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ponto_equilibrio_updated_at BEFORE UPDATE ON public.ponto_equilibrio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_videos_updated_at BEFORE UPDATE ON public.system_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();