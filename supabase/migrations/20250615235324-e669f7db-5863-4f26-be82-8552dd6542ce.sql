
-- Create table for bank balances
CREATE TABLE public.saldos_bancarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL,
  banco TEXT NOT NULL,
  saldo NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.saldos_bancarios ENABLE ROW LEVEL SECURITY;

-- Create policies for saldos_bancarios
CREATE POLICY "Users can view their own bank balances" 
  ON public.saldos_bancarios 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bank balances" 
  ON public.saldos_bancarios 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank balances" 
  ON public.saldos_bancarios 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank balances" 
  ON public.saldos_bancarios 
  FOR DELETE 
  USING (auth.uid() = user_id);
