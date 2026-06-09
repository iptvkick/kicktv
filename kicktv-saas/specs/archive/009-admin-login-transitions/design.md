# Design: UX Dinâmica e Role Management

## 1. Gestão de Roles (Banco de Dados)
- Não haverá alteração no código do Frontend para forçar um administrador, pois isso compromete a segurança.
- A criação do primeiro Admin será feita via intervenção no banco de dados, alterando a `role` do `profile` no Supabase via script SQL ou interface gráfica.

## 2. Transições Espaciais (Framer Motion)
O conceito de "Transição Direcional" baseia-se na ordem dos botões do Menu Inferior (Bottom NavBar) ou Lateral (Sidebar):
1. Início (Index 0)
2. Player (Index 1)
3. Suporte (Index 2)
4. Perfil (Index 3)

**Mecânica Visual:**
- Se estou no **Início (0)** e clico no **Perfil (3)**: O índice aumentou (3 > 0). Logo, a nova tela vem da **Direita para a Esquerda** (animação `x: 100% -> 0%`).
- Se estou no **Perfil (3)** e clico no **Início (0)**: O índice diminuiu (0 < 3). Logo, a nova tela vem da **Esquerda para a Direita** (animação `x: -100% -> 0%`).
- Essa lógica emula nativamente a navegação de abas no iOS/Android, provendo um "bonitinho e profissional" absoluto.

## 3. Adaptação do Layout Admin
O componente `AdminLayout` já está preparado com `AdminSidebar` (PC) e `BottomNavBar` (Mobile). Garantiremos que o container interno possua `overflow-x-hidden` para não gerar barra de rolagem horizontal durante o slide da transição das telas.
