import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, asaas-access-token',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const asaaccessToken = req.headers.get('asaas-access-token')

    if (!asaaccessToken) {
      console.error('Missing asaas-access-token header')
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
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
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const webhookToken = integration.credentials?.webhookToken

    if (!webhookToken || asaaccessToken !== webhookToken) {
      console.error('Invalid Webhook Token')
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const body = await req.json()
    console.log('Webhook payload:', body)

    const { event, payment } = body

    if (payment && payment.subscription) {
      const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('asaas_subscription_id', payment.subscription)
        .maybeSingle()

      if (subData) {
        let invoiceStatus = 'PENDING'
        if (['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(payment.status)) {
          invoiceStatus = 'RECEIVED'
        } else if (payment.status === 'OVERDUE') {
          invoiceStatus = 'OVERDUE'
        }

        const { data: existingInvoice } = await supabaseAdmin
          .from('invoices')
          .select('id')
          .eq('asaas_payment_id', payment.id)
          .maybeSingle()

        if (existingInvoice) {
          await supabaseAdmin
            .from('invoices')
            .update({
              amount: payment.value,
              due_date: payment.dueDate,
              status: invoiceStatus
            })
            .eq('id', existingInvoice.id)
        } else {
          await supabaseAdmin
            .from('invoices')
            .insert({
              subscription_id: subData.id,
              asaas_payment_id: payment.id,
              amount: payment.value,
              due_date: payment.dueDate,
              status: invoiceStatus
            })
        }

        const updates: any = {}
        if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
          updates.status = 'ACTIVE'
        } else if (event === 'PAYMENT_OVERDUE') {
          updates.status = 'OVERDUE'
        }

        if (payment.status === 'PENDING' && (event === 'PAYMENT_CREATED' || event === 'PAYMENT_UPDATED')) {
          updates.next_due_date = payment.dueDate
        }

        if (Object.keys(updates).length > 0) {
          await supabaseAdmin
            .from('subscriptions')
            .update(updates)
            .eq('id', subData.id)
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error: any) {
    console.error('Webhook Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
