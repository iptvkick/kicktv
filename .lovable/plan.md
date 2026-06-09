
# Migração KickTV: Next.js (subpasta) → TanStack Start (raiz)

## Problema

Existem dois projetos. A Lovable só roda o da **raiz** (TanStack Start), mas você está editando o da **subpasta `kicktv-saas/`** (Next.js). Por isso "nada muda" no preview.

## Estado atual

**Raiz (rodando):** rotas básicas `index`, `cliente/*`, `admin/*`, `auth/*`, `onboarding/*`, `suporte`. Componentes UI mínimos (shadcn). Supabase conectado, com tabelas já criadas (`profiles`, `servers`, `subscriptions`, `plans`, `devices`, `system_settings`, `onboarding_*`, `xtream_servers`, `subscription_plans`).

**Subpasta `kicktv-saas/` (ignorada):** todas as páginas reais — admin dashboard com métricas, planos, servidores, tutoriais, admin-promote; cliente dashboard/perfil/player/suporte; auth/login; componentes `AdminSidebar`, `BottomNavBar`, `PageTransition`, `FloatingNav`.

## Plano

### 1. Auth (base de tudo)
- Criar `src/hooks/useAuth.ts` (cliente Supabase, `onAuthStateChange`, `signIn`, `signOut`).
- `src/routes/auth/login.tsx` portado do Next.js: email/senha, redireciona conforme `role` da tabela `profiles`.
- `src/routes/auth/register.tsx` (já existe esqueleto — preencher).
- Layout `_authenticated` para gating client-side (`ssr: false`) já recomendado pelo TanStack.

### 2. Server functions (substituir SSR do Next)
Em `src/lib/`:
- `admin.functions.ts` — `getDashboardStats` (ativos, trials, receita mensal, conversão), `getRecentSubscriptions`, `listServers`, `listPlans`, `listDevices/Tutoriais`.
- `cliente.functions.ts` — `getMySubscription`, `getMyProfile`, `updateProfile`, `getXtreamCreds`.
- `support.functions.ts` — `createTicket`, `listMyTickets`.
- Todas com `requireSupabaseAuth`; admin checa role via `has_role` ou função `is_admin()` já existente.

### 3. Migration Supabase (faltando)
Tabelas que o admin antigo usa mas não existem no schema atual:
- `iptv_subscriptions` (xtream_username/password, data_vencimento, url_servidor, dispositivo_principal, status)
- `payments` (valor, status, metodo, gateway_id)
- `support_tickets` (categoria, mensagem, status)
- `user_roles` enum + tabela (segurança correta — hoje role está em `profiles`, vou mover/duplicar para `user_roles` com função `has_role` SECURITY DEFINER).

Cada uma com GRANTs + RLS.

### 4. Componentes UI portados
Em `src/components/`:
- `AdminSidebar.tsx` — adaptar `next/link` → `@tanstack/react-router` `Link`; usar `useRouterState` para active state.
- `BottomNavBar.tsx` — idem.
- `PageTransition.tsx` — framer-motion (já instalado).
- shadcn adicionais conforme necessário (`badge`, `dialog`, `dropdown-menu`, `table`, `tabs`, `toast/sonner`).

### 5. Rotas portadas (estrutura final)

```text
src/routes/
  __root.tsx
  index.tsx                          (landing — já existe)
  auth/
    login.tsx
    register.tsx
  _authenticated/
    route.tsx                        (gate ssr:false)
    cliente/
      dashboard.tsx
      perfil.tsx
      player.tsx
      suporte.tsx
    admin/
      route.tsx                      (checa role admin → redirect /cliente)
      index.tsx                      (dashboard com métricas)
      planos.tsx
      servidores.tsx
      tutoriais.tsx
      promote.tsx                    (ex-admin-promote)
```

### 6. Limpeza
- Remover `kicktv-saas/` inteiro depois que a paridade visual+funcional estiver confirmada (sob seu OK).
- Remover `vite.config.timestamp_*.js` (lixo de cache).
- Garantir que `package.json` na raiz tem todas as deps necessárias (`@radix-ui/*` para shadcn extras, `sonner`, `class-variance-authority`).

### 7. Validação
- `bunx vite build` limpo.
- Login admin → `/admin` carrega métricas reais do Supabase.
- Login cliente → `/cliente/dashboard` mostra assinatura.
- Tentativa de URL forçada respeita o gate.

## Escopo desta entrega

Vou executar tudo acima **em uma passada**, começando pela migration Supabase (precisa de aprovação sua antes do código rodar), depois server functions, depois rotas/UI, e por fim limpeza da subpasta.

## Detalhes técnicos

- **Por que `_authenticated` com `ssr: false`?** A sessão Supabase fica em `localStorage`, indisponível no servidor. SSR gating causa loop de redirect.
- **Por que `user_roles` separado?** Storar role em `profiles` permite escalonamento de privilégio. Padrão Supabase é tabela própria + função `has_role` SECURITY DEFINER (já existe `is_admin()` aqui, mas lê `profiles.role` — vou refatorar).
- **Por que server functions e não edge functions?** TanStack Start tem runtime próprio; edge functions só pra webhooks externos (ex.: Asaas).
- Webhooks Asaas (`asaas-checkout`, `asaas-webhook`, `generate-trial`, `renew-subscription`) já existem em `supabase/functions/` e ficam onde estão.
