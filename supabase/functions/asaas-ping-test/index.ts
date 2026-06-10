import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verify user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Read Asaas credentials
    const { data: integration, error: intError } = await supabaseClient
      .from('integrations')
      .select('api_key, credentials, is_active')
      .eq('provider', 'asaas')
      .single()

    if (intError || !integration) {
      throw new Error('Asaas integration not found')
    }

    const credentials = integration.credentials as any || {}
    const ASAAS_API_KEY = credentials?.apiKey || integration.api_key
    
    let ASAAS_URL = 'https://sandbox.asaas.com/api/v3'
    if (credentials?.environment === 'production') {
      ASAAS_URL = 'https://api.asaas.com/v3'
    } else if (credentials?.environment === 'sandbox') {
      ASAAS_URL = 'https://sandbox.asaas.com/api/v3'
    } else if (ASAAS_API_KEY && ASAAS_API_KEY.startsWith('$aact_YTU5') && ASAAS_API_KEY.length > 50) {
       // Just a heuristic, but let's stick to sandbox as default if not specified
       ASAAS_URL = 'https://sandbox.asaas.com/api/v3'
    }

    if (!ASAAS_API_KEY) {
      throw new Error('Asaas API Key is missing in integrations')
    }

    const res = await fetch(`${ASAAS_URL}/customers?limit=1`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      }
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(`Asaas Ping Error: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify({ success: true, data }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
