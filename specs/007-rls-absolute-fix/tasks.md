# Spec 007: RLS Absolute Fix & Asaas Engine - Tasks

## [x] Banco de Dados (`database-engineer`)
- [x] Conectar ao Supabase garantindo que o comando seja rodado contra a nuvem (via `--db-url "postgresql://..."` com a senha real `Mktfunil8563*`).
- [x] Aplicar as novas políticas (Policies) que liberam `SELECT USING (true)` em `subscription_plans`, `xtream_servers` e `onboarding_devices`.
- [x] Garantir que o email `admin@kicktv.com` possa fazer INSERT/UPDATE.

## [x] Backend (`backend-engineer`)
- [x] Acessar `supabase/functions/asaas-checkout/index.ts`.
- [x] Garantir que o código chame a API `https://sandbox.asaas.com/api/v3/customers` ou a de Produção, passando CPF e pegando o retorno para gerar o `subscriptions`.

## [x] Frontend (`frontend-engineer`)
- [x] Re-validar se os `inputs` de texto no admin (`planos`, `servidores`) têm a prop `value` apontando para um estado e um evento `onChange={(e) => setCampo(e.target.value)}`. Sem isso o React continuará mudo.
- [x] Testar a deleção e salvamento logo após o DB engineer destravar o RLS.
