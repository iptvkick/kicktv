# Tarefas de Implementação (006 - Admin Dashboard e UX Overhaul)

Siga este checklist rigorosamente para implementar a funcionalidade. Não pule etapas.

## FASE 1 — Backend & Supabase
- [ ] Conectar ao Supabase CLI e criar a migração `create_clicks_tracking`.
- [ ] Definir a tabela `clicks_tracking` (id, post_id, platform, affiliate_url, created_at).
- [ ] Configurar RLS na nova tabela: permitir inserção anônima (`INSERT`), mas restringir leitura (`SELECT`) para usuários logados.
- [ ] Criar a tabela `admin_settings` para armazenar as chaves de API (ex: SERPER_API_KEY, OPENAI_API_KEY) e horários do Cron, acessível apenas por administradores.
- [ ] Aplicar a migração e testar inserção simples de tracking no banco via SQL.

## FASE 2 — Redesign de Navegação (Stitch / Frontend)
- [ ] Alterar o componente `Navbar.tsx` para adotar o design "Floating Island".
  - Aplicar classes de largura máxima, borderRadius alto, glassmorphism (`backdrop-blur`).
  - Remover a listagem de categorias do menu principal.
- [ ] Implementar a lógica de scroll (usando estado do React e `window.scrollY` ou `framer-motion`) para alterar o CSS da barra (ex: `scale-95` quando scrollada).
- [ ] Alterar a `HomePage` (`routes/index.tsx`) para incluir uma seção épica e visualmente rica (Maximalismo Tátil) para navegar pelas Categorias.
  - Criar um novo componente `CategoryGrid` com cores vibrantes (Dopamine Colors) e hover effects intensos.

## FASE 3 — Rastreamento de Cliques (Edge/API)
- [ ] Refatorar os botões de afiliado dentro de `PostCard` e da página de Review (`review.$slug.tsx`).
- [ ] Ao invés do botão abrir a URL da Amazon diretamente, ele deve chamar uma função ou disparar um evento para a API `/api/track` passando o ID do produto e plataforma.
- [ ] Assim que o evento for disparado e recebido (Fire & Forget), o redirecionamento ocorre para a URL final do afiliado.

## FASE 4 — Painel de Administração (`/admin`)
- [ ] Criar a rota protegida no TanStack Router (`routes/admin/__root.tsx`). Se a sessão do usuário (Supabase Auth) não existir, redirecionar para `/login`.
- [ ] Criar a página de visão geral do painel (`routes/admin/index.tsx`).
  - Buscar os dados de cliques da tabela `clicks_tracking`.
  - Exibir métricas agregadas (Total de Cliques, Cliques por Plataforma).
- [ ] Criar página `/admin/posts` para gestão básica de conteúdo.

## FASE 5 — Automação / Cron Jobs
- [ ] Criar a rota de API em Server Functions (`/api/cron/generate`).
- [ ] Garantir que esta rota exija um cabeçalho de autenticação (ex: `Authorization: Bearer <CRON_SECRET>`).
- [ ] A rota deverá: consultar tendências usando ferramenta de busca, enviar para LLM montar review estruturado em Markdown, inserir novo Post no Supabase.
- [ ] (Apenas Infra) Descrever no README ou via Wrangler/Cloudflare workers como agendar este job para rodar a cada 1 hora.
