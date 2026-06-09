# Tasks: SDD Reversion & Lógica Admin

## Fase 1: Reversão de Cores (SDD Compliance) no Next.js
- [ ] Editar `kicktv-saas/src/app/layout.tsx` e `kicktv-saas/src/app/cliente/layout.tsx` para forçar os fundos brancos/cinzas (`bg-zinc-50` global, `bg-white` para o contêiner mobile centralizado).
- [ ] Reverter as cores do `BottomNavBar.tsx` (remover o brilho neon, usar pílula `bg-zinc-900` com texto `white` nos botões ativos, e texto `zinc-400` para os inativos).
- [ ] Reverter as telas do Cliente (`dashboard`, `player`, `perfil`, `suporte`) em `kicktv-saas` para a identidade visual clara.

## Fase 2: Fix do Fluxo de Login
- [ ] Localizar ou criar a lógica de Login no Next.js (`kicktv-saas`).
- [ ] Inserir o redirecionamento baseado no `role` retornado da tabela `profiles`.
- [ ] Garantir que o botão de "Sair da Conta" (Logout) no Perfil e na NavBar de Admin seja visível e destrutivo (redirecionando para a landing page).

## Fase 3: Telas de Admin Básicas
- [ ] Criar e popular a tela `/admin/dashboard/page.tsx` com as estatísticas básicas (mesmo que mockadas inicialmente) usando a tipografia e padrão visual limpo.
- [ ] Atualizar o `layout.tsx` do Admin para renderizar o layout centralizado, da mesma forma que o cliente, apenas alterando as permissões.
