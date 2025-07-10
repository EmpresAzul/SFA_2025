-- Criar tabela para leads do CRM
CREATE TABLE public.crm_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'Website',
  status TEXT NOT NULL DEFAULT 'prospeccao' CHECK (status IN ('prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechamento', 'perdido')),
  value DECIMAL(10,2) DEFAULT 0,
  probability INTEGER DEFAULT 25 CHECK (probability >= 0 AND probability <= 100),
  next_follow_up DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para interações do CRM
CREATE TABLE public.crm_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'proposal', 'follow-up')),
  description TEXT NOT NULL,
  outcome TEXT,
  interaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;

-- Políticas para crm_leads
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

-- Políticas para crm_interactions
CREATE POLICY "Users can view their own interactions" 
ON public.crm_interactions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own interactions" 
ON public.crm_interactions 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own interactions" 
ON public.crm_interactions 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own interactions" 
ON public.crm_interactions 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- Criar índices para performance
CREATE INDEX idx_crm_leads_user_id ON public.crm_leads(user_id);
CREATE INDEX idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX idx_crm_interactions_user_id ON public.crm_interactions(user_id);
CREATE INDEX idx_crm_interactions_lead_id ON public.crm_interactions(lead_id);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_crm_leads_updated_at
BEFORE UPDATE ON public.crm_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();