# Proposal: Readequação SDD e Lógica Admin

## Objetivo
Reverter as decisões estilísticas da aplicação `kicktv-saas` (Next.js) para que se alinhem 100% ao SDD original (Light Mode Clean), e implementar o sistema de redirecionamento condicional de Login e as telas finais do Painel Admin.

## Requisitos
1. Descartar as alterações feitas na raiz (Vite) e focar unicamente na pasta `kicktv-saas` conforme a Regra #5 do SDD.
2. Reverter o `globals.css`, `layout.tsx` e o `BottomNavBar.tsx` da pasta `kicktv-saas` para as cores Clean/Minimalist (White, Dark Charcoal, sem verde neon).
3. Atualizar o sistema de Autenticação (Login) para que, ao logar, o sistema busque o `role` do usuário e o jogue para a rota `/admin/dashboard` ou `/cliente/dashboard`.
4. Construir as telas do Admin (Planos, Servidores, etc) seguindo a paleta Clean.
5. Inserir botão de Logout evidente no Perfil ou Navbar.

## BDD Scenarios

### Cenário: Redirecionamento Condicional Pós-Login
- **Given (Dado):** O usuário está na tela de Login da aplicação `kicktv-saas`.
- **When (Quando):** Ele insere suas credenciais de `admin`.
- **Then (Então):** O sistema autentica via Supabase, busca o perfil, identifica `role: 'admin'` e redireciona automaticamente para `/admin/dashboard`.

### Cenário: Design Clean (SDD Compliance)
- **Given (Dado):** O aplicativo carrega no Desktop ou Mobile.
- **When (Quando):** A tela principal (`dashboard`) é exibida.
- **Then (Então):** O fundo não é mais preto com verde, mas sim `bg-zinc-50` (fundo claro), com a BottomNavBar em formato de pílula escura (`bg-zinc-900`) e textos com a fonte `Instrument Sans`.
