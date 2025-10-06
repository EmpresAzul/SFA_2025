-- Adicionar colunas de endereço na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS endereco_rua text,
ADD COLUMN IF NOT EXISTS endereco_numero text,
ADD COLUMN IF NOT EXISTS endereco_complemento text,
ADD COLUMN IF NOT EXISTS endereco_bairro text,
ADD COLUMN IF NOT EXISTS endereco_cidade text,
ADD COLUMN IF NOT EXISTS endereco_estado text,
ADD COLUMN IF NOT EXISTS endereco_cep text,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;