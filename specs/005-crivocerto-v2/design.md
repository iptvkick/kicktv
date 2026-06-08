# 🎨 Design System — CrivoCerto v2.0
**ID:** `005-crivocerto-v2`  
**Data:** 2026-05-20  
**Skill Aplicada:** `ux-ui-architect-2026`  
**Vibe:** Portal Editorial Premium — Clean Light Mode com Personalidade

---

## 1. CONCEITO VISUAL: "Editorial Trust"

> **Filosofia:** Igual ao conciliamec + Revolut — confiança transmitida por clareza. Não é um blog de tecnologia nem um portal genérico. É uma curadoria editorial sofisticada que respeita a inteligência do leitor.

### O DNA do CrivoCerto v2
- **Não é** o minimalism vazio do WordPress padrão
- **É** o neo-minimalismo com personalidade — limpo mas cheio de caráter
- **Referência primária:** conciliamec.lovable.app (espaçamento, hierarquia, cards)
- **Referência financeira:** Revolut (confiança transmitida por tipografia forte + clareza)
- **Referência editorial:** The Wirecutter / RTINGS.com (autoridade, dados reais)

---

## 2. IDENTIDADE VISUAL (SDD — Design System Document)

### 2.1 Paleta de Cores — "Warm Neutral + Electric Teal"

```css
/* === TOKENS DE DESIGN — CrivoCerto v2.0 === */

/* Backgrounds */
--color-bg-base:        hsl(220, 20%, 98%);    /* #F7F8FA — Off-white levemente frio */
--color-bg-card:        hsl(0, 0%, 100%);       /* #FFFFFF — Cards puros */
--color-bg-subtle:      hsl(220, 15%, 95%);    /* #EEF0F5 — Seções alternadas */
--color-bg-overlay:     hsl(220, 20%, 96%);    /* Overlays sutis */

/* Superfícies Glassmórficas */
--color-glass-surface:  rgba(255, 255, 255, 0.7);
--color-glass-border:   rgba(255, 255, 255, 0.3);

/* Primary — Teal Elétrico (Confiança + Conversão) */
--color-primary-50:     hsl(172, 76%, 95%);
--color-primary-100:    hsl(172, 72%, 85%);
--color-primary-500:    hsl(172, 76%, 38%);    /* #17A98E — CTA principal */
--color-primary-600:    hsl(172, 76%, 32%);    /* Hover */
--color-primary-700:    hsl(172, 76%, 26%);    /* Active */

/* Texto */
--color-text-primary:   hsl(220, 25%, 14%);    /* #1A1F2E — Quase preto, não preto puro */
--color-text-secondary: hsl(220, 15%, 40%);    /* #5A6580 — Metadados, labels */
--color-text-muted:     hsl(220, 12%, 60%);    /* #8A93A8 — Placeholders, captions */
--color-text-inverse:   hsl(0, 0%, 100%);

/* Borders */
--color-border:         hsl(220, 15%, 90%);    /* #DDE1EA — Bordas padrão */
--color-border-strong:  hsl(220, 15%, 80%);    /* Bordas com mais contraste */

/* Semânticas (Crivo Meter) */
--color-score-excellent: hsl(142, 71%, 45%);   /* Verde > 70 */
--color-score-good:      hsl(45, 93%, 47%);    /* Âmbar 40-70 */
--color-score-poor:      hsl(0, 84%, 60%);     /* Vermelho < 40 */

/* Accent — Para highlights e badges */
--color-accent-amber:   hsl(38, 92%, 50%);     /* Badges "Em Alta" */
--color-accent-violet:  hsl(263, 70%, 58%);    /* Badges premium */
```

### 2.2 Tipografia — Duo System

```css
/* === TIPOGRAFIA === */

/* Headlines: Plus Jakarta Sans — Geométrica com caráter editorial */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* Body: Inter — Legibilidade perfeita para leitura longa */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --font-headline: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body:     'Inter', system-ui, sans-serif;
  --font-mono:     'JetBrains Mono', 'Courier New', monospace;
}

/* Escala Tipográfica */
--text-xs:   0.75rem;    /* 12px — labels, captions */
--text-sm:   0.875rem;   /* 14px — metadados */
--text-base: 1rem;       /* 16px — corpo mínimo */
--text-lg:   1.125rem;   /* 18px — corpo de review */
--text-xl:   1.25rem;    /* 20px — card titles */
--text-2xl:  1.5rem;     /* 24px — section headings */
--text-3xl:  1.875rem;   /* 30px — page headings */
--text-4xl:  2.25rem;    /* 36px — hero subtitle */
--text-5xl:  3rem;       /* 48px — hero title */

/* Line Heights */
--leading-tight:  1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.7;  /* Para corpo de texto longo */
```

