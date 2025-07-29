-- CORREÇÕES URGENTES DO BANCO DE DADOS

-- 1. CORRIGIR CHECK CONSTRAINT EM LANCAMENTOS (permitir 'ativo')
ALTER TABLE public.lancamentos DROP CONSTRAINT IF EXISTS lancamentos_status_check;
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_status_check 
  CHECK (status IN ('pendente', 'ativo', 'concluido', 'cancelado'));

-- 2. TORNAR DATA_VENCIMENTO OPCIONAL EM LEMBRETES
ALTER TABLE public.lembretes ALTER COLUMN data_vencimento DROP NOT NULL;

-- 3. ADICIONAR COLUNA SALDO FALTANTE EM SALDOS_BANCARIOS
ALTER TABLE public.saldos_bancarios ADD COLUMN IF NOT EXISTS saldo NUMERIC DEFAULT 0;
UPDATE public.saldos_bancarios SET saldo = saldo_atual WHERE saldo IS NULL;

-- 4. CRIAR TABELA ESTOQUES
CREATE TABLE IF NOT EXISTS public.estoques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  nome_produto TEXT NOT NULL,
  unidade_medida TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0,
  valor_unitario NUMERIC NOT NULL DEFAULT 0,
  valor_total NUMERIC NOT NULL DEFAULT 0,
  quantidade_bruta NUMERIC NOT NULL DEFAULT 0,
  quantidade_liquida NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para estoques
ALTER TABLE public.estoques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own estoques" ON public.estoques FOR ALL USING (auth.uid() = user_id);

-- 5. CRIAR TABELA PRECIFICACAO
CREATE TABLE IF NOT EXISTS public.precificacao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('produto', 'servico', 'hora')),
  custo_materia_prima NUMERIC DEFAULT 0,
  custo_mao_obra NUMERIC DEFAULT 0,
  despesas_fixas NUMERIC DEFAULT 0,
  margem_lucro NUMERIC DEFAULT 0,
  preco_venda NUMERIC NOT NULL,
  observacoes TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para precificacao
ALTER TABLE public.precificacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own precificacao" ON public.precificacao FOR ALL USING (auth.uid() = user_id);

-- 6. CRIAR TABELA PONTO_EQUILIBRIO
CREATE TABLE IF NOT EXISTS public.ponto_equilibrio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_projecao TEXT NOT NULL,
  gastos_fixos NUMERIC NOT NULL DEFAULT 0,
  custos_variaveis NUMERIC NOT NULL DEFAULT 0,
  faturamento_estimado NUMERIC NOT NULL DEFAULT 0,
  pro_labore NUMERIC DEFAULT 0,
  saidas_nao_operacionais NUMERIC DEFAULT 0,
  ponto_equilibrio_calculado NUMERIC DEFAULT 0,
  margem_contribuicao NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para ponto_equilibrio
ALTER TABLE public.ponto_equilibrio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own ponto_equilibrio" ON public.ponto_equilibrio FOR ALL USING (auth.uid() = user_id);

-- 7. CRIAR TRIGGERS PARA UPDATED_AT
CREATE TRIGGER update_estoques_updated_at 
  BEFORE UPDATE ON public.estoques 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_precificacao_updated_at 
  BEFORE UPDATE ON public.precificacao 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ponto_equilibrio_updated_at 
  BEFORE UPDATE ON public.ponto_equilibrio 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_estoques_user_id ON public.estoques(user_id);
CREATE INDEX IF NOT EXISTS idx_precificacao_user_id ON public.precificacao(user_id);
CREATE INDEX IF NOT EXISTS idx_ponto_equilibrio_user_id ON public.ponto_equilibrio(user_id);

-- 9. VERIFICAR E CORRIGIR DADOS INCONSISTENTES
UPDATE public.lancamentos SET status = 'ativo' WHERE status IS NULL;
UPDATE public.cadastros SET pessoa = 'fisica' WHERE pessoa IS NULL;
UPDATE public.cadastros SET status = 'ativo' WHERE status IS NULL;