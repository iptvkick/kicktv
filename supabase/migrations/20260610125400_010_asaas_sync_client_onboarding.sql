-- Fase 1: Asaas Sync & Client Onboarding

-- 1. Adicionar asaas_id em subscription_plans
ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS asaas_id VARCHAR;

-- 2. Garantir dispositivo_principal UUID em subscriptions
-- iptv_subscriptions já possui dispositivo_principal como texto em outras branches/migrations,
-- mas a tabela subscriptions moderna precisa receber isso como UUID referenciando onboarding_devices.

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS dispositivo_principal UUID REFERENCES public.onboarding_devices(id) ON DELETE SET NULL;

-- Atualizando iptv_subscriptions caso ainda esteja em uso ativo (se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'iptv_subscriptions'
    ) THEN
        -- Remove se for texto, e adiciona como uuid
        ALTER TABLE public.iptv_subscriptions 
        DROP COLUMN IF EXISTS dispositivo_principal;

        ALTER TABLE public.iptv_subscriptions 
        ADD COLUMN dispositivo_principal UUID REFERENCES public.onboarding_devices(id) ON DELETE SET NULL;
    END IF;
END $$;
