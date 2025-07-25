-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  avatar_url TEXT,
  empresa TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create lancamentos table for financial entries
CREATE TABLE public.lancamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT,
  subcategoria TEXT,
  cliente_id UUID,
  fornecedor_id UUID,
  metodo_pagamento TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- Create policies for lancamentos
CREATE POLICY "Users can view their own lancamentos" 
ON public.lancamentos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lancamentos" 
ON public.lancamentos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lancamentos" 
ON public.lancamentos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lancamentos" 
ON public.lancamentos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create cadastros table for contacts/customers/suppliers
CREATE TABLE public.cadastros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Enable RLS
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

-- Create policies for cadastros
CREATE POLICY "Users can view their own cadastros" 
ON public.cadastros 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cadastros" 
ON public.cadastros 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cadastros" 
ON public.cadastros 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cadastros" 
ON public.cadastros 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create lembretes table for reminders
CREATE TABLE public.lembretes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado')),
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;

-- Create policies for lembretes
CREATE POLICY "Users can view their own lembretes" 
ON public.lembretes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lembretes" 
ON public.lembretes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lembretes" 
ON public.lembretes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lembretes" 
ON public.lembretes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create saldos_bancarios table for bank balances
CREATE TABLE public.saldos_bancarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banco TEXT NOT NULL,
  conta TEXT NOT NULL,
  saldo_atual DECIMAL(15,2) NOT NULL DEFAULT 0,
  saldo_anterior DECIMAL(15,2) DEFAULT 0,
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saldos_bancarios ENABLE ROW LEVEL SECURITY;

-- Create policies for saldos_bancarios
CREATE POLICY "Users can view their own saldos_bancarios" 
ON public.saldos_bancarios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saldos_bancarios" 
ON public.saldos_bancarios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saldos_bancarios" 
ON public.saldos_bancarios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saldos_bancarios" 
ON public.saldos_bancarios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lancamentos_updated_at
  BEFORE UPDATE ON public.lancamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cadastros_updated_at
  BEFORE UPDATE ON public.cadastros
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lembretes_updated_at
  BEFORE UPDATE ON public.lembretes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saldos_bancarios_updated_at
  BEFORE UPDATE ON public.saldos_bancarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints for lancamentos
ALTER TABLE public.lancamentos 
ADD CONSTRAINT fk_lancamentos_cliente 
FOREIGN KEY (cliente_id) REFERENCES public.cadastros(id) ON DELETE SET NULL;

ALTER TABLE public.lancamentos 
ADD CONSTRAINT fk_lancamentos_fornecedor 
FOREIGN KEY (fornecedor_id) REFERENCES public.cadastros(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX idx_lancamentos_tipo ON public.lancamentos(tipo);
CREATE INDEX idx_cadastros_user_id ON public.cadastros(user_id);
CREATE INDEX idx_cadastros_tipo ON public.cadastros(tipo);
CREATE INDEX idx_lembretes_user_id ON public.lembretes(user_id);
CREATE INDEX idx_lembretes_data_vencimento ON public.lembretes(data_vencimento);
CREATE INDEX idx_saldos_bancarios_user_id ON public.saldos_bancarios(user_id);