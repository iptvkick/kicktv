# Design: Global Swipe & Admin Architecture

## UI/UX Frontend

### 1. Global Swipe (ClienteLayout)
- `src/routes/cliente.tsx` será transformado em um container interativo de `framer-motion`.
- O `<Outlet />` padrão será envolto num componente que usa a lógica de localização (`useLocation`) para determinar o index da rota atual baseado no array de ordem:
  `const routes = ["/cliente/dashboard", "/cliente/player", "/cliente/suporte", "/cliente/perfil"]`
- O componente intercepta `drag="x"`. Se `dragOffset` > limit, fazemos `router.navigate` para o index anterior. Se < limit, index seguinte. A animação será controlada por `AnimatePresence` injetando `direction` para o slide.

### 2. Refatoração do Perfil (`perfil.tsx` e sub-rotas)
- O código das antigas abas (Dados Pessoais, Pagamento, Segurança) sairá inteiramente do `dashboard.tsx`.
- O `dashboard.tsx` fica focado no "Início" (Plano Ativo, Dias Restantes, Dispositivos).
- `perfil.tsx` será uma página contendo um Menu Vertical com os itens (ex: Accordion, ou sub-páginas animadas que expandem na própria view).
- Usaremos componentes shadcn como `<Accordion>` ou simples `AnimatePresence` que troca o painel clicado preenchendo a tela, mantendo o "Meu Perfil" no topo.

### 3. Planos Asaas (`planos.tsx`) Centralizado
- O formulário e inputs de "Sandbox API Key" e "Production API Key" (antes em `configuracoes.tsx`) serão movidos para o topo do `planos.tsx` numa seção recolhível (ex: `<details>` ou painel elegante) "Configurações da Conta Asaas".
- Garantir que as lógicas de fetch `supabase.from('integrations')` sejam migradas.

### 4. Admin de Usuários (`usuarios.tsx`)
- Uma nova rota (arquivo) `src/routes/admin/usuarios.tsx`.
- Usaremos a paleta de tabelas já aplicada em outras rotas.
- Buscar o join simples: `profiles` + `subscriptions`.
- Campos exibidos: Avatar/User Icon, Email (do profiles), Assinatura Status (do subscriptions), Vencimento.
- Menu Sidebar (`admin.tsx`) atualizado com `<Users>` apontando para `/admin/usuarios`.
