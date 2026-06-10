import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const { invoice_id, status } = await req.json()

    if (!invoice_id || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing invoice_id or status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Update invoice status
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoice_id)
      .select('subscription_id')
      .single()

    if (invoiceError) {
      throw invoiceError
    }

    // If payment received, update subscription to ACTIVE
    if (status === 'RECEIVED' && invoiceData?.subscription_id) {
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({ status: 'ACTIVE' })
        .eq('id', invoiceData.subscription_id)

      if (subscriptionError) {
        throw subscriptionError
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: `Invoice ${invoice_id} updated to ${status}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
