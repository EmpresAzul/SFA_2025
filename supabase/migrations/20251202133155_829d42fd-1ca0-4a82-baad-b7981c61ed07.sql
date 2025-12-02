-- Criar tabela crm_leads para o CRM
CREATE TABLE IF NOT EXISTS public.crm_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'Manual',
  status TEXT NOT NULL DEFAULT 'prospeccao' CHECK (status IN ('prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechado', 'perdido')),
  value DECIMAL(10,2) DEFAULT 0,
  probability INTEGER DEFAULT 25 CHECK (probability >= 0 AND probability <= 100),
  next_follow_up DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own leads" 
ON public.crm_leads 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own leads" 
ON public.crm_leads 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own leads" 
ON public.crm_leads 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own leads" 
ON public.crm_leads 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- Política para negar acesso anônimo
CREATE POLICY "Deny anonymous access to crm_leads"
ON public.crm_leads
FOR ALL
TO anon
USING (false);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_crm_leads_user_id ON public.crm_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON public.crm_leads(created_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_crm_leads_updated_at
BEFORE UPDATE ON public.crm_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();