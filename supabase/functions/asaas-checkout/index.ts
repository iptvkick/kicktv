import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ──────────────────────────────────────────────
    // 1. Supabase client (user-scoped via JWT)
    // ──────────────────────────────────────────────
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // ──────────────────────────────────────────────
    // 2. Authenticate user
    // ──────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError) throw new Error(`Supabase Auth Error: ${userError.message}`)
    if (!user) throw new Error('User not found in token')

    // ──────────────────────────────────────────────
    // 3. Parse request body
    //    extraUsers: number of additional user slots beyond the base plan
    // ──────────────────────────────────────────────
    const { planId, serverId, cpfCnpj, extraUsers = 0 } = await req.json()
    if (!planId || !serverId) throw new Error('planId and serverId are required')

    const extraUsersCount = Math.max(0, Number(extraUsers) || 0)

    // ──────────────────────────────────────────────
    // 4. Read Asaas credentials from integrations table
    //    This determines sandbox vs production environment
    // ──────────────────────────────────────────────
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: integration, error: intError } = await supabaseAdmin
      .from('integrations')
      .select('api_key, credentials, is_active')
      .eq('provider', 'asaas')
      .single()

    if (intError || !integration) throw new Error('Asaas integration not found in database')

    const credentials = (integration.credentials as Record<string, string>) || {}
    const ASAAS_API_KEY = credentials?.apiKey || integration.api_key

    if (!ASAAS_API_KEY) throw new Error('Asaas API Key is missing in integrations')

    // Resolve URL based on environment stored in credentials
    let ASAAS_URL = 'https://sandbox.asaas.com/api/v3' // safe default
    if (credentials?.environment === 'production') {
      ASAAS_URL = 'https://api.asaas.com/v3'
    } else if (credentials?.environment === 'sandbox') {
      ASAAS_URL = 'https://sandbox.asaas.com/api/v3'
    }

    // ──────────────────────────────────────────────
    // 5. Fetch user profile for Asaas customer ID
    // ──────────────────────────────────────────────
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('asaas_customer_id, email, id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.asaas_customer_id

    // ──────────────────────────────────────────────
    // 6. Create Asaas customer if not yet linked
    // ──────────────────────────────────────────────
    if (!customerId) {
      const customerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY },
        body: JSON.stringify({
          name: user.email?.split('@')[0] || 'Cliente',
          email: user.email,
          cpfCnpj: cpfCnpj || undefined,
        })
      })
      const customerData = await customerRes.json()
      if (!customerRes.ok) throw new Error(`Asaas Customer Error: ${JSON.stringify(customerData)}`)

      customerId = customerData.id

      // Persist customer ID to profile
      await supabaseAdmin
        .from('profiles')
        .update({ asaas_customer_id: customerId })
        .eq('id', user.id)
    }

    // ──────────────────────────────────────────────
    // 7. Fetch plan details and calculate total price
    //    FIX: use base_price (not price_monthly)
    //    total = base_price + (extraUsers * extra_user_price)
    // ──────────────────────────────────────────────
    const { data: plan } = await supabaseClient
      .from('plans')
      .select('base_price, extra_user_price')
      .eq('id', planId)
      .single()

    if (!plan) throw new Error('Plan not found')

    const totalValue =
      Number(plan.base_price) + (extraUsersCount * Number(plan.extra_user_price || 0))

    // ──────────────────────────────────────────────
    // 8. Create PIX subscription in Asaas
    // ──────────────────────────────────────────────
    const subRes = await fetch(`${ASAAS_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        value: totalValue,
        cycle: 'MONTHLY',
        description: `Assinatura KickTV — ${extraUsersCount > 0 ? `+${extraUsersCount} usuários` : 'Plano base'}`,
      })
    })
    const subData = await subRes.json()
    if (!subRes.ok) throw new Error(`Asaas Sub Error: ${JSON.stringify(subData)}`)

    // ──────────────────────────────────────────────
    // 9. Insert local subscription record (PENDING)
    // ──────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        asaas_customer_id: customerId,
        asaas_subscription_id: subData.id,
        extra_users_count: extraUsersCount,
        total_price: totalValue,
        status: 'PENDING',
        next_due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      })

    if (dbError) throw new Error(`DB Error: ${dbError.message}`)

    // ──────────────────────────────────────────────
    // 10. Fetch first PIX charge and return QR code
    // ──────────────────────────────────────────────
    const chargesRes = await fetch(`${ASAAS_URL}/payments?subscription=${subData.id}`, {
      headers: { 'access_token': ASAAS_API_KEY }
    })
    const chargesData = await chargesRes.json()
    const firstCharge = chargesData.data?.[0]

    if (firstCharge) {
      const qrRes = await fetch(`${ASAAS_URL}/payments/${firstCharge.id}/pixQrCode`, {
        headers: { 'access_token': ASAAS_API_KEY }
      })
      const qrData = await qrRes.json()

      return new Response(JSON.stringify({
        subscription: subData,
        pix: qrData,
        chargeId: firstCharge.id,
        invoiceUrl: subData.invoiceUrl,
        totalValue,
        extraUsersCount,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({
      subscription: subData,
      invoiceUrl: subData.invoiceUrl,
      totalValue,
      extraUsersCount,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error: any) {
    console.error('Asaas Checkout Error:', error.message || error);
    // We return 200 OK so the Supabase client doesn't throw a generic "non-2xx status code" error.
    // The frontend will check for the `error` property in the JSON body.
    return new Response(
      JSON.stringify({ error: error.message || 'Erro desconhecido ao processar pagamento.' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
