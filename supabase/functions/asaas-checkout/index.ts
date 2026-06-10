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

    const { planId, serverId, cpfCnpj } = await req.json()
    if (!planId || !serverId) throw new Error('planId and serverId are required')

    // Fetch Profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('asaas_customer_id, email, id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.asaas_customer_id

    const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
    const ASAAS_URL = Deno.env.get('ASAAS_API_URL') || 'https://api.asaas.com/v3' // Utiliza Produção por padrão

    // 1. Create Customer if doesn't exist
    if (!customerId) {
      const customerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY! },
        body: JSON.stringify({
          name: user.email?.split('@')[0] || 'Cliente',
          email: user.email,
          cpfCnpj: cpfCnpj || undefined, // Asaas might reject without CPF depending on the account configuration
        })
      })
      const customerData = await customerRes.json()
      if (!customerRes.ok) throw new Error(`Asaas Customer Error: ${JSON.stringify(customerData)}`)
      
      customerId = customerData.id

      // Update Profile with new Customer ID
      await supabaseClient.from('profiles').update({ asaas_customer_id: customerId }).eq('id', user.id)
    }

    // 2. Fetch Plan details
    const { data: plan } = await supabaseClient.from('plans').select('price_monthly').eq('id', planId).single()
    if (!plan) throw new Error('Plan not found')

    // 3. Create PIX Subscription
    const subRes = await fetch(`${ASAAS_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY! },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        value: plan.price_monthly,
        cycle: 'MONTHLY',
        description: 'Assinatura KickTV SaaS'
      })
    })
    const subData = await subRes.json()
    if (!subRes.ok) throw new Error(`Asaas Sub Error: ${JSON.stringify(subData)}`)

    // 4. Create local subscription record in DB (pending)
    const { error: dbError } = await supabaseClient.from('subscriptions').insert({
      profile_id: user.id,
      plan_id: planId,
      server_id: serverId,
      status: 'trialing', // Will be updated to active when webhook fires
      asaas_subscription_id: subData.id,
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // Gives a 4 hour trial buffer until payment
    })
    if (dbError) throw new Error(`DB Error: ${dbError.message}`)

    // 5. Fetch PIX QR Code for the newly created charge (Asaas generates a charge for the first cycle immediately)
    // We need to fetch the charge related to this subscription
    const chargesRes = await fetch(`${ASAAS_URL}/payments?subscription=${subData.id}`, {
      headers: { 'access_token': ASAAS_API_KEY! }
    })
    const chargesData = await chargesRes.json()
    const firstCharge = chargesData.data[0]

    if (firstCharge) {
      const qrRes = await fetch(`${ASAAS_URL}/payments/${firstCharge.id}/pixQrCode`, {
        headers: { 'access_token': ASAAS_API_KEY! }
      })
      const qrData = await qrRes.json()
      return new Response(JSON.stringify({ 
        subscription: subData, 
        pix: qrData, 
        chargeId: firstCharge.id,
        invoiceUrl: subData.invoiceUrl 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ 
      subscription: subData,
      invoiceUrl: subData.invoiceUrl 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
