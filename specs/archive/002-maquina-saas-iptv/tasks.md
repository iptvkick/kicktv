# Fase 1: A Máquina de SaaS IPTV - Tasks

Estas tarefas deverão ser orquestradas paralelamente entre os agentes utilizando a diretriz `vibe-apply`.

## [x] Backend / Edge Functions (`backend-engineer`)
- [x] Configurar variáveis de ambiente (`XTREAM_URL`, `XTREAM_USER`, `XTREAM_PASS`, `PAYMENT_WEBHOOK_SECRET`) no Supabase.
- [x] Criar Edge Function `create-trial` em Deno/TS:
  - Validar JWT do usuário solicitante.
  - Criar payload para `api.php?action=user&sub=add` da Xtream.
  - Atualizar o status do usuário em `profiles`.
  - Retornar sucesso.
- [x] Criar Edge Function `payment-webhook` em Deno/TS:
  - Validar assinatura do header de webhook.
  - Alterar o `subscription_status` na base de dados e chamar a Xtream API para prolongar os dias.

## [x] Database / Migrations (`database-engineer`)
- [x] Criar migration SQL adicionando as tabelas: `onboarding_devices`, `onboarding_steps`, `subscription_plans`, `support_solutions`.
- [x] Criar policies de RLS para essas tabelas (Admin pode tudo, User autenticado pode ler onboarding e support).
- [x] Inserir os SEEDS de dados dinâmicos baseados na pesquisa técnica de Phase 1 (Tutoriais do Roku Sideload, Firestick 272483, DNS Samsung 8.8.8.8).
- [x] Rodar `supabase gen types typescript --local` para atualizar o `src/integrations/supabase/types.ts`.

## [x] Frontend UI / Componentes (`frontend-engineer`)
- [x] **Onboarding Dinâmico:** Criar componente de fluxo multi-step (TanStack Router) que fará o fetch de `onboarding_devices` e renderizará os passos de `onboarding_steps` sequencialmente.
- [x] **Integração Trial:** Adicionar botão final "Instalei, Gerar Teste" que invoca a Edge Function via `@supabase/supabase-js`. Mostrar as credenciais em um modal de destaque com botão de copiar (Dark Technical theme).
- [x] **Portal Admin (CMS):** Criar tela restrita a role "admin" com tabelas TanStack para CRUD de dispositivos, tutoriais de erro (DNS/Cache) e planos de assinatura.
- [x] **Tela de Troubleshooting:** Interface clean para o cliente clicar em "Resolver Travamento" e visualizar a query de `support_solutions` correspondente à TV dele.

## [ ] Deploy & QA (`deploy-engineer`)
- [ ] Executar build de verificação TypeScript (`npm run build`).
- [ ] Commitar alterações das migrações e do frontend (`git add -A` e `git commit -m "feat: implementa maquina de SaaS dinamica"`).
- [ ] Push seguro para branch `main` do GitHub iptvkick/kicktv.
