# Design Doc: Auth Routing & Visual Fix

## 1. Visão Arquitetural

Esta feature corrige os estilos globais da aplicação e integra fluxos vitais (Login e Registro) que estavam isolados das áreas de conversão principais. Seguiremos as tendências listadas na skill `ux-ui-architect-2026` para aprimorar o apelo visual das interfaces que já foram desenvolvidas.

### 1.1 Correção Visual (Tailwind CSS)
A quebra visual relatada indica que as classes do Tailwind não estão sendo processadas corretamente. Sendo um projeto Vite + Tailwind CSS v4 e TanStack Router, a correção ocorrerá:
- **`vite.config.ts`**: Verificando a presença de plugins e carregadores (loaders) necessários.
- **`src/__root.tsx`**: Inspecionando o carregamento global de `styles.css`.
- Garantir que a renderização inicial não emita FOUC (Flash of Unstyled Content) ou perca a camada estética de "Liquid Glass" e "Maximalismo" recomendada para landing pages 2026.

### 1.2 UX/UI de Autenticação (Stitch MCP & Shadcn)
As rotas de `/auth/login` e `/auth/register` devem seguir a identidade de um SaaS moderno:
- **Card Elegante e Minimalista**: Fundo com leve desfoque e blur (Apple Liquid Glass).
- **Inputs e Tipografia Acessíveis**: Alinhamento com WCAG 2.2 para alto contraste, focos bem definidos, botões generosos.
- **Micro-interações**: Loading spinners claros nas submissões assíncronas de login/registro.
- **Acessos rápidos (Landing Page)**: Modificações no `Navbar` ou `Hero` (ex. `src/routes/index.tsx`) para introduzir os botões de "Login" e "Criar Conta" claramente sinalizados.

### 1.3 Banco de Dados e Lógica (Supabase MCP)
As ações subjacentes usarão a integração já instalada via pacote `@supabase/supabase-js`:
- **Auth Flow**: O cliente chamará a API para registrar ou realizar sign in.
- **Identificação de Role (RBAC Simplificado)**: Imediatamente após o sign in bem-sucedido, a aplicação acessará o metadata ou tabelas atreladas do usuário para determinar seu papel (Role).
  - Se `role === 'admin'` -> redirect `/admin`
  - Se `role === 'customer'` -> redirect `/cliente/dashboard`
- Isso garantirá a separação lógica e segurança de acesso visual sem criar confusão para novos clientes, direcionando-os aos seus recursos corretos.