### 2.3 Espaçamento e Layout

```css
/* Sistema 4px */
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */

/* Border Radius */
--radius-sm:  0.375rem;  /* 6px — inputs, tags */
--radius-md:  0.75rem;   /* 12px — cards */
--radius-lg:  1rem;      /* 16px — modais */
--radius-xl:  1.5rem;    /* 24px — hero sections */
--radius-full: 9999px;   /* Pills, badges */

/* Grid */
--container-max: 1280px;
--grid-cols-posts: repeat(auto-fill, minmax(320px, 1fr));
```

### 2.4 Sombras — Multicamada (sem `shadow-lg` genérico)

```css
/* Sombras Orgânicas Multicamada */
--shadow-card: 
  0 1px 2px rgba(26, 31, 46, 0.04),
  0 4px 8px rgba(26, 31, 46, 0.04),
  0 12px 24px rgba(26, 31, 46, 0.06);

--shadow-card-hover:
  0 2px 4px rgba(26, 31, 46, 0.05),
  0 8px 16px rgba(26, 31, 46, 0.08),
  0 24px 48px rgba(26, 31, 46, 0.10);

--shadow-glass:
  0 1px 2px rgba(0, 0, 0, 0.05),
  0 4px 8px rgba(0, 0, 0, 0.05),
  0 16px 32px rgba(0, 0, 0, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.5);

--shadow-cta:
  0 4px 14px rgba(23, 169, 142, 0.3),
  0 2px 6px rgba(23, 169, 142, 0.2);
```

### 2.5 Motion Design

```css
/* Transições Base */
--transition-fast:   0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow:   0.5s cubic-bezier(0.4, 0, 0.2, 1);

/* Animações */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes crivo-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(23, 169, 142, 0.3); }
  50%       { box-shadow: 0 0 0 8px transparent; }
}

@keyframes score-fill {
  from { stroke-dashoffset: 283; } /* Animação do arco do Crivo Meter */
  to   { stroke-dashoffset: var(--score-offset); }
}

/* Card Hover */
.card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-card-hover);
  transition: all var(--transition-normal);
}

/* CTA Pulse */
.btn-primary:hover {
  animation: crivo-pulse 2s infinite;
  transform: scale(1.02);
}

/* Entrada de Elementos no Scroll */
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 3. COMPONENTES (Stitch MCP + Shadcn UI)

### 3.1 `<CrivoMeter score={85} />` — O Componente Estrela

```
Visual: SVG circular progress ring
- Ring SVG 120px x 120px
- Gradiente dinâmico: vermelho → amarelo → verde baseado na nota
- Número central em Plus Jakarta Sans Bold 700
- Label "Crivo Meter" abaixo em text-sm muted
- Animação: arco se preenche quando elemento entra no viewport
- Tooltips: ao hover, exibe dimensões avaliadas (Custo-Benefício, Durabilidade, etc.)
```

### 3.2 `<PostCard />` — Card de Review

```
Estrutura:
  ┌──────────────────────────────────────┐
  │ [Imagem 16:9 com overlay de badge]   │
  │  🔥 Em Alta    ✦ Review             │
  ├──────────────────────────────────────┤
  │ Categoria   •   Data                │
  │ **Título do Review** (2 linhas max)  │
  │ Subtítulo/excerpt (3 linhas max)     │
  │                                      │
  │ ○ Crivo  [======] 87     [Ver →]    │
  └──────────────────────────────────────┘

Estados:
  - Default: shadow-card, border sutil
  - Hover: shadow-card-hover + translateY(-4px)
  - Focus-visible: outline 2px primary
```

### 3.3 `<PriceCard marketplace="amazon" price={199.90} url="..." />` — Multi-Marketplace

```
Visual: Card compacto com logo do marketplace
  ┌──────────────────────────────┐
  │ [Logo Amazon]   R$ 199,90   │
  │                 [Ver Oferta ↗] │
  └──────────────────────────────┘

