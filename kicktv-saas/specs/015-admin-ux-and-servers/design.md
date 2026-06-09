# Arquitetura Visual e DB (015-admin-ux-and-servers)

## Banco de Dados (Supabase)
### Migração: `02_create_servers_table.sql`
Precisamos criar a tabela `servers`:
```sql
create table public.servers (
    id uuid default uuid_generate_v4() primary key,
    nome text not null,
    url_painel text not null,
    limite_usuarios integer default 1000,
    status text default 'online' check (status in ('online', 'offline', 'manutencao')),
    created_at timestamp with time zone default now()
);

alter table public.servers enable row level security;
create policy "Admins gerenciam servers" on public.servers for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
```

## Design System (Stitch MCP / Tailwind 2026)

### Transição de Telas
Modificaremos o `PageTransition` para aceitar um comportamento diferente baseado na rota.
- **Admin**: `scale: 0.98` levemente para `1` e `opacity: 0` para `1`. Duração 0.2s. Sem `x` lateral.
- **Cliente**: Mantém o deslize lateral original se necessário, ou unifica tudo para Web Corporativo.

### Skeletons (`loading.tsx`)
O arquivo `src/app/admin/loading.tsx` renderizará blocos acinzentados pulsantes (`animate-pulse bg-gray-100`) nas proporções exatas da Dashboard e telas secundárias, evitando reflow de layout.
O `<main>` já existe no `layout.tsx`, logo o `loading.tsx` substitui apenas o `children`.

### Lista de Servidores (Página `/admin/servidores`)
- Tirar do modo de desenvolvimento.
- Exibir uma `Grid` ou `Table` contendo a lista dos servidores da nova tabela.
- Usar a estética "Liquid Glass" com bordas `.border-gray-100`, shadow macio, badges de status (`bg-emerald-100 text-emerald-700` para Online).
