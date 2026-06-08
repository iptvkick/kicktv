-- Supabase Migration: Create Core Schema for KickTV SaaS

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('admin', 'client');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled');

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role DEFAULT 'client'::user_role NOT NULL,
  asaas_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Servers Table
CREATE TABLE public.servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  m3u_url TEXT NOT NULL,
  dns_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Plans Table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_monthly NUMERIC(10,2) NOT NULL,
  features JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Devices Table
CREATE TABLE public.devices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  video_url TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Subscriptions Table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  server_id UUID REFERENCES public.servers(id) ON DELETE RESTRICT NOT NULL,
  status subscription_status DEFAULT 'trialing'::subscription_status NOT NULL,
  asaas_subscription_id TEXT,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies: Servers (Read public, Write Admin)
CREATE POLICY "Servers are viewable by everyone" 
ON public.servers FOR SELECT USING (true);

CREATE POLICY "Admins can insert servers" 
ON public.servers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update servers" 
ON public.servers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete servers" 
ON public.servers FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies: Plans (Read public, Write Admin)
CREATE POLICY "Plans are viewable by everyone" 
ON public.plans FOR SELECT USING (true);

CREATE POLICY "Admins can manage plans" 
ON public.plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies: Devices (Read public, Write Admin)
CREATE POLICY "Devices are viewable by everyone" 
ON public.devices FOR SELECT USING (true);

CREATE POLICY "Admins can manage devices" 
ON public.devices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies: Subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage subscriptions" 
ON public.subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Database Function: Handle New User Registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_server_id UUID;
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');

  -- 2. Find a default active server for the trial
  SELECT id INTO default_server_id FROM public.servers WHERE is_active = true LIMIT 1;

  -- 3. Create 4-hour Trial Subscription automatically
  IF default_server_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (profile_id, server_id, status, starts_at, expires_at)
    VALUES (new.id, default_server_id, 'trialing', now(), now() + interval '4 hours');
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a user is created in Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

