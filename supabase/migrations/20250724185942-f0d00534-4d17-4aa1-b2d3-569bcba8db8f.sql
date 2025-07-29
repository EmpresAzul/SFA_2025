-- Enhanced Security Monitoring and Reporting
-- Add automated security report generation and enhanced monitoring

-- Create function to generate security summary report
CREATE OR REPLACE FUNCTION public.generate_security_report(target_user_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  report jsonb := '{}';
  total_alerts integer;
  critical_alerts integer;
  unresolved_alerts integer;
  recent_events integer;
  user_score integer;
BEGIN
  -- If no user specified and caller is admin, generate system-wide report
  IF target_user_id IS NULL AND public.is_admin(auth.uid()) THEN
    -- System-wide statistics
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE severity = 'critical') as critical,
      COUNT(*) FILTER (WHERE is_resolved = false) as unresolved
    INTO total_alerts, critical_alerts, unresolved_alerts
    FROM public.security_alerts
    WHERE created_at > (now() - interval '30 days');
    
    SELECT COUNT(*) INTO recent_events
    FROM public.security_events
    WHERE created_at > (now() - interval '7 days');
    
    report := jsonb_build_object(
      'type', 'system',
      'period', '30_days',
      'total_alerts', total_alerts,
      'critical_alerts', critical_alerts,
      'unresolved_alerts', unresolved_alerts,
      'recent_events', recent_events,
      'generated_at', now()
    );
  ELSE
    -- User-specific report (user can only see their own, admin can see any)
    IF target_user_id IS NULL THEN
      target_user_id := auth.uid();
    ELSIF NOT public.is_admin(auth.uid()) AND target_user_id != auth.uid() THEN
      RAISE EXCEPTION 'Access denied: Can only view own security report';
    END IF;
    
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE severity = 'critical') as critical,
      COUNT(*) FILTER (WHERE is_resolved = false) as unresolved
    INTO total_alerts, critical_alerts, unresolved_alerts
    FROM public.security_alerts
    WHERE user_id = target_user_id AND created_at > (now() - interval '30 days');
    
    SELECT COUNT(*) INTO recent_events
    FROM public.security_events
    WHERE user_id = target_user_id AND created_at > (now() - interval '7 days');
    
    -- Get user security score
    user_score := public.calculate_user_security_score(target_user_id);
    
    report := jsonb_build_object(
      'type', 'user',
      'user_id', target_user_id,
      'period', '30_days',
      'security_score', user_score,
      'total_alerts', total_alerts,
      'critical_alerts', critical_alerts,
      'unresolved_alerts', unresolved_alerts,
      'recent_events', recent_events,
      'generated_at', now()
    );
  END IF;
  
  RETURN report;
END;
$$;

-- Create function to auto-resolve old low-severity alerts
CREATE OR REPLACE FUNCTION public.cleanup_old_security_alerts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Auto-resolve low severity alerts older than 90 days
  UPDATE public.security_alerts 
  SET 
    is_resolved = true,
    resolved_at = now(),
    resolved_by = NULL -- System auto-resolution
  WHERE 
    severity = 'low' 
    AND is_resolved = false 
    AND created_at < (now() - interval '90 days');
    
  -- Auto-resolve medium severity alerts older than 30 days
  UPDATE public.security_alerts 
  SET 
    is_resolved = true,
    resolved_at = now(),
    resolved_by = NULL
  WHERE 
    severity = 'medium' 
    AND is_resolved = false 
    AND created_at < (now() - interval '30 days');
END;
$$;

-- Enhanced security event logging with better categorization
CREATE OR REPLACE FUNCTION public.log_enhanced_security_event(
  event_type_param text,
  severity_param text DEFAULT 'low',
  description_param text DEFAULT '',
  user_id_param uuid DEFAULT NULL,
  metadata_param jsonb DEFAULT '{}',
  auto_create_alert boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  event_id uuid;
  alert_id uuid := NULL;
BEGIN
  -- Insert security event
  INSERT INTO public.security_events (
    event_type, severity, description, user_id, metadata
  ) VALUES (
    event_type_param, severity_param, description_param, user_id_param, metadata_param
  ) RETURNING id INTO event_id;
  
  -- Auto-create alert for high/critical events if requested
  IF auto_create_alert AND severity_param IN ('high', 'critical') THEN
    alert_id := public.create_security_alert(
      event_type_param,
      severity_param,
      'Evento de segurança detectado: ' || event_type_param,
      description_param,
      user_id_param,
      metadata_param || jsonb_build_object('source_event_id', event_id)
    );
  END IF;
  
  RETURN event_id;
END;
$$;