Variantes: amazon | mercadolivre | shopee
Badge: "Melhor Preço" no card com menor valor
Comportamento: sorteia por preço, destaca o menor
```

### 3.4 `<AffiliateDisclosure />` — Compliance

```
Faixa sutil no topo do post:
  "ℹ️ Como Associates da Amazon, ganhamos comissão por compras qualificadas. 
   Isso não influencia nossas avaliações. Ver política completa →"

- Cor: bg-primary-50, text-primary-700
- Sempre acima do primeiro produto
- Colapsável após primeira leitura (localStorage)
```

### 3.5 `<ProsConsList pros={[...]} cons={[...]} />`

```
Visual: Duas colunas lado a lado
  ✓ Prós              ✗ Contras
  ─────────────────   ─────────────────
  • Item 1           • Item 1  
  • Item 2           • Item 2

- Ícone de checkmark verde para prós
- Ícone X vermelho para contras
- Fundo: primary-50 e error-50 respectivamente
```

### 3.6 `<FAQAccordion questions={[...]} />` — Com Schema

```
- Radix UI Accordion (acessível, navegação por teclado)
- Cada item tem answer VISÍVEL (diferencial vs. ebommesmo)
- Injeta JSON-LD FAQPage automaticamente
- Animação: altura suave no expand/collapse
```

---

## 4. LAYOUT DE PÁGINAS

### 4.1 Home

```
┌─────────────────────────────────────────────────┐
│ NAVBAR: Logo | Categorias | Busca | [Admin]      │
├─────────────────────────────────────────────────┤
│ HERO STRIP (não é um hero gigante)               │
│  "Avaliações honestas. Escolhas inteligentes."   │
│  [Input de busca grande]  [Ver Mais Vendidos →]  │
├─────────────────────────────────────────────────┤
│ EM ALTA AGORA (horizontal scroll, 4 cards)       │
│  ← [Card] [Card] [Card] [Card] →                │
├─────────────────────────────────────────────────┤
│ ÚLTIMAS ANÁLISES                                 │
│  [Card] [Card] [Card]                           │
│  [Card] [Card] [Card]                           │
│  [Carregar mais]                                │
├─────────────────────────────────────────────────┤
│ CATEGORIAS (grid de ícones)                      │
│  📱 Tech | 🏠 Casa | 🏋️ Esporte | ...          │
├─────────────────────────────────────────────────┤
│ COMO AVALIAMOS (strip de confiança)              │
│  Dados Reais | Comparamos Preços | Sem Patrócio  │
├─────────────────────────────────────────────────┤
│ FOOTER                                           │
└─────────────────────────────────────────────────┘
```

### 4.2 Post de Review

```
┌─────────────────────────────────────────────────┐
│ NAVBAR                                           │
├─────────────────────────────────────────────────┤
│ BREADCRUMBS: Home > Categoria > Review atual     │
├─────────────────────────────────────────────────┤
│ POST HEADER (above the fold)                     │
│  Badge de Categoria | Data | "Atualizado em..."  │
│  H1: Título do Review                           │
│  Subtítulo/intro                                │
│  [Crivo Meter: 87] [Disclosure strip]           │
├──────────────────┬──────────────────────────────┤
│ CONTEÚDO (65%)   │ SIDEBAR (35%)                │
│                  │  ┌──────────────────────┐    │
│ Carrossel de     │  │ TOP PICK do Review   │    │
│ Produtos         │  │ [Imagem]             │    │
│                  │  │ R$ 199,90 na Amazon  │    │
│ Critérios de     │  │ [Ver na Amazon ↗]   │    │
│ Escolha          │  └──────────────────────┘    │
│                  │  (sticky no desktop)          │
│ Análise 1 a 10   │                              │
│  (PriceCards +   │                              │
│   ProsConsList)  │                              │
│                  │                              │
│ Comparativo      │                              │
│                  │                              │
│ FAQ (Accordion   │                              │
│ com respostas)   │                              │
│                  │                              │
│ Artigos          │                              │
│ Relacionados     │                              │
└──────────────────┴──────────────────────────────┘
│ FOOTER                                           │
└─────────────────────────────────────────────────┘

Mobile: sidebar vira seção full-width acima do conteúdo
```

---

## 5. MODELAGEM DO BANCO DE DADOS (Supabase)

### 5.1 Tabelas Principais

```sql
-- Categorias de produto
CREATE TABLE categories (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  icon_name   text,           -- Nome do ícone Lucide
  color       text,           -- HSL para destaque visual
  created_at  timestamptz DEFAULT now()
);

