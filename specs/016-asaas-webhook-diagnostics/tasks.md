# Tasks: Asaas Integrations (Spec 016)

> ⛔ **REGRA DE OURO:** Delegar.

## Fase 1: Cloud Deployment (Deploy Engineer)
- `[ ]` Fazer o deploy da Edge Function `asaas-ping-test` executando o comando da Supabase CLI: `npx supabase functions deploy asaas-ping-test --no-verify-jwt`.
- `[ ]` Validar se há outras funções (ex: `asaas-checkout` ou `asaas-sync`) que foram modificadas ou criadas mas nunca sofreram deploy, e se houver, realizar o deploy delas também.

## Fase 2: Diagnostics & QA (Backend Engineer)
- `[ ]` Analisar o log retornado pelo comando de deploy e confirmar que a infraestrutura subiu com sucesso.
- `[ ]` Revisar brevemente o código de `asaas-webhook/index.ts` (caso exista) para atestar que a barreira de verificação do header `asaas-access-token` está de pé, e não apenas confiando em IPs estáticos.
- `[ ]` Orientar o usuário a dar o próximo clique na tela de Admin.
