# Tasks: Checkout e Ciclo de Vida do Assinante (Spec 019)

## Fase 1: Backend Fix (Backend Engineer)
- `[x]` Corrigir `supabase/functions/asaas-checkout/index.ts`: substituir `price_monthly` por `base_price` na query de planos
- `[x]` Garantir que a Edge Function suporte o campo `extraUsers` no body e some ao preço total
- `[x]` Fazer deploy das funções corrigidas

## Fase 2: Frontend — Hotfixes e Novas Telas (Frontend Engineer)
- `[x]` **Landing Page** (`routes/index.tsx`): buscar planos reais do Supabase e renderizar dinamicamente. Botão vai para `/auth/register` (trial gratuito).
- `[x]` **Onboarding** (`onboarding/tutorial.tsx`): fazer `upsert` em `profiles.full_name` ao confirmar nome. Substituir geração fake pela Edge Function `generate-trial`.
- `[x]` **Dashboard** (`cliente/dashboard.tsx`): exibir banner de trial/expirado com CTA para renovação.
- `[x]` **Nova tela centralizada** (`cliente/assinatura.tsx`): status da assinatura, seleção de plano real do banco, quantidade de telas (cálculo de preço ao vivo), botão de checkout PIX inline e histórico de faturas.
- `[x]` **Perfil** (`cliente/perfil.tsx`): remover lógicas de checkout antigas e apontar para a nova tela de assinatura.
- `[x]` Registrar a nova rota `cliente/assinatura` (via TanStack Router generator/dev server).

## Fase 3: QA
- `[ ]` Testes visuais nas telas de checkout e perfil.
- `[ ]` `npm run build` sem erros
- `[ ]` Commit e push para `main`
