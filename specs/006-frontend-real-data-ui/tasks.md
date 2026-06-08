# Tasks: Frontend Real Data & Liquid UI

## Fase 1: Admin Seed
- [x] Criar script na raiz (ou SQL) para gerar o usuário `iptvkick@gmail.com` com senha `David9560_` diretamente no Supabase Auth, e logo em seguida atualizar a tabela `profiles` com `role = 'admin'`.

## Fase 2: Layout Base e Navegação
- [x] Editar `src/app/layout.tsx` (ou arquivo base da rota atual) para adicionar os limites de tela no PC (`max-w-3xl mx-auto`, `min-h-screen`, `bg-zinc-950`).
- [x] Substituir o componente atual do `BottomNavBar` pelo código Framer Motion fornecido pelo usuário.
- [x] Adicionar lógica no `BottomNavBar` que verifica o `role` do usuário (via Contexto ou chamada de DB) e injeta o array de ícones correto (Admin vs Cliente).

## Fase 3: Dashboard Real & Refatoração
- [x] Editar `/cliente/dashboard` para remover `mockPlans` e `mockServers`.
- [x] Fazer query na tabela `subscriptions` vinculada ao `auth.uid()`, cruzando com `plans` e `servers` para obter o plano ativo e dados do servidor M3U.

## Fase 4: Telas Secundárias do Cliente
- [x] Implementar a tela de **Player** (`/cliente/player`): Se for apenas placeholder por enquanto, colocar um layout de Liquid Glass limpo avisando que será ativado, mas usando a fonte e UI corretas.
- [x] Implementar a tela de **Suporte** (`/cliente/suporte`): Adicionar links dinâmicos para WhatsApp ou FAQ baseado no Supabase (se houver) ou botões fluidos.
- [x] Implementar a tela de **Perfil** (`/cliente/perfil`): Opção de ver email e realizar logout.
