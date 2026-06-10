# Research: Global Swipe & Admin Architecture

## Contexto e Pedido
O usuário clarificou os requisitos após o último teste:
1. **Swipe nas Telas Principais:** O gesto de deslizar (swipe) não era para as sub-abas do Dashboard, e sim para navegar entre as telas principais do Menu Inferior (`Início`, `Player`, `Suporte`, `Perfil`).
2. **Separação do Perfil:** Os botões de "Dados Pessoais", "Pagamento" e "Segurança" estão espremidos no Dashboard (Início), o que causa quebra visual no mobile. O correto é que a tela "Perfil" seja o hub principal desses botões, e cada um abra sua respectiva tela limpa.
3. **Consolidação do Asaas:** A tela de `planos.tsx` deve centralizar as configurações do Asaas (API Keys) junto com a criação de planos, evitando múltiplas telas isoladas para o mesmo domínio.
4. **Gerenciamento de Usuários:** Falta uma tela no painel Admin exclusiva para listar os clientes, ver detalhes da assinatura e gerenciar acessos.

## Arquitetura Atual vs Necessária
- **Swipe Global:** Em `src/routes/cliente.tsx`, temos o `<Outlet />` padrão. Precisamos envolvê-lo num `AnimatePresence` com `motion.div` que escuta `onDragEnd` e dispara o `router.navigate` para a rota vizinha.
- **Limpeza do Dashboard:** `dashboard.tsx` ficará responsável APENAS pela exibição do status da conta, seleção do dispositivo e exibição dos tutoriais (Início).
- **Novas Rotas de Cliente:** O `perfil.tsx` será o menu principal. Teremos que criar rotas/componentes para `Pagamento` (Faturas) e `Segurança` atreladas ao perfil.
- **Admin Usuários:** Precisamos criar `src/routes/admin/usuarios.tsx` contendo uma tabela (TanStack Table) buscando dados das tabelas `profiles` e `subscriptions`.
- **Admin Planos:** Moveremos os inputs de `sandbox_key` e `production_key` do `configuracoes.tsx` para o topo ou aba do `planos.tsx`.
