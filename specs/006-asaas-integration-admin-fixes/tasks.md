# Spec 006: Asaas Deep Integration & Admin Fixes - Tasks

## [x] Backend / Edge Functions (`backend-engineer`)
- [x] Criar a Edge Function `asaas-checkout` que recebe plano escolhido, cria Customer e Subscription no Asaas.
- [x] Criar a Edge Function `asaas-webhook` para escutar notificações do Asaas e aprovar acessos no Supabase.

## [x] Banco de Dados / Segurança (`database-engineer`)
- [x] Inserir o `admin@kicktv.com` (e os devidos perfis) na tabela `user_roles` como `'admin'` para parar com o erro de 403 Forbidden no painel de administração.
- [x] Revisar as policies de RLS das tabelas de `subscription_plans` e `onboarding_devices` garantindo leitura irrestrita aos usuários logados.

## [x] Frontend UI (`frontend-engineer`)
- [x] Resolver definitivamente o Bug dos Inputs Inativos: Em `planos.tsx`, `servidores.tsx` e `onboarding.tsx`, criar os estados com `onChange={(e) => setState(e.target.value)}`.
- [x] Criar modal de Checkout em `/cliente` para capturar CPF e processar o pagamento Asaas via Edge Function.
