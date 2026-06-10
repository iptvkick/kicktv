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

    // Validate JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { type, data } = await req.json()
    if (!type) throw new Error('Missing "type" field in request body')

    // Read Asaas credentials
    const { data: integration, error: intError } = await supabaseClient
      .from('integrations')
      .select('credentials, is_active')
      .eq('provider', 'asaas')
      .single()

    if (intError || !integration || !integration.is_active) {
      throw new Error('Asaas integration not configured or inactive')
    }

    const credentials = integration.credentials as any
    const ASAAS_API_KEY = credentials?.apiKey || Deno.env.get('ASAAS_API_KEY')
    const ASAAS_URL = credentials?.environment === 'sandbox' 
      ? 'https://sandbox.asaas.com/api/v3'
      : (Deno.env.get('ASAAS_API_URL') || 'https://api.asaas.com/v3')

    if (!ASAAS_API_KEY) {
      throw new Error('Asaas API Key is missing in integrations')
    }

    if (type === 'plan') {
      // In Asaas there isn't a direct "Plan" concept like Stripe Products,
      // but if the API expects it, we can create it or just save in our DB.
      // We will just insert directly into subscription_plans.
      // (If Asaas did support /plans, we would call it here)
      const fakeAsaasId = `plan_${crypto.randomUUID().replace(/-/g, '')}`
      
      const planToInsert: any = {
        name: data.name,
        duration_months: data.duration_months,
        base_price: data.base_price,
        extra_screen_price: data.extra_screen_price,
        is_active: data.is_active !== undefined ? data.is_active : true,
        asaas_id: fakeAsaasId
      }

      // Try inserting
      const { data: insertedPlan, error: insertError } = await supabaseClient
        .from('subscription_plans')
        .insert(planToInsert)
        .select()
        .single()

      if (insertError) throw insertError

      return new Response(JSON.stringify({ success: true, plan: insertedPlan }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (type === 'customer') {
      // Create or update customer in Asaas
      // Let's get the profile info to send
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single()

      const emailToUse = profile?.email || user.email
      
      const customerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY },
        body: JSON.stringify({
          name: emailToUse?.split('@')[0] || 'Cliente',
          email: emailToUse,
          // cpfCnpj could be added from `data.cpfCnpj` if needed
        })
      })

      const customerData = await customerRes.json()
      if (!customerRes.ok) throw new Error(`Asaas Customer Error: ${JSON.stringify(customerData)}`)
      
      const customerId = customerData.id

      // Update Profile with new Customer ID
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ asaas_customer_id: customerId })
        .eq('id', user.id)

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true, customerId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid type parameter. Expected "plan" or "customer".')

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
