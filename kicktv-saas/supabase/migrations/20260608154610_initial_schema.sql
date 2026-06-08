-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table public.profiles (
    id uuid references auth.users(id) primary key,
    nome text not null,
    whatsapp text,
    role text default 'cliente' check (role in ('cliente', 'admin')),
    created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );
create policy "Admins can view all profiles" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 2. IPTV Subscriptions
create table public.iptv_subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    xtream_username text not null,
    xtream_password text not null,
    status text default 'trial' check (status in ('trial', 'ativo', 'vencido', 'bloqueado')),
    dispositivo_principal text,
    data_vencimento timestamp with time zone not null,
    url_servidor text not null,
    created_at timestamp with time zone default now()
);

alter table public.iptv_subscriptions enable row level security;
create policy "Users view own subscriptions" on public.iptv_subscriptions for select using ( auth.uid() = user_id );
create policy "Admins manage subscriptions" on public.iptv_subscriptions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. Payments (Asaas)
create table public.payments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    valor decimal not null,
    status text default 'pendente' check (status in ('pendente', 'pago', 'falhou')),
    metodo text default 'pix' check (metodo in ('pix', 'cartao')),
    gateway_id text, -- ID da transação no Asaas
    created_at timestamp with time zone default now()
);

alter table public.payments enable row level security;
create policy "Users view own payments" on public.payments for select using ( auth.uid() = user_id );
create policy "Admins manage payments" on public.payments for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. Support Tickets (Self-Healing)
create table public.support_tickets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    categoria text check (categoria in ('travamento', 'configuracao_dns', 'financeiro', 'outro')),
    mensagem text not null,
    status text default 'aberto' check (status in ('aberto', 'resolvido')),
    created_at timestamp with time zone default now()
);

alter table public.support_tickets enable row level security;
create policy "Users view own tickets" on public.support_tickets for select using ( auth.uid() = user_id );
create policy "Users create own tickets" on public.support_tickets for insert with check ( auth.uid() = user_id );
create policy "Admins manage tickets" on public.support_tickets for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
