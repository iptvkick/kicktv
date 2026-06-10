import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const body = await req.json()
    const action = req.method === 'PUT' ? 'update' : (body.action || 'create')

    const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
    const ASAAS_URL = Deno.env.get('ASAAS_API_URL') || 'https://api.asaas.com/v3'

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (action === 'create') {
      const { plan_id, extra_users_count = 0, cpfCnpj } = body
      if (!plan_id) throw new Error('plan_id is required')

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('asaas_customer_id, email, id')
        .eq('id', user.id)
        .single()

      let customerId = profile?.asaas_customer_id

      if (!customerId) {
        const customerRes = await fetch(`${ASAAS_URL}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY! },
          body: JSON.stringify({
            name: user.email?.split('@')[0] || 'Cliente',
            email: user.email,
            cpfCnpj: cpfCnpj || undefined,
          })
        })
        const customerData = await customerRes.json()
        if (!customerRes.ok) throw new Error(`Asaas Customer Error: ${JSON.stringify(customerData)}`)
        
        customerId = customerData.id
        await supabaseAdmin.from('profiles').update({ asaas_customer_id: customerId }).eq('id', user.id)
      }

      const { data: plan } = await supabaseAdmin.from('plans').select('*').eq('id', plan_id).single()
      if (!plan) throw new Error('Plan not found')

      const totalPrice = Number(plan.base_price) + (Number(plan.extra_user_price || 0) * extra_users_count)

      const subRes = await fetch(`${ASAAS_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY! },
        body: JSON.stringify({
          customer: customerId,
          billingType: 'PIX',
          nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
          value: totalPrice,
          cycle: plan.billing_cycle || 'MONTHLY',
          description: `Plano ${plan.name} + ${extra_users_count} Telas`
        })
      })
      const subData = await subRes.json()
      if (!subRes.ok) throw new Error(`Asaas Sub Error: ${JSON.stringify(subData)}`)

      // Create subscription in local database
      const { data: newSub, error: subError } = await supabaseAdmin.from('subscriptions').insert({
        user_id: user.id,
        plan_id: plan_id,
        asaas_customer_id: customerId,
        asaas_subscription_id: subData.id,
        extra_users_count: extra_users_count,
        total_price: totalPrice,
        status: 'PENDING',
        next_due_date: subData.nextDueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
      }).select().single()

      if (subError) throw new Error(`DB Error: ${subError.message}`)

      const chargesRes = await fetch(`${ASAAS_URL}/payments?subscription=${subData.id}`, {
        headers: { 'access_token': ASAAS_API_KEY! }
      })
      const chargesData = await chargesRes.json()
      const firstCharge = chargesData.data[0]

      if (firstCharge) {
        return new Response(JSON.stringify({ 
          subscription: newSub,
          chargeId: firstCharge.id,
          invoiceUrl: firstCharge.invoiceUrl 
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      return new Response(JSON.stringify({ subscription: newSub }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } else if (action === 'update' || action === 'update_extra_users') {
      const { subscription_id, extra_users_count } = body
      if (!subscription_id) throw new Error('subscription_id is required')

      const { data: sub } = await supabaseAdmin.from('subscriptions').select('*, plans(*)').eq('id', subscription_id).single()
      if (!sub) throw new Error('Subscription not found')

      const plan = sub.plans
      const totalPrice = Number(plan.base_price) + (Number(plan.extra_user_price || 0) * extra_users_count)

      // Update Asaas Subscription
      const updateRes = await fetch(`${ASAAS_URL}/subscriptions/${sub.asaas_subscription_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY! },
        body: JSON.stringify({
          value: totalPrice,
          description: `Plano ${plan.name} + ${extra_users_count} Telas`,
          updatePendingPayments: true
        })
      })
      const updateData = await updateRes.json()
      if (!updateRes.ok) throw new Error(`Asaas Update Error: ${JSON.stringify(updateData)}`)

      // Update local database
      await supabaseAdmin.from('subscriptions').update({
        extra_users_count: extra_users_count,
        total_price: totalPrice
      }).eq('id', subscription_id)

      return new Response(JSON.stringify({ success: true, total_price: totalPrice }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    throw new Error('Invalid action')

  } catch (error: any) {
    console.error('Subscription Manager Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