-- Posts de review
CREATE TABLE posts (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text NOT NULL,
  slug            text NOT NULL UNIQUE,
  excerpt         text,
  content         jsonb NOT NULL,          -- Estrutura do conteúdo (MDX-like JSON)
  og_image_url    text,
  category_id     uuid REFERENCES categories(id),
  crivo_score     integer CHECK (crivo_score BETWEEN 0 AND 100),
  score_breakdown jsonb,                   -- {"custo_beneficio": 85, "durabilidade": 80, ...}
  status          text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at    timestamptz,
  updated_at      timestamptz DEFAULT now(),
  created_at      timestamptz DEFAULT now(),
  generated_by    text DEFAULT 'human',   -- 'human' | 'agent'
  agent_run_id    uuid                    -- FK para agent_runs se gerado por IA
);

-- Produtos linkados a posts
CREATE TABLE products (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id        uuid REFERENCES posts(id) ON DELETE CASCADE,
  name           text NOT NULL,
  description    text,
  image_url      text,
  position       integer NOT NULL,        -- Ranking (1º melhor, 2º, etc)
  badge          text,                    -- 'top_pick' | 'best_value' | 'premium'
  pros           text[],
  cons           text[],
  created_at     timestamptz DEFAULT now()
);

-- Preços por marketplace (pode mudar com o tempo)
CREATE TABLE product_prices (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id     uuid REFERENCES products(id) ON DELETE CASCADE,
  marketplace    text NOT NULL CHECK (marketplace IN ('amazon', 'mercadolivre', 'shopee')),
  price          numeric(10,2),
  affiliate_url  text NOT NULL,           -- URL com tag de afiliado
  asin           text,                    -- Para Amazon
  is_active      boolean DEFAULT true,
  last_checked   timestamptz DEFAULT now(),
  created_at     timestamptz DEFAULT now()
);

