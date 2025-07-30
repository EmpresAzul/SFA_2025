-- Adicionar campos de endereço na tabela profiles para salvamento definitivo
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cargo text,
ADD COLUMN IF NOT EXISTS endereco_rua text,
ADD COLUMN IF NOT EXISTS endereco_numero text,
ADD COLUMN IF NOT EXISTS endereco_complemento text,
ADD COLUMN IF NOT EXISTS endereco_bairro text,
ADD COLUMN IF NOT EXISTS endereco_cidade text,
ADD COLUMN IF NOT EXISTS endereco_estado text,
ADD COLUMN IF NOT EXISTS endereco_cep text;