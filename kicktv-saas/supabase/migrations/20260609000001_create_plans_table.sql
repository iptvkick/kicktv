-- 6. Plans Table
create table public.plans (
    id uuid default uuid_generate_v4() primary key,
    nome text not null,
    descricao text,
    preco decimal not null,
    duracao_meses integer default 1,
    limite_telas integer default 1,
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

alter table public.plans enable row level security;
create policy "Admins gerenciam planos" on public.plans for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Qualquer pessoa pode ler planos ativos" on public.plans for select using (
  is_active = true
);

-- Insert initial mock plans
insert into public.plans (nome, descricao, preco, duracao_meses, limite_telas) values 
('Básico 1 Tela', 'Plano ideal para celular e TV no quarto.', 35.00, 1, 1),
('Ouro 2 Telas', 'Compartilhe com a família sem cortes.', 45.00, 1, 2),
('Diamante 4 Telas', 'Liberdade total para todos os dispositivos da casa.', 65.00, 1, 4);