-- FAQ por post
CREATE TABLE post_faqs (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    uuid REFERENCES posts(id) ON DELETE CASCADE,
  question   text NOT NULL,
  answer     text NOT NULL,
  position   integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Runs do agente (auditoria)
CREATE TABLE agent_runs (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  triggered_at  timestamptz DEFAULT now(),
  completed_at  timestamptz,
  status        text DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed')),
  post_id       uuid REFERENCES posts(id),
  category_id   uuid REFERENCES categories(id),
  search_query  text,                     -- Query usada para pesquisar
  llm_model     text,                     -- Modelo de IA usado
  error_message text,
  metadata      jsonb
);

-- Monitor de links (saúde dos afiliados)
CREATE TABLE link_health_checks (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  price_id     uuid REFERENCES product_prices(id),
  checked_at   timestamptz DEFAULT now(),
  status_code  integer,
  is_healthy   boolean,
  error_detail text
);
```

### 5.2 Views e Funções Úteis

```sql
-- View: Posts publicados com metadados para listagem
CREATE VIEW published_posts_summary AS
SELECT 
  p.id, p.title, p.slug, p.excerpt, p.og_image_url,
  p.crivo_score, p.published_at,
  c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
  p.generated_by
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC;

-- Função: links quebrados para notificação
CREATE OR REPLACE FUNCTION get_broken_links()
RETURNS TABLE(post_title text, affiliate_url text, marketplace text) AS $$
  SELECT p.title, pp.affiliate_url, pp.marketplace
  FROM link_health_checks lhc
  JOIN product_prices pp ON lhc.price_id = pp.id
  JOIN products prod ON pp.product_id = prod.id
  JOIN posts p ON prod.post_id = p.id
  WHERE lhc.is_healthy = false AND lhc.checked_at > now() - interval '24 hours'
$$ LANGUAGE SQL;
```

### 5.3 Row Level Security

```sql
-- Posts: leitura pública apenas para publicados
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts publicados são públicos" ON posts
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admin pode tudo em posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Preços: leitura pública, escrita somente admin
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Preços são públicos" ON product_prices
  FOR SELECT USING (true);
CREATE POLICY "Admin gerencia preços" ON product_prices
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 6. DIVISÃO PARA STITCH MCP

### Screens a Gerar no Stitch

| Screen | Prompt para Stitch | Prioridade |
|--------|-------------------|------------|
| `home` | Portal de reviews clean light mode, carrossel horizontal "Em Alta", grid de cards 3 colunas, strip de categorias com ícones | Alta |
| `post-detail` | Review de produto, crivo meter SVG circular, carrossel de imagens, sidebar sticky com preço Amazon, accordion FAQ | Alta |
| `category-page` | Listagem com filtros laterais (nota, preço), grid de posts, contador de resultados | Média |
| `admin-dashboard` | Dashboard financeiro/editorial, métricas de cliques, lista de posts recentes, status do agente | Média |
| `admin-post-editor` | Editor de post rico, formulário de produtos, configuração de preços por marketplace | Média |
| `search-results` | Resultados de busca global com highlight de termo, agrupados por relevância | Baixa |

---

## 7. EDGE FUNCTIONS (Agente Autônomo)

### `agent-publish` — Publicação Autônoma

```typescript
// supabase/functions/agent-publish/index.ts
// Trigger: Supabase Cron (pg_cron) 3x/dia

// Fluxo Multi-Provider Fallback:
// 1. Tenta OpenRouter (Modelo A)
// 2. Se falhar/timeout, tenta Gemini Nativo (Modelo B)
// 3. Se falhar, tenta Anthropic Nativo (Modelo C)

// Regra de Preço:
// O preço DEVE vir de uma fonte real-time no momento da geração ou renderização. 
// Se o valor for null/undefined/estimado, exibir "Ver Oferta" sem o preço numérico.

interface PostGenerationSchema {
  title: string;
  slug: string;
  excerpt: string;
  crivo_score: number;
  score_breakdown: Record<string, number>;
  products: Array<{
    name: string;
    description: string;
    asin: string;
    badge?: 'top_pick' | 'best_value' | 'premium';
    pros: string[];
    cons: string[];
    estimated_price: number;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  criteria: string[];
}
```

### `link-health-check` — Monitor de Links

```typescript
// supabase/functions/link-health-check/index.ts  
// Trigger: Cron 1x/dia (02:00 BRT)
// Checa todos os affiliate_urls com HEAD request
// Insere resultado em link_health_checks
// Se broken: envia notificação (webhook ou email)
```

---

## 8. ACESSIBILIDADE (WCAG 2.2)

| Requisito | Implementação |
|-----------|--------------|
| Contraste 4.5:1 | text-primary (#1A1F2E) em bg-base (#F7F8FA) → ratio 13:1 ✓ |
| Foco visível | `outline: 2px solid var(--color-primary-500); outline-offset: 2px` em todos interativos |
| Alvos de toque 44×44px | Todos os botões e links com `min-height: 44px; min-width: 44px` |
| Alt text em imagens | Gerado pelo agente: `alt="[Nome do produto] - Foto do produto na [cor] disponível na Amazon"` |
| Semântica HTML | `<header>`, `<main>`, `<article>`, `<section>`, `<nav>`, `<footer>` + roles ARIA |
| Accordion acessível | Radix UI Accordion com `aria-expanded`, `aria-controls`, `role="region"` |
| Skip to main content | Link invisível no topo que aparece no focus |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` para desativar animações |

---

## 9. SEO TÉCNICO

### JSON-LD por Tipo de Página

```typescript
// Post de Review
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "datePublished": post.published_at,
  "dateModified": post.updated_at,
  "author": { "@type": "Organization", "name": "CrivoCerto" },
  "publisher": { "@type": "Organization", "name": "CrivoCerto", "logo": "..." }
};

const reviewSchema = {
  "@context": "https://schema.org", 
  "@type": "Review",
  "reviewRating": { "@type": "Rating", "ratingValue": post.crivo_score, "bestRating": 100 },
  "itemReviewed": { "@type": "Product", "name": post.title }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": post.faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
  }))
};
```

---

## 10. PERFORMANCE TARGETS

| Métrica | Target | Estratégia |
|---------|--------|------------|
| LCP | ≤ 2.5s | ISR + next/image + CDN |
| INP | ≤ 200ms | Server Components + React 18 |
| CLS | ≤ 0.1 | aspect-ratio em imagens, sem layout shift |
| TTFB | ≤ 800ms | Vercel Edge Network + CDN |
| Bundle JS | ≤ 150kb | Tree-shaking, dynamic imports |
| Lighthouse | ≥ 90 | All categories |
