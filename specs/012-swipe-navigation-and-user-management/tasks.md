# Tasks: Global Swipe & Admin Architecture

> ⛔ **REGRA DE OURO:** O Tech Lead não escreve código. Delegue as tarefas abaixo para o **Frontend Engineer**.

## Fase 1: Admin Architecture (Frontend Engineer)
- `[ ]` Criar o arquivo `src/routes/admin/usuarios.tsx` com uma tabela buscando `profiles` e fazendo display do status da assinatura de `subscriptions`.
- `[ ]` Atualizar `src/routes/admin.tsx` adicionando o `<Link>` com o ícone `<Users>` para a nova rota `/admin/usuarios`.
- `[ ]` Atualizar a aba de "Configurações Asaas" no Sidebar para não apontar mais para uma tela isolada, e sim para a aba geral de planos. No arquivo `src/routes/admin/planos.tsx`, migrar todo o código da página de configurações (os inputs de Sandbox/Prod Key que eram salvos em `integrations`), criando um Card Acordeão ou Sub-Menu fixo no topo da página.

## Fase 2: Client Perfil Splitting (Frontend Engineer)
- `[ ]` Limpar `src/routes/cliente/dashboard.tsx` removendo as abas de `activeTab` ("Pagamento" e "Segurança"). O Dashboard agora exibe apenas a interface de Início.
- `[ ]` Refatorar `src/routes/cliente/perfil.tsx`. Implementar a exibição expansível para os botões "Dados Pessoais", "Métodos de Pagamento" e "Segurança". Ao clicar, o conteúdo real das faturas (que foi retirado do dashboard) deve renderizar dentro do Perfil (seja via AnimatePresence renderizando o conteúdo ou via sub-rotas).

## Fase 3: Global Navigation Swipe (Frontend Engineer)
- `[ ]` Em `src/routes/cliente.tsx`, envolver o `<Outlet />` com um container `framer-motion` (ex: `<AnimatePresence>` e `<motion.div>`).
- `[ ]` Utilizar `useLocation` para identificar a rota atual entre as 4 principais: `['/cliente/dashboard', '/cliente/player', '/cliente/suporte', '/cliente/perfil']`.
- `[ ]` Capturar `onDragEnd` e caso o arraste horizontal (swipe) supere o limitador, usar `router.navigate({ to: novaRota })` criando a transição de slide horizontal estilo App Nativo.

## Fase 4: QA (Deploy Engineer)
- `[ ]` Executar `npm run build` para checar se as refatorações de rotas quebraram algum pathing do TanStack Start.
