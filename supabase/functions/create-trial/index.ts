import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabaseClient = createClient(supabaseUrl!, supabaseKey!, { global: { headers: { Authorization: req.headers.get('Authorization')! } } })

    // Validar JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Chama Xtream API
    const xtreamUrl = Deno.env.get('XTREAM_URL')
    const xtreamUser = Deno.env.get('XTREAM_USER')
    const xtreamPass = Deno.env.get('XTREAM_PASS')

    // Nota: O payload ideal dependeria dos parâmetros esperados pela API Xtream. 
    // Mocado para fins da task
    const response = await fetch(`${xtreamUrl}/api.php?action=user&sub=add&user=${xtreamUser}&pass=${xtreamPass}`)
    const xtreamData = await response.json().catch(() => ({}))

    // Usa Service Role para atualizar a base, já que RLS pode estar travado para escrita
    const supabaseAdmin = createClient(supabaseUrl!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ subscription_status: 'trialing' })
      .eq('id', user.id)

    if (profileError) {
      throw profileError
    }

    return new Response(JSON.stringify({ success: true, data: xtreamData }), {
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
