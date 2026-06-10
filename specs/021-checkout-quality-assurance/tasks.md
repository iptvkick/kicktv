# Tasks: QA & RLS Fixes (Spec 021)

## Fase 1: Database Audit & Fixes (Database Engineer)
- `[x]` Criar migration `supabase/migrations/20260610183000_fix_all_rls_grants.sql`.
- `[x]` Inserir na migration os comandos de `GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;` garantindo que o banco de dados nunca vai barrar as Edge Functions baseadas na restrição fundamental da engine.
- `[x]` Revisar se a tabela `subscriptions` tem a Foreign Key correta com `profiles` usando `user_id`.
- `[x]` Rodar `npx supabase db push` para aplicar a migration.

## Fase 2: Backend Automation & Testing (Backend Engineer)
- `[x]` Criar o diretório `tests/` na raiz do projeto (se não existir).
- `[x]` Criar um script Node/Deno chamado `tests/test_asaas_checkout.ts`.
- `[x]` Implementar o script utilizando `supabase-js` para logar com credenciais de teste, chamar a Edge Function `asaas-checkout` com um CPF simulado válido (ou pegar as credenciais Asaas sandbox).
- `[x]` Rodar o script usando `npx ts-node` ou `deno run` no terminal para certificar que o script retorna um PIX QR Code de sucesso (Status 200) e que uma linha real aparece na tabela `subscriptions` do Supabase.

## Fase 3: QA Final (QA Engineer / Deploy Engineer)
- `[x]` Se todos os testes passarem sem o menor erro, criar um commit de estabilidade.
- `[x]` Rodar `npm run build` para garantir que as mudanças nas tipagens/interfaces não quebraram o frontend.
