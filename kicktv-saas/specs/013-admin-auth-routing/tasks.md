# Tarefas e Implementação (013-admin-auth-routing)

## Fase 1: Limpeza do Código e Remoção de Scripts Quebrados
- [x] Inspecionar a raiz do projeto e isolar/excluir scripts soltos que não fazem parte do código ativo de produção (`fix_auth.js`, `create_api_user.js`, etc) caso não tenham mais serventia para evitar confusão contextual de IAs futuras.
- [x] Analisar `src/app/auth/login/page.tsx` para assegurar que a navegação pós-login está limpa e usa `useRouter`.

## Fase 2: Configuração do Supabase SSR Utility
- [x] Checar se `src/utils/supabase/server.ts` (ou a biblioteca SSR correta) existe e está configurada para gerenciar os cookies do Next.js.
- [x] Se não existir, instanciar usando `@supabase/ssr` (`createServerClient`) com a tipagem segura.

## Fase 3: Proteger Layout do Admin Server-Side
- [x] Abrir `src/app/admin/layout.tsx`.
- [x] Converter o componente para ser assíncrono (Async Server Component).
- [x] Injetar verificação `supabase.auth.getUser()`. Se falso, jogar para `/auth/login`.
- [x] Injetar verificação na tabela `profiles` pegando a role do `user.id`. Se for `cliente`, redirecionar para `/cliente/dashboard` via `redirect` da biblioteca `next/navigation`.

## Fase 4: Proteger Layout do Cliente Server-Side
- [x] Fazer a mesma injeção de segurança no `src/app/cliente/layout.tsx` (se existir). O usuário só pode ver essa rota se estiver autenticado.

## Fase 5: Testes Reais e Validação
- [ ] Rodar `npm run dev`.
- [ ] Validar tentativa de invasão em URL (`http://localhost:3000/admin`).
- [ ] Validar login com conta Admin e conta Cliente.
