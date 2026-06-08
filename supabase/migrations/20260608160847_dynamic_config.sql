-- Fase 1 do Spec 002: Configurações Dinâmicas Globais

-- 1. system_settings
create table public.system_settings (
    key text primary key,
    value jsonb not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table public.system_settings enable row level security;
create policy "Settings viewable by admin and service_role only" on public.system_settings for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Settings insertable by admin" on public.system_settings for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Settings updatable by admin" on public.system_settings for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 2. xtream_servers
create table public.xtream_servers (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    url text not null,
    username text not null,
    password text not null,
    priority int not null default 1, -- 1=Principal, 2=Fallback
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

alter table public.xtream_servers enable row level security;
create policy "Xtream viewable by admin only" on public.xtream_servers for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Xtream modifiable by admin only" on public.xtream_servers for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. subscription_plans
create table public.subscription_plans (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    duration_months int not null,
    base_price decimal not null,
    extra_screen_price decimal not null,
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

alter table public.subscription_plans enable row level security;
create policy "Plans viewable by public" on public.subscription_plans for select using ( true );
create policy "Plans modifiable by admin only" on public.subscription_plans for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. onboarding_devices
create table public.onboarding_devices (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    icon_name text not null,
    order_index int default 0,
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

alter table public.onboarding_devices enable row level security;
create policy "Devices viewable by public" on public.onboarding_devices for select using ( true );
create policy "Devices modifiable by admin only" on public.onboarding_devices for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 5. onboarding_steps
create table public.onboarding_steps (
    id uuid default uuid_generate_v4() primary key,
    device_id uuid references public.onboarding_devices(id) on delete cascade not null,
    step_number int not null,
    title text not null,
    description text not null,
    media_url text,
    created_at timestamp with time zone default now()
);

alter table public.onboarding_steps enable row level security;
create policy "Steps viewable by public" on public.onboarding_steps for select using ( true );
create policy "Steps modifiable by admin only" on public.onboarding_steps for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- SCRIPT DE SEEDING (Valores Padrão para não quebrar o front)
insert into public.system_settings (key, value) values
('trial_duration_hours', '4'),
('playlist_base_name', '"KickTV Premium"');

insert into public.subscription_plans (name, duration_months, base_price, extra_screen_price) values
('Plano Mensal', 1, 35.00, 10.00),
('Plano Trimestral', 3, 90.00, 25.00),
('Plano Anual', 12, 300.00, 100.00);

insert into public.xtream_servers (name, url, username, password, priority) values
('Servidor Master (Exemplo)', 'http://cms.master.com', 'admin', 'admin', 1);

insert into public.onboarding_devices (name, icon_name, order_index) values
('Smart TV', 'Tv', 1),
('Celular / Tablet', 'Smartphone', 2),
('Computador', 'Monitor', 3);
