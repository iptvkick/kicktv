# Proposal: Frontend Real Data & Liquid UI

## Objetivo
Finalizar as telas do Cliente, integrar todos os dados reais (Supabase) removendo os mocks, criar a nova barra de navegação animada (dinâmica por Role) e corrigir a responsividade para uso no Desktop.

## Requisitos
1. Criar o usuário Admin (`iptvkick@gmail.com`) diretamente no Supabase.
2. Atualizar o `BottomNavBar` com o código fornecido, implementando a lógica de rotas para `admin` vs `cliente`.
3. Ajustar o Layout Geral (`src/app/layout.tsx` ou equivalente) para que no PC a tela não fique "esticada e quebrada", utilizando um enquadramento otimizado.
4. Substituir `mockPlans`, `mockServers` e `mockDevices` por chamadas reais ao Supabase.
5. Construir as telas reais de `Player`, `Suporte` e `Perfil`.

## BDD Scenarios

### Cenário: Navegação Condicional por Role
- **Given (Dado):** O sistema possui um `BottomNavBar` global.
- **When (Quando):** Um usuário faz login.
- **Then (Então):** Se o `role` for `admin`, a barra exibe ícones de "Dashboard", "Planos", "Servidores" e "Onboarding". Se for `client`, exibe "Início", "Player", "Suporte" e "Perfil".

### Cenário: Visualização no Computador (Desktop)
- **Given (Dado):** Um usuário acessa o SaaS através de um monitor Ultrawide ou Full HD.
- **When (Quando):** A tela carrega.
- **Then (Então):** Os cartões não se esticam infinitamente. O conteúdo principal fica contido em um invólucro legível (ex: `max-w-4xl`), e a Bottom Nav Bar não flutua perdida, sendo posicionada corretamente de acordo com a responsividade.

### Cenário: Dashboard do Cliente Sem Mocks
- **Given (Dado):** O cliente possui uma assinatura `active`.
- **When (Quando):** Ele acessa o `/cliente/dashboard`.
- **Then (Então):** O sistema faz o fetch no Supabase da tabela `subscriptions` vinculada ao seu `profile`, exibe os dias restantes baseados no `expires_at` real e as credenciais geradas do banco.
