import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  try {
    const asaaccessToken = req.headers.get('asaas-access-token')
    const VALID_TOKEN = Deno.env.get('ASAAS_WEBHOOK_TOKEN')

    // 1. Verify Asaas Webhook Token
    if (!asaaccessToken || asaaccessToken !== VALID_TOKEN) {
      console.error('Unauthorized Webhook Call')
      return new Response('Unauthorized', { status: 401 })
    }

    const payload = await req.json()
    console.log('Webhook received:', payload.event)

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Need admin rights to update subscriptions safely
    )

    // 2. Process Events
    if (payload.event === 'PAYMENT_RECEIVED' || payload.event === 'PAYMENT_CONFIRMED') {
      const payment = payload.payment
      const subscriptionId = payment.subscription

      if (subscriptionId) {
        // Find subscription and update
        // We add 30 days from now since the cycle is monthly
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            expires_at: expiresAt
          })
          .eq('asaas_subscription_id', subscriptionId)

        if (error) throw new Error(`DB Update Error: ${error.message}`)
        console.log(`Subscription ${subscriptionId} activated until ${expiresAt}`)
      }
    } 
    else if (payload.event === 'PAYMENT_OVERDUE' || payload.event === 'PAYMENT_DELETED') {
       const payment = payload.payment
       const subscriptionId = payment.subscription
       if (subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('asaas_subscription_id', subscriptionId)
       }
    }

    // Always return 200 OK to Asaas so it stops retrying
    return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })

  } catch (error) {
    console.error('Webhook Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
