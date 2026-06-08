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
    const { plan_id, extra_screens = 0 } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get Plan pricing dynamically
    const { data: plan, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .single()

    if (planError || !plan) {
      throw new Error("Plano não encontrado ou inativo.")
    }

    // 2. Calculate Final Price
    const basePrice = Number(plan.base_price)
    const extraPrice = Number(plan.extra_screen_price) * Number(extra_screens)
    const totalValue = basePrice + extraPrice

    // Here we would call the Asaas API to create the Payment Link / PIX code.
    // For MVP demonstration, we mock the Asaas response.
    const mockAsaasResponse = {
      id: `pay_${Math.random().toString(36).substring(7)}`,
      invoiceUrl: "https://sandbox.asaas.com/i/mock_invoice",
      value: totalValue,
      description: `Assinatura ${plan.name} + ${extra_screens} Telas Extras`
    }

    return new Response(
      JSON.stringify({ 
        message: "Fatura gerada via Asaas com sucesso", 
        payment: mockAsaasResponse 
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
