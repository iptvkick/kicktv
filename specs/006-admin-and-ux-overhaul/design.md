# Design & Architecture (006 - Admin Dashboard e UX Overhaul)

De acordo com as diretrizes da skill `ux-ui-architect-2026`, o novo design do CrivoCerto abraçará a estética **Apple Liquid Glass** combinada com **Engenharia de Conversão (Anti-Fricção)** e **Maximalismo Tátil** para as seções de categorias.

## 1. UI / Frontend (Stitch MCP Target)

### 1.1 Floating Island Navbar
O header tradicional de borda a borda será substituído por uma "ilha flutuante".
- **Visual:** Um contêiner arredondado (`rounded-full`), centralizado horizontalmente, flutuando a `1rem` do topo (`top-4`).
- **Material:** Efeito Glassmorphism severo: `bg-white/70 backdrop-blur-md border border-white/20 shadow-xl`.
- **Conteúdo:** Apenas o logo, link de "Início", "Sobre", botão de "Buscar" e ícone para o painel Admin.
- **Animação (Framer Motion / CSS):**
  - No scroll down: O navbar deve escalar ligeiramente para baixo (`scale-95`) e se tornar mais opaco, sugerindo que "saiu do caminho" mas continua alcançável.
  - Hover: Efeito de glow sutil (Liquid Glass).

### 1.2 Categorias Maximalistas (Home Page)
Sem categorias no header, a Home Page terá uma seção épica para navegação.
- **Visual (Maximalismo Tátil):** Grid de cards grandes (`aspect-square` ou `aspect-video`) para cada nicho (Tecnologia, Casa, Beleza, etc).
- **Tipografia:** Fontes super dimensionadas sobrepostas aos cards.
- **Cores Dopamínicas:** Cada categoria terá um sutil gradiente neon/vibrante no fundo, contrastando com o fundo branco principal (ex: Teal + Amber para Eletrônicos).
- **Interação:** Efeitos de hover magnético, onde o card parece se projetar na direção do cursor (`transform: translateZ(20px)` - simulando 3D táctil).

### 1.3 Painel Admin (`/admin`)
- **Estética:** Neo-Minimalismo, "Dark Technical". O dashboard deve passar uma sensação de ferramenta pro, possivelmente forçando o modo Dark (cores `zinc-950`, `slate-900`) para separar psicologicamente o painel da área pública.
- **Componentes (Shadcn UI):**
  - **Métricas:** Cards com KPI's em fontes gigantes (ex: "1.234 Cliques").
  - **Gráficos:** Recharts para mostrar a linha do tempo de cliques na Amazon vs ML.
  - **Tabelas:** Listagem de posts com paginação, status (Rascunho/Publicado), e botões de ação gerados por IA.

## 2. Modelagem de Banco de Dados (Supabase MCP)

Para viabilizar as métricas de afiliados e o painel admin, a estrutura relacional existente no Supabase (que atualmente suporta `posts` e `categories`) precisará ser expandida.

### 2.1 Tabela `clicks_tracking`
Registra a telemetria de interação dos usuários.
- `id` (uuid, PK)
- `post_id` (uuid, FK -> posts.id)
- `platform` (text, enum: 'amazon', 'mercadolivre', 'shopee')
- `affiliate_url` (text)
- `user_agent` (text, opcional para análise de device)
- `created_at` (timestamp, indexado para queries temporais)

### 2.2 Views (PostgreSQL) para Insights
Para evitar queries pesadas no painel admin, criaremos views materializadas ou views simples para agregar dados:
- `daily_clicks_by_platform`: Conta `id` agrupado por data e `platform`.
- `top_converting_posts`: Agrupa cliques por `post_id` cruzando com a tabela `posts` para extrair os produtos mais populares.

### 2.3 RLS (Row Level Security)
- `clicks_tracking`: INSERT permitido para anon, SELECT permitido apenas para roles autenticadas (admins).

## 3. Arquitetura de API e Cron Jobs

O projeto, agora usando Vite/TanStack Start puro, utilizará Server Functions (ou Cloudflare Workers, já que o ambiente Lovable suporta Cloudflare via Wrangler) para endpoints de API.

- `POST /api/track`: Rota rápida (edge) para registrar o clique e retornar um redirecionamento 302 para o link de afiliado. Isso limpa o front-end e evita adblockers pesados.
- `GET /api/cron/generate`: Endpoint protegido (verificação de Bearer token ou secret do Cron) que:
  1. Chama API de Trends (Ex: Serper.dev News/Shopping ou Google Trends via RSS).
  2. Aciona LLM (OpenAI/Anthropic) com um prompt de persona de review para escrever a análise do produto.
  3. Gera a imagem da hero usando API de geração de imagem.
  4. Insere no Supabase.
