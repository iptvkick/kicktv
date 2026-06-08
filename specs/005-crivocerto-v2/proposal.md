# 📋 Proposal — CrivoCerto v2.0
**ID:** `005-crivocerto-v2`  
**Data:** 2026-05-20  
**Status:** 🟡 Aguardando Aprovação

---

## Visão Geral

O **CrivoCerto v2.0** é um portal de reviews de produtos com foco em monetização via links de afiliado (Amazon, Mercado Livre e Shopee). Construído do zero com Next.js 14, o sistema possui um **agente autônomo** que publica ao menos 3 reviews por dia, pesquisando tendências e gerando conteúdo estruturado com personalidade editorial — sem "cara de IA".

**Diferencial central:** Design premium clean inspirado na Revolut/conciliamec + sistema de curadoria editorial automatizado que parece humano.

---

## Requisitos Funcionais

### RF01 — Portal Público (Frontend)
- Home com carrossel de destaques, grid de últimas análises, seção "Em Alta Agora" e categorias
- Página de review individual com: Crivo Meter (nota visual), tabela de preços multi-marketplace, prós/contras, FAQ respondido, produtos relacionados
- Página de categoria com filtros por nota, faixa de preço, data
- Busca global por produto ou categoria
- Página "Como Avaliamos" (E-E-A-T, confiança editorial)
- Sitemap automático + RSS feed

### RF02 — Painel Admin (Dashboard)
- Login via Supabase Auth (admin only)
- Listagem de posts publicados, agendados e rascunhos
- Editor de post manual (para ajustes humanos)
- Configuração do agente (horários, categorias, plataformas)
- Monitor de saúde dos links de afiliado
- Analytics de cliques por link e por post

### RF03 — Agente Autônomo (Cron)
- Execução 3x/dia (07:00, 13:00, 19:00 BRT)
- **Fase Research**: Scrape dos "Mais Vendidos" Amazon BR por categoria rotativa
- **Fase Generate**: Sistema Multi-Provider dinâmico (OpenAI, Anthropic, Gemini) via OpenRouter ou fallback customizado (inspirado no Hermes/OpenClaw).
- **Fase Price**: O preço DEVE ser real-time. Se a API/Scrape não retornar o preço exato e atual do momento, o card **não exibirá preço** (apenas o botão "Ver Oferta").
- **Fase Publish**: Insere no Supabase → ISR da Vercel revalida a rota
- **Fase Affiliate**: Injeta tags de afiliado automaticamente (`tag=crivocerto-20`)
- **Fallback Automático**: O sistema deve permitir a troca de provider on-the-fly. Se o provider A falhar ou der timeout, tenta o provider B.

### RF04 — SEO e Performance
- JSON-LD Schema: `Article`, `Product`, `Review`, `FAQPage`, `BreadcrumbList`
- Metadata API Next.js dinâmica por post (título, descrição, og:image gerada)
- Core Web Vitals: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- next/image para todas imagens com lazy loading
- Sitemap.xml e robots.txt automáticos
- Disclosure de afiliado visível acima do fold em cada post

### RF05 — Monetização
- Amazon Associados: tag `crivocerto-20` em todos os links do produto
- Mercado Livre Afiliados: links `/redirect` com parâmetro de afiliado (quando ativado)
- Shopee Afiliados: links `/redirect` com parâmetro de afiliado (quando ativado)
- **Crivo Meter**: Nota 0-100 visual que influencia ranking dos produtos

---

## Requisitos Não-Funcionais

| Requisito | Meta |
|-----------|------|
| Performance (Lighthouse) | ≥ 90 (todas as categorias) |
| Uptime | 99.9% (Vercel SLA) |
| Tempo de publicação do agente | ≤ 5 minutos do trigger ao post live |
| Acessibilidade | WCAG 2.2 AA |
| Segurança | RLS no Supabase, variáveis de ambiente, sem keys expostas |
| Responsividade | Mobile-first, funciona em 320px–1920px |

---

## User Stories

### Visitante
- **US-01**: Como leitor, quero ver a nota "Crivo Meter" de um produto logo de cara, para decidir se vale meu tempo ler o review completo.
- **US-02**: Como comprador, quero comparar o preço do produto na Amazon, Mercado Livre e Shopee no mesmo card, sem precisar abrir 3 abas.
- **US-03**: Como pesquisador, quero filtrar reviews por categoria e faixa de preço, para encontrar a melhor opção no meu orçamento.
- **US-04**: Como cético, quero ver a metodologia de avaliação do CrivoCerto, para confiar que as recomendações são imparciais.
- **US-05**: Como usuário mobile, quero o botão "Ver na Amazon" sempre visível sem precisar rolar, para converter minha intenção de compra rapidamente.

