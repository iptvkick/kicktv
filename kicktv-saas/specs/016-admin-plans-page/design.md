# Arquitetura Visual e DB (016-admin-plans-page)

## Banco de Dados (Supabase)
### Migração: `03_create_plans_table.sql`
A tabela `plans` será criada para que as assinaturas e o pagamento (`payments`) saibam a que pacote o usuário pertence:
```sql
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
```

## Design System (Tailwind 2026 / Liquid Glass)

### Cards de Planos
Os planos serão exibidos em um Grid (Grid-cols-1 md:grid-cols-3).
- **Material:** `.glass-panel` (Bordas de vidro e sombra projetada suave).
- **Tipografia:** Preços em fontes generosas (`text-4xl font-black`), badges arredondadas para limites de tela.

### Correção CSS
- Removeremos a declaração `@plugin "tailwindcss-animate";` de `globals.css` ou garantiremos a sua importação via `postcss.config` localmente para evitar a falha de resolução do Webpack/Turbopack.
