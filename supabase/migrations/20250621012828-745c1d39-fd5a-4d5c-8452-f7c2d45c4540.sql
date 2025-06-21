
-- Create table for storing user session data
CREATE TABLE public.user_session_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page TEXT NOT NULL,
  unsaved_data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.user_session_data ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own session data
CREATE POLICY "Users can manage their own session data" 
  ON public.user_session_data 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX idx_user_session_data_user_id_page ON public.user_session_data(user_id, page);
