import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    // Set the auth token for the client
    supabaseClient.auth.setSession({
      access_token: token,
      refresh_token: '',
    } as any)

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Log security event
    const { error: logError } = await supabaseClient
      .from('security_events')
      .insert({
        user_id: user.id,
        event_type: 'security_headers_applied',
        severity: 'low',
        description: 'Security headers aplicados com sucesso',
        metadata: {
          user_agent: req.headers.get('user-agent'),
          origin: req.headers.get('origin'),
          timestamp: Date.now()
        }
      })

    if (logError) {
      console.error('Error logging security event:', logError)
    }

    // Generate security headers
    const nonce = crypto.randomUUID().replace(/-/g, '').substring(0, 16)

    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: blob:;
        font-src 'self' data:;
        connect-src 'self' https://*.supabase.co wss://*.supabase.co;
        frame-src 'none';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim()
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        headers: securityHeaders,
        nonce,
        message: 'Security headers configured successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          ...securityHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('Error in security-headers function:', error)
    return new Response(
      JSON.stringify({ error: 'Service unavailable. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})