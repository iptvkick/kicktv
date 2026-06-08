import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

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
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get User Profile
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error("Não autorizado.")

    // 2. Fetch System Settings (Trial Duration)
    const { data: trialSetting } = await supabaseAdmin
      .from('system_settings')
      .select('value')
      .eq('key', 'trial_duration_hours')
      .single()
    
    const trialHours = trialSetting?.value ? Number(trialSetting.value) : 4

    // 3. Fetch Xtream Servers (Fallback Logic)
    const { data: servers, error: srvError } = await supabaseAdmin
      .from('xtream_servers')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true })

    if (srvError || !servers || servers.length === 0) {
      throw new Error("Nenhum servidor Xtream configurado/ativo.")
    }

    const generatedUsername = `trial_${user.id.substring(0, 8)}`
    const generatedPassword = Math.random().toString(36).substring(2, 10)
    
    let successServer = null
    let connectionError = null

    // 4. Try connecting to each server (Pri 1 -> Pri 2 -> ...)
    for (const server of servers) {
      try {
        const createUrl = `${server.url}/api.php?action=user&sub=create&admin_username=${server.username}&admin_password=${server.password}&username=${generatedUsername}&password=${generatedPassword}&member_id=1&expire_date=${Math.floor(Date.now() / 1000) + (trialHours * 3600)}&max_connections=1`
        
        const response = await fetch(createUrl)
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`)
        
        const result = await response.json()
        if (result.result !== false) {
           successServer = server
           break // Fallback is successfully avoided or resolved
        }
      } catch (err: any) {
        connectionError = err.message
        console.error(`Falha no servidor ${server.name} (Prioridade ${server.priority}): ${err.message}`)
        // Continue loop to try next fallback server
      }
    }

    if (!successServer) {
      throw new Error(`Falha ao gerar teste em todos os servidores. Último erro: ${connectionError}`)
    }

    // 5. Insert subscription
    const dataVencimento = new Date(Date.now() + trialHours * 3600000).toISOString()
    const { error: subError } = await supabaseAdmin
      .from('iptv_subscriptions')
      .insert({
        user_id: user.id,
        xtream_username: generatedUsername,
        xtream_password: generatedPassword,
        status: 'trial',
        data_vencimento: dataVencimento,
        url_servidor: successServer.url
      })

    if (subError) throw subError

    return new Response(
      JSON.stringify({ 
        message: "Teste gerado com sucesso!", 
        serverName: successServer.name,
        expiresIn: `${trialHours} horas` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
