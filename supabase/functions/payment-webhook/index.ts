import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, asaas-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('asaas-signature')
    const webhookSecret = Deno.env.get('PAYMENT_WEBHOOK_SECRET')

    // Validação da assinatura do webhook
    if (!signature || signature !== webhookSecret) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const payload = await req.json()
    
    // No Asaas, externalReference geralmente armazena o ID do usuário no sistema
    const userId = payload.payment?.externalReference

    if (!userId) {
       throw new Error('User ID not found in payload')
    }

    if (payload.event === 'PAYMENT_CONFIRMED' || payload.event === 'PAYMENT_RECEIVED') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      const supabaseClient = createClient(supabaseUrl!, supabaseKey!)

      // Atualiza o profile para active
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({ subscription_status: 'active' })
        .eq('id', userId)

      if (profileError) throw profileError

      // Chama a Xtream API para prolongar os dias
      const xtreamUrl = Deno.env.get('XTREAM_URL')
      const xtreamUser = Deno.env.get('XTREAM_USER')
      const xtreamPass = Deno.env.get('XTREAM_PASS')
      
      // Chamada de prolongamento de assinatura fictícia baseada em documentação genérica Xtream
      const response = await fetch(`${xtreamUrl}/api.php?action=user&sub=extend&user=${xtreamUser}&pass=${xtreamPass}`)
      const xtreamData = await response.json().catch(() => ({}))

      return new Response(JSON.stringify({ success: true, data: xtreamData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
