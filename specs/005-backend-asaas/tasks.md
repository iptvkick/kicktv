# Tasks: Backend & Asaas

## Fase 1: Configuração do Supabase e Banco de Dados
- [ ] Iniciar Supabase localmente (`npx supabase start`).
- [ ] Criar a migration SQL com as tabelas `profiles`, `servers`, `plans`, `devices`, `subscriptions` e as regras de RLS baseadas no `design.md`.
- [ ] Criar arquivo de *Seed* (dados iniciais) para inserir os servidores e planos padrão (os mesmos que hoje são mocks).
- [ ] Gerar as tipagens TypeScript (`supabase gen types`).

## Fase 2: Edge Functions & Asaas
- [ ] Criar Edge Function `create-checkout` para comunicar com API Asaas e gerar cobrança.
- [ ] Criar Edge Function `asaas-webhook` para processar `PAYMENT_RECEIVED` e ativar a assinatura.

## Fase 3: Refatoração do Frontend (Remoção dos Mocks)
- [ ] Atualizar `src/routes/admin/planos.tsx` para fazer CRUD via Supabase ao invés de usar `mockPlans`.
- [ ] Atualizar `src/routes/admin/servidores.tsx` para fazer CRUD via Supabase ao invés de usar `mockServers`.
- [ ] Atualizar `src/routes/admin/onboarding.tsx` para fazer CRUD na tabela `devices`.
- [ ] Atualizar Área do Cliente (`dashboard.tsx` e `tutorial.tsx`) para puxar do banco a assinatura ativa e as instruções do dispositivo.
