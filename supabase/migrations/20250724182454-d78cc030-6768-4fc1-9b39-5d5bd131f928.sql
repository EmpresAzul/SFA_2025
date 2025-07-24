-- Fix admin role management - remove hardcoded email dependencies
-- Create flexible admin role assignment system

-- Drop existing hardcoded admin function
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Create new flexible role-based admin function
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if user has admin role in user_roles table
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id 
    AND role = 'admin'::app_role
  );
END;
$$;

-- Create initial admin role for the hardcoded admin email
-- This ensures backward compatibility
DO $$
DECLARE 
  admin_user_id uuid;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@fluxoazul.com'
  LIMIT 1;
  
  -- Insert admin role if user exists and doesn't already have role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (admin_user_id, 'admin'::app_role, admin_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Create function to assign admin role (only admins can assign roles)
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id uuid,
  new_role app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only admins can assign roles
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Only administrators can assign roles';
  END IF;
  
  -- Insert the new role
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, auth.uid())
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- Create function to revoke user role
CREATE OR REPLACE FUNCTION public.revoke_user_role(
  target_user_id uuid,
  role_to_revoke app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only admins can revoke roles
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Only administrators can revoke roles';
  END IF;
  
  -- Don't allow removing the last admin
  IF role_to_revoke = 'admin'::app_role THEN
    IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin'::app_role) <= 1 THEN
      RAISE EXCEPTION 'Cannot remove the last administrator';
    END IF;
  END IF;
  
  -- Remove the role
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id 
  AND role = role_to_revoke;
  
  RETURN true;
END;
$$;

-- Create session security table for tracking active sessions
CREATE TABLE IF NOT EXISTS public.active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token_hash text NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '30 minutes'),
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS on active_sessions
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for active_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.active_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" 
ON public.active_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON public.active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_token_hash ON public.active_sessions(session_token_hash);
CREATE INDEX IF NOT EXISTS idx_active_sessions_activity ON public.active_sessions(last_activity);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Mark expired sessions as inactive
  UPDATE public.active_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  -- Delete sessions older than 7 days
  DELETE FROM public.active_sessions 
  WHERE created_at < (now() - interval '7 days');
END;
$$;

-- Function to limit concurrent sessions (max 3 per user)
CREATE OR REPLACE FUNCTION public.enforce_session_limit(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_count integer;
BEGIN
  -- Count active sessions for user
  SELECT COUNT(*) INTO session_count
  FROM public.active_sessions
  WHERE user_id = user_uuid AND is_active = true AND expires_at > now();
  
  -- If more than 3 sessions, deactivate oldest ones
  IF session_count > 3 THEN
    UPDATE public.active_sessions 
    SET is_active = false
    WHERE id IN (
      SELECT id FROM public.active_sessions
      WHERE user_id = user_uuid AND is_active = true
      ORDER BY last_activity ASC
      LIMIT (session_count - 3)
    );
  END IF;
END;
$$;

-- Create security alerts table
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text NOT NULL,
  user_id uuid,
  metadata jsonb DEFAULT '{}',
  is_resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on security_alerts
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for security_alerts (admins can see all, users see their own)
CREATE POLICY "Admins can view all security alerts" 
ON public.security_alerts 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own security alerts" 
ON public.security_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all security alerts" 
ON public.security_alerts 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Function to create security alert
CREATE OR REPLACE FUNCTION public.create_security_alert(
  alert_type_param text,
  severity_param text,
  title_param text,
  description_param text,
  user_id_param uuid DEFAULT NULL,
  metadata_param jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  alert_id uuid;
BEGIN
  INSERT INTO public.security_alerts (
    alert_type, severity, title, description, user_id, metadata
  ) VALUES (
    alert_type_param, severity_param, title_param, description_param, user_id_param, metadata_param
  ) RETURNING id INTO alert_id;
  
  RETURN alert_id;
END;
$$;