# Spec 021: Design & Architecture (QA & RLS Fixes)

Nesta fase não alteraremos a UI, pois a UI do fluxo de checkout já está pronta e elegante. O foco do design aqui é **Arquitetura de Banco de Dados** e **Automação de Testes**.

## 1. Correção Definitiva de Banco de Dados (Supabase MCP)
As Edge Functions utilizam `supabaseAdmin` (Service Role Key) para contornar o RLS. Se mesmo assim a inserção falha com "permission denied", significa que:
1. O schema `public` está restringindo o privilégio `USAGE` do role `service_role`.
2. A tabela `subscriptions` não possui `GRANT INSERT ON public.subscriptions TO service_role`.

**Design da Solução DB:**
- Criaremos uma migration definitiva (ex: `20260610180000_fix_all_rls_grants.sql`) que roda:
```sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
```
*(Nota: RLS continuará protegendo as tabelas para anon/authenticated, mas os grants base garantem que a engine do Postgres não bloqueie queries válidas na origem).*

## 2. Automação de Testes (Backend Engineer)
Criaremos uma pasta `tests/` na raiz do projeto contendo um script local `checkout_test.ts` que simula a chamada à Edge Function sem precisar do navegador.

**Design da Solução de Testes:**
- Script Node/Deno que:
  1. Cria um usuário fake com `supabase.auth.signUp()`.
  2. Aciona a função `asaas-checkout`.
  3. Checa se o `data.pix` retornou a string Base64.
  4. Deleta o usuário de teste para manter o banco limpo.
