-- 1. Create user_roles if missing and insert admin
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'client', 'moderator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Admins can manage user roles'
    ) THEN
        CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'admin@kicktv.com'
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@kicktv.com';

-- 2. Create asaas_customers and subscriptions_log
CREATE TABLE IF NOT EXISTS public.asaas_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    asaas_customer_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(profile_id)
);

CREATE TABLE IF NOT EXISTS public.subscriptions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.asaas_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions_log ENABLE ROW LEVEL SECURITY;

-- 3. Fix RLS for subscription_plans, onboarding_devices, xtream_servers, onboarding_steps
-- helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing policies
DROP POLICY IF EXISTS "subscription_plans are viewable by everyone" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admins can manage subscription_plans" ON public.subscription_plans;

DROP POLICY IF EXISTS "onboarding_devices are viewable by authenticated users" ON public.onboarding_devices;
DROP POLICY IF EXISTS "Admins can manage onboarding_devices" ON public.onboarding_devices;

DROP POLICY IF EXISTS "onboarding_steps are viewable by authenticated users" ON public.onboarding_steps;
DROP POLICY IF EXISTS "Admins can manage onboarding_steps" ON public.onboarding_steps;

DROP POLICY IF EXISTS "Xtream viewable by admin only" ON public.xtream_servers;
DROP POLICY IF EXISTS "Xtream modifiable by admin only" ON public.xtream_servers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subscription_plans;
DROP POLICY IF EXISTS "Enable write access for admins" ON public.subscription_plans;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.onboarding_devices;
DROP POLICY IF EXISTS "Enable write access for admins" ON public.onboarding_devices;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.onboarding_steps;
DROP POLICY IF EXISTS "Enable write access for admins" ON public.onboarding_steps;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.xtream_servers;
DROP POLICY IF EXISTS "Enable write access for admins" ON public.xtream_servers;

-- Recreate policies with public/authenticated read and admin write

-- subscription_plans
CREATE POLICY "Enable read access for all users" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Enable write access for admins" ON public.subscription_plans FOR ALL USING (public.is_super_admin());

-- onboarding_devices
CREATE POLICY "Enable read access for all users" ON public.onboarding_devices FOR SELECT USING (true);
CREATE POLICY "Enable write access for admins" ON public.onboarding_devices FOR ALL USING (public.is_super_admin());

-- onboarding_steps
CREATE POLICY "Enable read access for all users" ON public.onboarding_steps FOR SELECT USING (true);
CREATE POLICY "Enable write access for admins" ON public.onboarding_steps FOR ALL USING (public.is_super_admin());

-- xtream_servers
CREATE POLICY "Enable read access for authenticated users" ON public.xtream_servers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable write access for admins" ON public.xtream_servers FOR ALL USING (public.is_super_admin());

-- asaas_customers & subscriptions_log basic policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'asaas_customers' AND policyname = 'Users can view own asaas customers'
    ) THEN
        CREATE POLICY "Users can view own asaas customers" ON public.asaas_customers FOR SELECT USING (profile_id = auth.uid());
        CREATE POLICY "Admins can manage asaas customers" ON public.asaas_customers FOR ALL USING (public.is_super_admin());
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions_log' AND policyname = 'Users can view own logs'
    ) THEN
        CREATE POLICY "Users can view own logs" ON public.subscriptions_log FOR SELECT USING (profile_id = auth.uid());
        CREATE POLICY "Admins can manage logs" ON public.subscriptions_log FOR ALL USING (public.is_super_admin());
    END IF;
END $$;
