-- Clean up legacy admin policy and enhance security
-- Remove the hardcoded admin email policy since we have role-based access control
DROP POLICY IF EXISTS "Admin email full access" ON public.user_profiles;

-- Update the is_admin function to use the role-based system consistently
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- Add enhanced security monitoring with automated notifications
CREATE TABLE IF NOT EXISTS public.security_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES public.security_alerts(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'internal', 'webhook')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on security notifications
ALTER TABLE public.security_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for security notifications (admin only)
CREATE POLICY "Admins can manage security notifications"
ON public.security_notifications
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create function to automatically create notifications for critical alerts
CREATE OR REPLACE FUNCTION public.create_security_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only create notifications for high or critical severity alerts
  IF NEW.severity IN ('high', 'critical') THEN
    INSERT INTO public.security_notifications (alert_id, notification_type, metadata)
    VALUES (
      NEW.id,
      'internal',
      jsonb_build_object(
        'alert_type', NEW.alert_type,
        'severity', NEW.severity,
        'created_at', NEW.created_at,
        'auto_generated', true
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic notifications
CREATE TRIGGER security_alert_notification_trigger
AFTER INSERT ON public.security_alerts
FOR EACH ROW
EXECUTE FUNCTION public.create_security_notification();

-- Add security score calculation function
CREATE OR REPLACE FUNCTION public.calculate_user_security_score(user_uuid uuid)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  score INTEGER := 100;
  critical_alerts INTEGER;
  high_alerts INTEGER;
  medium_alerts INTEGER;
  recent_logins INTEGER;
BEGIN
  -- Deduct points for unresolved alerts (last 30 days)
  SELECT 
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_count,
    COUNT(*) FILTER (WHERE severity = 'high') as high_count,
    COUNT(*) FILTER (WHERE severity = 'medium') as medium_count
  INTO critical_alerts, high_alerts, medium_alerts
  FROM public.security_alerts
  WHERE user_id = user_uuid 
    AND is_resolved = false 
    AND created_at > (now() - interval '30 days');

  -- Scoring logic
  score := score - (critical_alerts * 30) - (high_alerts * 15) - (medium_alerts * 5);
  
  -- Check for recent suspicious activity
  SELECT COUNT(*) INTO recent_logins
  FROM public.security_events
  WHERE user_id = user_uuid 
    AND event_type = 'suspicious_login'
    AND created_at > (now() - interval '7 days');
    
  score := score - (recent_logins * 10);
  
  -- Ensure score is between 0 and 100
  RETURN GREATEST(0, LEAST(100, score));
END;
$$;