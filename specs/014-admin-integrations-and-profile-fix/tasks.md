# Tasks: Admin Integrations & Profile Fix (Spec 014)

> ⛔ **REGRA DE OURO:** Delegar.

## Fase 1: Database (Database Engineer)
- `[ ]` Criar migration SQL adicionando a coluna `full_name` (`VARCHAR`) em `profiles`.
- `[ ]` Atualizar o `types.ts` incluindo `full_name?: string | null`.

## Fase 2: Backend/Edge Functions (Backend Engineer)
- [x] Criar uma nova Edge Function `asaas-ping-test` em `supabase/functions/asaas-ping-test/index.ts`. Esta função fará uma requisição GET simples para a API do Asaas usando a chave armazenada em `integrations` para validar se a conexão está OK.

## Fase 3: Frontend (Frontend Engineer)
- `[ ]` Criar `src/routes/admin/integracoes.tsx`.
- `[ ]` Adicionar o ícone e link de `<Plug>` ("Integrações") no menu lateral em `src/routes/admin.tsx`.
- `[ ]` Em `integracoes.tsx`, construir um Guide View elegante contendo o Passo a Passo de como pegar as credenciais do Asaas.
- `[ ]` Adicionar na mesma tela um painel de Teste de Conexão contendo um botão que dispara a função `asaas-ping-test` e retorna visualmente `[Sucesso/Ativo]` ou `[Erro de Autenticação]`.
