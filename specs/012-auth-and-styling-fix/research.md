# Research: Fix Styling and Auth Routing

## 1. Contexto e Problema Atual
O usuário relatou que a interface atual do site "quebrou" completamente, exibindo apenas texto sem formatação (HTML puro sem CSS), como demonstrado nas capturas de tela. Além disso, observou a ausência de um roteamento claro e funcional para:
- Login de usuários clientes
- Registro de novos usuários
- Acesso à área de administração (Admin)

## 2. Análise da Estrutura Atual
Analisando a pasta `src/routes`, constata-se a existência dos seguintes arquivos e diretórios:
- `auth/login.tsx`
- `auth/register.tsx`
- `cliente/` (com dashboard, perfil, player, suporte)
- `admin/` e `admin.tsx`
- `__root.tsx` e `styles.css`

Isso indica que as rotas *físicas* foram criadas, mas:
1. **Estilo (CSS):** A quebra visual sugere que o arquivo `src/styles.css` (que importa o TailwindCSS v4) não está sendo devidamente injetado ou processado na compilação do Vite, possivelmente devido a uma falha na importação no componente raiz `__root.tsx` ou configuração ausente no plugin do Vite.
2. **Roteamento e Navegação:** Apesar de existirem, os fluxos para acessar `/auth/login`, `/auth/register` e `/admin` parecem não estar integrados adequadamente na interface (ex: botões na Landing Page não apontam corretamente, ou há falta de redirects e guardas de rota baseados na sessão do usuário).

## 3. Benchmarking de Concorrentes Diretos
A experiência de onboarding e autenticação foi analisada em plataformas de SaaS (streaming e serviços web premium):
- **Concorrente A (Netflix/Max):** Na landing page, o botão "Entrar" (Login) no canto superior direito é extremamente visível. Ao clicar, o fluxo é totalmente isolado e imersivo. O registro é o Call to Action (CTA) primário centralizado (novo usuário).
- **Concorrente B (Vercel/SaaS Padrão):** Oferece login (Log In) e registro (Sign Up) com pesos visuais diferentes (botão outline para login, botão sólido para registro). Ao logar, identifica a permissão do usuário e faz redirect transparente para `/dashboard` (cliente) ou `/admin` (administrador) dependendo da role.

## 4. Conclusão e Próximos Passos
Precisamos:
- Corrigir a injeção do TailwindCSS (`styles.css`) no `@tanstack/react-router` para restabelecer os estilos, recuperando o visual premium.
- Revisar a landing page e/ou a navegação global para garantir que existam links/botões explícitos e funcionais apontando para `auth/login`, `auth/register` e (para usuários autorizados) `admin`.
- Garantir que a lógica de redirecionamento pós-login esteja devidamente segmentada, separando clientes comuns de administradores.
