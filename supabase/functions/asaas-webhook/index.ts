import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const asaaccessToken = req.headers.get('asaas-access-token')

    if (!asaaccessToken) {
      console.error('Missing asaas-access-token header')
      return new Response('Unauthorized', { status: 401 })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Consultar tabela integrations para pegar o token de webhook do Asaas
    const { data: integration, error } = await supabaseAdmin
      .from('integrations')
      .select('credentials')
      .eq('provider', 'asaas')
      .single()

    if (error || !integration) {
      console.error('Error fetching Asaas integration credentials:', error?.message)
      return new Response('Unauthorized', { status: 401 })
    }

    const webhookToken = integration.credentials?.webhookToken

    if (!webhookToken || asaaccessToken !== webhookToken) {
      console.error('Invalid Webhook Token')
      return new Response('Unauthorized', { status: 401 })
    }

    // Retornar 200 { success: true } conforme a Fase 2 da Spec 016
    // (a lógica de negócio do webhook será inserida no futuro)
    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    })

  } catch (error: any) {
    console.error('Webhook Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
})
