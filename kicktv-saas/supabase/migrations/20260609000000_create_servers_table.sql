-- 5. Servers Table
create table public.servers (
    id uuid default uuid_generate_v4() primary key,
    nome text not null,
    url_painel text not null,
    limite_usuarios integer default 1000,
    status text default 'online' check (status in ('online', 'offline', 'manutencao')),
    ping integer default 15,
    created_at timestamp with time zone default now()
);

alter table public.servers enable row level security;
create policy "Admins gerenciam servers" on public.servers for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Insert initial mock servers
insert into public.servers (nome, url_painel, limite_usuarios, status, ping) values 
('Servidor BR Principal', 'painel.kicktv.com.br', 2000, 'online', 12),
('Painel USA 1', 'painel-us.kicktv.com', 500, 'online', 45);
