# Research: Admin Auth Routing & Context (013)

## 1. Contexto Atual
O usuário reportou problemas sérios de roteamento e perda de contexto na área do administrador ("logar com admin@ e ir pra tela de admin"). A IDE anterior (Antigravity IDE) causou bugs devido à falta de contexto claro da arquitetura Next.js 16 App Router com Supabase.

### 1.1 Análise do Código Existente
- **Login (`src/app/auth/login/page.tsx`)**: O login verifica a `role` do usuário na tabela `profiles` no lado do cliente (Client-Side Rendering) e faz um `router.push('/admin/dashboard')`.
- **Layout Admin (`src/app/admin/layout.tsx`)**: Atualmente renderiza a UI estática (`AdminSidebar`, `PageTransition`) mas **NÃO possui validação de sessão (Server-Side)**. Qualquer usuário que digitar `/admin` na URL pode acessar a página em branco ou causar erros de hidratação/contexto.

### 1.2 O Problema do Roteamento
No Next.js (App Router), a proteção de rotas deve ocorrer preferencialmente no **Middleware (`middleware.ts`)** ou através de Server Components chamando a API de Servidor do Supabase (`@supabase/ssr`). Fazer checagens puramente no Client-Side gera:
- Flashes de conteúdo não autorizado (FOUC).
- Bugs de estado onde a UI "pensa" que é admin, mas as chamadas de banco de dados falham por Row Level Security (RLS).
- Redirecionamentos quebrados ("ficar preso" na tela de login).

## 2. Escopo da Solução
Precisamos implementar uma guarda de rota impenetrável baseada em Perfis (Role-Based Access Control) que:
1. Valide o JWT do Supabase via Servidor.
2. Busque a `role` do usuário (Admin vs Cliente).
3. Redirecione instantaneamente o tráfego caso haja invasão de escopo (ex: Cliente tentando acessar `/admin` volta para `/cliente/dashboard`).
