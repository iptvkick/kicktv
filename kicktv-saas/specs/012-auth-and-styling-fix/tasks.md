# Tarefas e Implementação (012-auth-and-styling-fix)

## Fase 1: Correção do Estilo Visual
- [x] Inspecionar as importações no `src/routes/__root.tsx` e garantir que o import do `src/styles.css` não esteja sendo omitido ou mascarado incorretamente.
- [x] Checar dependências e configurações base do Tailwind v4 (`@tailwindcss/vite`) no `vite.config.ts`.
- [x] Rodar o servidor Vite temporariamente para confirmar visualmente (em terminal ou por log) que a renderização do site original se restabeleceu.

## Fase 2: Roteamento da Landing Page
- [x] Inspecionar `src/routes/index.tsx` e localizar a Navbar principal e a seção Hero.
- [x] Adicionar botão claro para "Login" roteando para `/auth/login`.
- [x] Ajustar ou adicionar botão de "Testar Grátis / Novo Usuário" roteando para `/auth/register` ou passando parâmetros que facilitem a conversão.

## Fase 3: Regras e Redirecionamento de Auth
- [x] No arquivo `/auth/login.tsx`, revisar o handler de submissão do formulário (`onSubmit`).
- [x] Após a chamada de validação (Supabase / local context), verificar o perfil do usuário logado e efetuar o `redirect` ou `navigate` (`useNavigate` do TanStack Router) adequadamente:
  - Ir para `/admin` em caso de administradores.
  - Ir para `/cliente/dashboard` em caso de cliente comum.
- [x] No arquivo `/auth/register.tsx`, certificar que após a criação bem sucedida, o usuário não fique preso e seja direcionado para uma rota pertinente (ex: tela de `/cliente/dashboard` recém logada, ou onboarding de pagamento).

## Fase 4: Validação
- [x] Verificar se as páginas `/cliente/dashboard` e `/admin` possuem guardas lógicas de bloqueio caso um usuário não-autenticado tente acessá-las diretamente por URL, evitando renderizações quebradas e brechas de segurança.
