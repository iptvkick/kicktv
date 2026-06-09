# 006 - Admin Dashboard e UX Overhaul (CrivoCerto)

## Contexto e Objetivos
A experiência atual do CrivoCerto possui um navbar tradicional e dados estáticos. O objetivo desta funcionalidade é refinar drasticamente o UX visual (adotando uma estética "Apple Liquid Glass" com navegação em ilha) e transformar o projeto em uma plataforma robusta e orientada a dados. Isso inclui a criação de um painel de administração (Dashboard) para gestão de métricas de afiliados, e o estabelecimento de automações (cron jobs) integradas a APIs de tendências (Trends) e agentes de IA para geração automática de novos reviews.

## Requisitos (Requirements)
1. **Redesign da Navegação (UX/UI):**
   - Substituir o header tradicional por um "Floating Island Navbar" translúcido (estilo Dynamic Island / macOS Sonoma).
   - O navbar deve conter apenas navegação primária (Início, Sobre, Busca), recolhendo-se ou animando-se fluidamente com o scroll.
   - Remover as categorias/nichos do header e realocá-las para uma seção visual rica (Maximalismo Tátil) dentro da home page.

2. **Admin Dashboard (`/admin`):**
   - Acesso restrito e protegido (Autenticação via Supabase Auth).
   - Visão global das métricas do site.
   - Acompanhamento de cliques divididos por plataforma (Amazon, Mercado Livre, Shopee).
   - Gestão de postagens (CRUD de reviews).
   - Insights de tendências em tempo real.

3. **Automações e Integrações (Cron Jobs & APIs):**
   - Sistema de Cron Jobs rodando a cada 1 hora.
   - Integração com API de tendências (ex: Google Trends, Serper) para identificar produtos em alta no Brasil.
   - API e endpoints prontos para receber e postar reviews gerados por agentes autônomos de IA.

## User Stories
- **Como um leitor visitante**, eu quero uma navegação desobstruída e elegante (estilo Apple) para focar no conteúdo, mas ainda poder acessar categorias facilmente na página inicial.
- **Como administrador**, eu quero acessar um painel em `/admin` para ver quantos cliques cada link de afiliado recebeu, para otimizar minhas campanhas e lucros.
- **Como sistema autônomo**, eu quero endpoints seguros para consultar métricas e publicar novos reviews baseados em tendências de mercado gerados a cada hora.

## Acceptance Criteria
- O Navbar flutua no topo (top: 1rem, border-radius total, backdrop-blur) e não possui menus extensos dropdown de categorias.
- A Home Page possui uma seção dedicada, em grade (grid), com visual rico para todas as categorias.
- Acessar `/admin` redireciona para login se não estiver autenticado; se autenticado, exibe um painel com gráficos de cliques e painéis de controle de conteúdo.
- A estrutura de banco de dados (Supabase) consegue registrar cada "click" out num link de afiliado, armazenando timestamp, plataforma e post_id.
- O sistema possui rotas de API `/api/cron/trends` e `/api/cron/post-review` preparadas para consumo por agentes IA (ex: n8n / Hermes).

## BDD Scenarios

### Cenário: Interação do usuário com o Floating Island Navbar
- **Given (Dado):** Que o visitante acessa a Home Page do CrivoCerto.
- **When (Quando):** O visitante rola a página para baixo.
- **Then (Então):** O navbar deve diminuir suavemente sua escala (scale-95), aumentar sua transparência e manter-se fixo (sticky/fixed) flutuando no topo, ocultando a barra de pesquisa expandida se aberta.

### Cenário: Registro de clique em link de afiliado
- **Given (Dado):** Que um leitor está lendo o review do "JBL Tune 520BT".
- **When (Quando):** O leitor clica no botão "Comprar na Amazon".
- **Then (Então):** O sistema dispara uma requisição assíncrona para a API (`/api/track-click`), registra o clique no Supabase (plataforma: amazon, post: JBL) e, em seguida, abre a URL de afiliado em uma nova aba.

### Cenário: Acesso não autorizado ao Dashboard
- **Given (Dado):** Que um usuário comum (não logado) tenta acessar a rota `/admin`.
- **When (Quando):** O acesso é feito via browser.
- **Then (Então):** O usuário é imediatamente redirecionado para a tela de login (`/auth/login`) e uma mensagem de "Acesso restrito" é apresentada.

### Cenário: Disparo do Cron Job de IA
- **Given (Dado):** Que se passou 1 hora desde a última verificação.
- **When (Quando):** O serviço externo (cron/Worker) faz uma requisição para `/api/cron/trends` com o token de autorização correto.
- **Then (Então):** O sistema busca os tópicos em alta, o agente de IA gera o review e um novo Post é criado no banco de dados e fica visível na Home Page como "publicado recentemente".
