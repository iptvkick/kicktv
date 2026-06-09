-- Migration: Maquina SaaS IPTV
-- Includes onboarding flow, subscription plans, and support solutions.

CREATE TABLE public.onboarding_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_name TEXT,
    order_index INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.onboarding_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES public.onboarding_devices(id) ON DELETE CASCADE,
    step_number INT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_url TEXT,
    shortcode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    price DECIMAL(10,2),
    duration_days INT,
    xtream_package_id INT,
    benefits JSONB,
    is_highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.support_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_type TEXT,
    device_type TEXT,
    resolution_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.onboarding_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_solutions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. onboarding_devices: Authenticated read, Admin write
CREATE POLICY "onboarding_devices are viewable by authenticated users" 
ON public.onboarding_devices FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage onboarding_devices" 
ON public.onboarding_devices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. onboarding_steps: Authenticated read, Admin write
CREATE POLICY "onboarding_steps are viewable by authenticated users" 
ON public.onboarding_steps FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage onboarding_steps" 
ON public.onboarding_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. subscription_plans: Public read, Admin write (plans are usually public)
CREATE POLICY "subscription_plans are viewable by everyone" 
ON public.subscription_plans FOR SELECT USING (true);

CREATE POLICY "Admins can manage subscription_plans" 
ON public.subscription_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. support_solutions: Authenticated read, Admin write
CREATE POLICY "support_solutions are viewable by authenticated users" 
ON public.support_solutions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage support_solutions" 
ON public.support_solutions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- SEEDS
INSERT INTO public.onboarding_devices (id, name, icon_name, order_index, is_active)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Roku TV', 'Tv', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'Firestick / Android TV', 'Monitor', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'Samsung Smart TV', 'MonitorPlay', 3, true);

INSERT INTO public.onboarding_steps (device_id, step_number, title, description, shortcode)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 1, 'Ativar Modo Desenvolvedor', 'Aperte no controle remoto: Home (3x), Cima (2x), Direita, Esquerda, Direita, Esquerda, Direita. Anote o IP que aparecer na tela.', NULL),
  ('11111111-1111-1111-1111-111111111111', 2, 'Instalar o App via IP', 'No celular, acesse `http://SEU_IP`, faça login com o usuário `rokudev` e faça o upload do arquivo .zip disponibilizado.', NULL),
  ('22222222-2222-2222-2222-222222222222', 1, 'Baixar app Downloader', 'Instale o aplicativo oficial "Downloader" pela loja de aplicativos do seu aparelho.', NULL),
  ('22222222-2222-2222-2222-222222222222', 2, 'Instalar via Shortcode', 'Abra o Downloader e digite o código **272483**. O download começará automaticamente.', '272483');

INSERT INTO public.support_solutions (issue_type, device_type, resolution_text)
VALUES 
  ('travamento', 'Samsung Smart TV', 'Sua operadora de internet (Claro, Vivo) pode estar bloqueando a conexão (Traffic Shaping). Vá em Configurações de IP > DNS e altere para 8.8.8.8 (Google) ou 1.1.1.1 (Cloudflare).');