### Admin / Proprietário
- **US-06**: Como dono do blog, quero que o agente publique 3 reviews por dia automaticamente, sem eu precisar fazer nada.
- **US-07**: Como editor, quero editar manualmente qualquer post gerado pelo agente antes de publicar, para corrigir informações imprecisas.
- **US-08**: Como gestor, quero ver quantos cliques cada link de afiliado gerou, para saber quais produtos convertem melhor.
- **US-09**: Como gestor de links, quero ser notificado quando um link de afiliado retornar 404, para substituir antes de perder comissões.

---

## Critérios de Aceite

| ID | Critério | Como Testar |
|----|----------|-------------|
| AC-01 | Home carrega em ≤ 2s em 4G simulado | Lighthouse → Performance ≥ 90 |
| AC-02 | Crivo Meter aparece no topo do post | Inspecionar DOM: elemento `.crivo-meter` no `<header>` do post |
| AC-03 | Links de afiliado contêm a tag correta | Grep no HTML renderizado: `tag=crivocerto-20` |
| AC-04 | Disclosure de afiliado aparece acima do primeiro produto | Inspecionar: `.disclosure-banner` antes do primeiro `.product-card` |
| AC-05 | Agente publica post em ≤ 5 min após trigger | Log do Edge Function: `published_at - triggered_at ≤ 300s` |
| AC-06 | JSON-LD Article presente em todos os posts | Google Rich Results Test → sem erros |
| AC-07 | FAQ com respostas visíveis e schema FAQPage | Google Rich Results Test → FAQ schema detectado |
| AC-08 | Admin consegue editar e republicar post do agente | Teste E2E: login → editar → salvar → verificar mudança no front |
| AC-09 | Site funciona offline (PWA) para leitores | Lighthouse → PWA score ≥ 70 |
| AC-10 | Sem erros de console em nenhuma página pública | DevTools Console: 0 erros após hidratação |

---

## BDD Scenarios

### Cenário: Leitura rápida de nota no topo do post
- **Given (Dado):** O visitante abre um post de review de produto no CrivoCerto
- **When (Quando):** A página carrega completamente
- **Then (Então):** O "Crivo Meter" com a nota 0-100 está visível sem nenhum scroll, com cor indicativa (vermelho < 40, amarelo 40-70, verde > 70)

---

### Cenário: Comparativo de preços multi-marketplace
- **Given (Dado):** O agente publicou um review com o produto disponível na Amazon e no Mercado Livre
- **When (Quando):** O visitante vê a seção "Onde Comprar" no post
- **Then (Então):** Os preços de cada marketplace aparecem em cards separados com botão "Ver Oferta", e o menor preço tem um badge "Melhor Preço"

---

### Cenário: Agente publica review automaticamente
- **Given (Dado):** O cron configurado para 07:00 BRT dispara
- **When (Quando):** O Edge Function executa o fluxo completo (research → generate → publish)
- **Then (Então):** Um novo post aparece na home do CrivoCerto em até 5 minutos, com link de afiliado válido e disclosure visible

---

### Cenário: Link de afiliado quebrado detectado
- **Given (Dado):** Um produto da Amazon foi descontinuado e o link retorna 404
- **When (Quando):** O job de verificação de saúde de links executa (1x/dia)
- **Then (Então):** O admin recebe uma notificação com o nome do post, o link quebrado e uma sugestão de produto substituto

---

### Cenário: Visitante filtra reviews por categoria
- **Given (Dado):** O visitante está na página da categoria "Eletrônicos"
- **When (Quando):** Seleciona o filtro "Nota ≥ 80" e "Até R$ 500"
- **Then (Então):** Apenas os posts que atendem ambos os critérios são exibidos, com contador "X resultados encontrados"

---

### Cenário: Admin edita post gerado por IA
- **Given (Dado):** O admin está logado no painel e abre um post rascunho criado pelo agente
- **When (Quando):** Edita o título e salva
- **Then (Então):** A alteração reflete no frontend em até 30 segundos (ISR revalidation) sem precisar de rebuild

---

## Estrutura de Páginas

```
/                          → Home (hub de conteúdo)
/[categoria]               → Listagem de reviews da categoria
/review/[slug]             → Post de review individual  
/busca?q=[termo]           → Resultados de busca
/como-avaliamos            → Metodologia editorial (E-E-A-T)
/afiliados                 → Disclosure completo de afiliados
/sitemap.xml               → Gerado automaticamente
/rss.xml                   → Feed RSS
/admin                     → Dashboard admin (protegido por auth)
/admin/posts               → Listagem de posts
/admin/posts/[id]          → Editor de post
/admin/agent               → Configurações do agente
/admin/links               → Monitor de links de afiliado
```

---

## Fora do Escopo (v2.0)

- Newsletter/email marketing (planejado para v2.1)
- Sistema de comentários dos usuários
- Comparador de produtos lado a lado (v2.2)
- App mobile nativo
- Programa de afiliados próprio (CrivoCerto pagar comissão para outros blogs)
