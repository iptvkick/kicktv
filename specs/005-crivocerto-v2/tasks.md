# ✅ Tasks — CrivoCerto v2.0
**ID:** `005-crivocerto-v2`  
**Data:** 2026-05-20  
**Status:** ⏳ Aguardando aprovação do proposal

---

> [!IMPORTANT]
> Execute esta lista SEQUENCIALMENTE. Não pule etapas. Marque `[/]` ao iniciar e `[x]` ao concluir cada item. Consulte `design.md` antes de qualquer decisão de UI/DB.

---

## FASE 0 — Setup e Infraestrutura

- [ ] **0.1** Criar projeto Next.js 14 com App Router
  ```bash
  npx create-next-app@latest crivocerto-v2 --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
  ```
- [ ] **0.2** Instalar dependências base
  ```bash
  npx shadcn@latest init
  npm install @supabase/supabase-js @supabase/ssr lucide-react
  npm install next-sitemap class-variance-authority clsx tailwind-merge
  npm install @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-dropdown-menu
  npm install framer-motion
  ```
- [ ] **0.3** Configurar variáveis de ambiente (`.env.local`)
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  VERCEL_DEPLOY_HOOK_URL=
  AMAZON_AFFILIATE_TAG=crivocerto-20
  OPENROUTER_API_KEY=
  ```
- [ ] **0.4** Criar projeto no Supabase via MCP
  - Nome: `crivocerto-v2`
  - Região: `sa-east-1` (São Paulo)
- [ ] **0.5** Configurar `tailwind.config.ts` com design tokens do `design.md`
  - Adicionar fontes Plus Jakarta Sans + Inter
  - Configurar CSS variables como cores customizadas
- [ ] **0.6** Criar `src/styles/globals.css` com todos os tokens de `design.md` seção 2
- [ ] **0.7** Configurar `next.config.ts`
  - Domínios de imagens permitidos: `m.media-amazon.com`, `http2.mlstatic.com`, `down-br.img.susercontent.com`
  - Configurar CSP básico

---

## FASE 1 — Banco de Dados (Supabase MCP)

- [ ] **1.1** Aplicar migração: `20260520000001_create_categories.sql`
  - Tabela `categories` conforme `design.md` seção 5.1
- [ ] **1.2** Aplicar migração: `20260520000002_create_posts.sql`
  - Tabela `posts` com todos os campos, enums e constraints
- [ ] **1.3** Aplicar migração: `20260520000003_create_products.sql`
  - Tabelas `products` e `product_prices`
- [ ] **1.4** Aplicar migração: `20260520000004_create_faqs_and_agent.sql`
  - Tabelas `post_faqs`, `agent_runs`, `link_health_checks`
- [ ] **1.5** Aplicar migração: `20260520000005_create_views_and_rls.sql`
  - View `published_posts_summary`
  - Função `get_broken_links()`
  - Todas as políticas RLS do `design.md` seção 5.3
- [ ] **1.6** Seed inicial: inserir categorias padrão
  ```sql
  INSERT INTO categories (name, slug, icon_name) VALUES
  ('Tecnologia', 'tecnologia', 'smartphone'),
  ('Casa e Jardim', 'casa-jardim', 'home'),
  ('Esporte e Saúde', 'esporte-saude', 'dumbbell'),
  ('Moda', 'moda', 'shirt'),
  ('Beleza', 'beleza', 'sparkles'),
  ('Bebês e Crianças', 'bebes-criancas', 'baby'),
  ('Pets', 'pets', 'paw-print'),
  ('Automotivo', 'automotivo', 'car');
  ```
- [ ] **1.7** Gerar tipos TypeScript: `supabase gen types typescript > src/types/database.types.ts`

---

## FASE 2 — Design System e Componentes Base

- [ ] **2.1** Instalar componentes Shadcn necessários
  ```bash
  npx shadcn@latest add button card badge input dialog sheet accordion tabs skeleton
  ```
- [ ] **2.2** Criar `src/lib/utils.ts` — utilitários (cn, formatPrice, formatDate)
- [ ] **2.3** Criar `src/lib/supabase/client.ts` — cliente browser
- [ ] **2.4** Criar `src/lib/supabase/server.ts` — cliente server (SSR)
- [ ] **2.5** Criar `src/components/ui/CrivoMeter.tsx`
  - SVG circular com animação de preenchimento
  - Props: `score: number` (0-100)
  - Cores dinâmicas: vermelho/âmbar/verde baseado na nota
  - `IntersectionObserver` para triggar animação no scroll
- [ ] **2.6** Criar `src/components/ui/PriceCard.tsx`
  - Props: `marketplace`, `price`, `url`, `isBest?: boolean`
  - Badge "Melhor Preço" automático
  - Logo de cada marketplace (SVG inline)
- [ ] **2.7** Criar `src/components/ui/PostCard.tsx`
  - Props: `post` (from `published_posts_summary` view)
  - Imagem 16:9 com next/image, badge de categoria, score mini, título
  - Hover: translateY + shadow
- [ ] **2.8** Criar `src/components/ui/AffiliateDisclosure.tsx`
  - Strip de disclosure com link para página de política
  - Colapsável com estado em `localStorage`
- [ ] **2.9** Criar `src/components/ui/ProsConsList.tsx`
  - Ícones Lucide (Check / X)
  - Cores semânticas por tipo
- [ ] **2.10** Criar `src/components/ui/FAQAccordion.tsx`
  - Radix UI Accordion com JSON-LD FAQPage injetado
  - Respostas completamente visíveis (sem conteúdo oculto permanente)
- [ ] **2.11** Criar `src/components/layout/Navbar.tsx`
  - Logo + links de categorias + busca global + link admin
  - Mobile: hamburguer menu (Sheet do Shadcn)
  - Sticky com backdrop-blur
- [ ] **2.12** Criar `src/components/layout/Footer.tsx`
  - Links institucionais, categorias, disclosure completo
  - Certificado "Amazon Associate"

---

## FASE 3 — Páginas Públicas (Frontend)

- [ ] **3.1** Criar `src/app/layout.tsx` com:
  - Metadados base (title template, description, og:image default)
  - Importar fontes Google (Plus Jakarta Sans + Inter)
  - Navbar + Footer
  - `<Analytics />` (Vercel Analytics)
- [ ] **3.2** Criar `src/app/page.tsx` — HOME
  - Seção Hero: busca global + tagline
  - Seção "Em Alta Agora": scroll horizontal de 4 posts
  - Seção "Últimas Análises": grid 3 colunas
  - Seção Categorias: grid de ícones com links
  - Seção "Como Avaliamos": strip de confiança
  - Animações `fade-in-up` via IntersectionObserver
- [ ] **3.3** Criar `src/app/[categoria]/page.tsx` — LISTAGEM DE CATEGORIA
  - SSG com `generateStaticParams()` para todas as categorias
  - Filtros: nota mínima (slider), faixa de preço, data
  - Grid de PostCards com contador
- [ ] **3.4** Criar `src/app/review/[slug]/page.tsx` — POST DE REVIEW
  - `generateStaticParams()` + ISR com `revalidate: 3600`
  - Breadcrumbs + metadados dinâmicos
  - Layout: conteúdo 65% + sidebar sticky 35%
  - Injetar CrivoMeter, AffiliateDisclosure, PriceCard(s), ProsConsList, FAQAccordion
  - JSON-LD: Article + Review + FAQPage
  - Seção de artigos relacionados ao final
- [ ] **3.5** Criar `src/app/busca/page.tsx` — BUSCA
  - `?q=` query param
  - Server-side search via Supabase `ilike`
  - Highlight do termo encontrado
- [ ] **3.6** Criar `src/app/como-avaliamos/page.tsx` — METODOLOGIA
  - Explica o Crivo Meter (dimensões: Custo-Benefício, Durabilidade, Qualidade, etc.)
  - Processo editorial
  - Politica de afiliados (E-E-A-T)
- [ ] **3.7** Criar `src/app/afiliados/page.tsx` — DISCLOSURE
  - Texto legal completo de disclosure Amazon
  - Informações sobre ML e Shopee (disabled por ora)
- [ ] **3.8** Criar `src/app/sitemap.ts` — SITEMAP DINÂMICO
  - Todas as rotas estáticas + posts publicados
- [ ] **3.9** Criar `src/app/robots.ts`
  - Permite indexação geral, bloqueia `/admin`

---

## FASE 4 — Painel Admin

- [ ] **4.1** Criar middleware de proteção: `src/middleware.ts`
  - Redireciona `/admin/**` para login se não autenticado
- [ ] **4.2** Criar `src/app/admin/login/page.tsx`
  - Formulário email + senha via Supabase Auth
- [ ] **4.3** Criar `src/app/admin/layout.tsx`
  - Sidebar de navegação admin
  - Header com nome do usuário + logout
- [ ] **4.4** Criar `src/app/admin/page.tsx` — DASHBOARD
  - Métricas: total de posts, posts hoje, links saudáveis/quebrados
  - Status do próximo run do agente
  - Lista dos últimos 5 agent_runs
- [ ] **4.5** Criar `src/app/admin/posts/page.tsx` — LISTA DE POSTS
  - Tabela: título | categoria | status | data | ações
  - Filtros por status (draft/published/archived)
  - Botão "Novo Post" manual
- [ ] **4.6** Criar `src/app/admin/posts/[id]/page.tsx` — EDITOR DE POST
  - Formulário completo de edição de post
  - Gerenciamento de produtos (add/remove/reorder)
  - Configuração de preços por marketplace
  - Gerenciamento de FAQs
  - Botão "Publicar" / "Salvar Rascunho" / "Arquivar"
  - Após salvar: chama revalidate path
- [ ] **4.7** Criar `src/app/admin/links/page.tsx` — MONITOR DE LINKS
  - Tabela de todos os links com status (saudável/quebrado)
  - Data do último check
  - Botão "Verificar Agora" (dispara check manual)
- [ ] **4.8** Criar `src/app/admin/agente/page.tsx` — CONFIG DO AGENTE
  - Configuração de horários dos crons
  - Seleção de categorias ativas para o agente
  - Histórico de runs com logs
  - Botão "Rodar Agora" (trigger manual)

---

## FASE 5 — Agente Autônomo (Edge Functions)

- [ ] **5.1** Criar `supabase/functions/agent-publish/index.ts`
  - Recebe categoria, executa fluxo completo
  - Research: Firecrawl scrape da Amazon Mais Vendidos
  - Generate: chamada OpenRouter (Gemini Flash ou Claude Haiku)
  - Validate: schema validation do JSON gerado
  - Publish: insert em `posts`, `products`, `product_prices`, `post_faqs`
  - Notify: POST para Vercel Deploy Hook para ISR revalidation
  - Log: insert em `agent_runs`
- [ ] **5.2** Criar prompt do agente em `supabase/functions/agent-publish/prompt.ts`
  - Sistema de prompt que garante dados reais, personalidade editorial
  - Instruções para NUNCA usar frases genéricas de IA
  - Template de output JSON estruturado
- [ ] **5.3** Configurar pg_cron no Supabase
  ```sql
  SELECT cron.schedule('agent-morning', '0 10 * * *', 
    $$SELECT net.http_post(url:='https://[project].supabase.co/functions/v1/agent-publish', 
    headers:='{"Authorization":"Bearer [service_key]"}', body:='{"period":"morning"}')$$);
  ```
  - Morning: 10:00 UTC (07:00 BRT)
  - Afternoon: 16:00 UTC (13:00 BRT)
  - Evening: 22:00 UTC (19:00 BRT)
- [ ] **5.4** Criar `supabase/functions/link-health-check/index.ts`
  - Itera sobre todos os `product_prices` ativos
  - HEAD request em cada `affiliate_url`
  - Registra resultado em `link_health_checks`
  - Se `is_healthy = false` por 2+ checks consecutivos: envia webhook de alerta
- [ ] **5.5** Configurar cron para link-health-check (02:00 UTC diário)
- [ ] **5.6** Criar `supabase/functions/revalidate-post/index.ts`
  - Recebe `slug` e chama Vercel Deploy Hook com tag específica do post

---

## FASE 6 — SEO e Performance Final

- [ ] **6.1** Adicionar JSON-LD em `src/app/review/[slug]/page.tsx`
  - Article, Review, FAQPage, BreadcrumbList (todos juntos via `next/script`)
- [ ] **6.2** Configurar og:image dinâmico
  - `src/app/review/[slug]/opengraph-image.tsx` — Next.js OG Image API
  - Layout: nome do produto + nota Crivo Meter + logo CrivoCerto
- [ ] **6.3** Instalar e configurar `next-sitemap`
  ```bash
  npm install next-sitemap
  ```
- [ ] **6.4** Verificar Core Web Vitals com Lighthouse CI
  - Corrigir qualquer LCP > 2.5s (next/image, priority em imagens hero)
  - Corrigir qualquer CLS (dimensões explícitas em imagens)
- [ ] **6.5** Adicionar `<link rel="preconnect">` para domínios externos
  - Google Fonts, Amazon CDN, Supabase
- [ ] **6.6** Configurar Vercel Analytics + Speed Insights

---

## FASE 7 — Testes e Deploy

- [ ] **7.1** Testar todos os posts com Google Rich Results Test
  - `review/[slug]` deve ter Article + FAQ sem erros
- [ ] **7.2** Testar Lighthouse em mobile e desktop (todas as páginas principais)
- [ ] **7.3** Testar o agente manualmente via painel admin ("Rodar Agora")
  - Verificar que post aparece na home após run
- [ ] **7.4** Testar link-health-check manual
  - Incluir um link deliberadamente quebrado para validar detecção
- [ ] **7.5** Testar auth flow: login → editar post → publicar → ver na home
- [ ] **7.6** Deploy no Vercel
  ```bash
  git init && git add . && git commit -m "feat: CrivoCerto v2.0 initial"
  vercel --prod
  ```
- [ ] **7.7** Configurar domínio customizado no Vercel
- [ ] **7.8** Configurar CORS no Supabase para o domínio de produção
- [ ] **7.9** Verificar se pg_cron está rodando em produção

---

## FASE 8 — Conteúdo Inicial

- [ ] **8.1** Gerar 6 posts iniciais manualmente (2 por categoria: Tech, Casa, Moda)
  - Para ter conteúdo real antes de ativar o agente
- [ ] **8.2** Verificar disclosure de afiliado em todos os posts
- [ ] **8.3** Submeter sitemap para Google Search Console
- [ ] **8.4** Configurar Bing Webmaster Tools
- [ ] **8.5** Verificar indexação após 24h

---

## Definition of Done ✅

O projeto está concluído quando:
- [ ] Lighthouse ≥ 90 em Performance, SEO e Acessibilidade nas 3 páginas principais
- [ ] Agente publicou ao menos 1 post autonomamente sem intervenção humana
- [ ] Google Rich Results Test sem erros em post de review
- [ ] Não há links de afiliado sem a tag `crivocerto-20`
- [ ] Admin consegue editar e publicar post em < 2 minutos
- [ ] Zero erros de console em produção
