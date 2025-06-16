
-- Adicionar novos campos à tabela cadastros
ALTER TABLE public.cadastros 
ADD COLUMN IF NOT EXISTS data DATE,
ADD COLUMN IF NOT EXISTS pessoa TEXT CHECK (pessoa IN ('Física', 'Jurídica')),
ADD COLUMN IF NOT EXISTS numero TEXT,
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS anexo_url TEXT,
ADD COLUMN IF NOT EXISTS salario NUMERIC;

-- Atualizar registros existentes para ter uma data padrão
UPDATE public.cadastros 
SET data = CURRENT_DATE 
WHERE data IS NULL;

-- Tornar o campo data obrigatório após a atualização
ALTER TABLE public.cadastros 
ALTER COLUMN data SET NOT NULL;

-- Definir valores padrão para pessoa baseado no tipo existente
UPDATE public.cadastros 
SET pessoa = CASE 
  WHEN tipo = 'Fornecedor' THEN 'Jurídica'
  ELSE 'Física'
END
WHERE pessoa IS NULL;

-- Tornar o campo pessoa obrigatório após a atualização
ALTER TABLE public.cadastros 
ALTER COLUMN pessoa SET NOT NULL;
