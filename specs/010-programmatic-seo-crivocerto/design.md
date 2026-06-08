# Spec 010: Design & Database Architecture

## 1. UX/UI Architecture (Stitch MCP / Frontend)

A interface de usuário do CrivoCerto v3 será reimaginada focando na estética de 2026 detalhada na skill `ux-ui-architect-2026`. O design abandonará o minimalismo chato ("blanding") e usará o padrão **Apple Liquid Glass** misturado com uma Engenharia de Conversão agressiva.

### 1.1 Aesthetic & Visual Identity
- **Vibe Geral:** Neo-Minimalismo com Maximalismo Tátil. A página precisa ser confiável ("Editorial Trust") mas incrivelmente estimulante e tátil para convidar ao clique no botão de afiliado.
- **Tipografia:** `Outfit` (Headlines colossais e agressivas, ex: text-5xl/6xl) + `Inter` (Corpo legível para os comparativos técnicos).
- **Paleta de Cores:** Fundo `zinc-950` para economia energética OLED, realçado por Cores Dopamínicas como Electric Blue ou Teal (#17A98E) para focar estritamente nos Call to Actions (CTAs).

### 1.2 O Layout da Rota Programática (`/guias/:categoria/:persona/:contexto`)
A página deve obedecer a uma estrutura escaneável em 5 segundos:
1. **Hero Storytelling:**
   - Título GIGANTE com dor + benefício.
   - Subtítulo com promessa ("Os melhores custo-benefício testados").
   - Fundo com `backdrop-blur-xl` e gradiente metálico super sutil.
2. **Context Section:**
   - Um alerta / callout estilo `Glassmorphism` respondendo rapidamente: "Para quem é este guia?"
3. **Bento Box Top 5:**
   - Os produtos de ouro. Grid assimétrico.
   - O #1 em destaque massivo (Card 2x mais largo).
   - Efeito *Liquid Glass* no card (sombra profunda multicamada, `bg-white/5 border border-white/10`).
   - Imagens oficiais das APIs (sem placeholders), centralizadas.
4. **Cards de Produto - A Conversão:**
   - O botão principal (`CTA`) de afiliado não será achatado. Terá `h-12` (48px), contraste altíssimo, hover animado (`scale 1.03`, `pulse`) e text copy agressiva: "Caça promoção? Vê o preço na Shopee."
   - *Microinteração:* Passar o mouse pelo card causa um leve `translateY(-4px)` (tátil).
5. **Top 10 Grid:**
   - Uma lista mais condensada, cards menores, rápida escaneabilidade, todos com o mesmo botão de alta conversão.

## 2. Database Architecture (Supabase MCP / Backend)

Para suportar essa escalabilidade sem doorway abuse, o modelo relacional será repensado para desvincular o texto/página (`guides`) da base de conhecimento material (`products`).

### 2.1 Table: `products`
Esta tabela mantém a "Verdade" dos produtos, para ser reaproveitada em N guias.
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_slug TEXT NOT NULL,
  crivo_score INTEGER CHECK (crivo_score BETWEEN 0 AND 100),
  score_breakdown JSONB, -- Ex: { "durabilidade": 80, "ruido": 90 }
  is_trending BOOLEAN DEFAULT FALSE,
  primary_image_url TEXT, -- OBRIGATÓRIO: Virá da PAAPI/Shopee/ML
  affiliate_links JSONB, -- Ex: { "amazon": "https...", "shopee": "https...", "ml": "https..." }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Table: `guides` (Programmatic SEO Pages)
Esta tabela guarda as combinações long-tail e os textos agressivos gerados pelo Hermes.
```sql
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug TEXT NOT NULL,
  persona_slug TEXT NOT NULL,  -- Ex: "donos-de-pet"
  context_slug TEXT NOT NULL,  -- Ex: "apartamento-pequeno"
  url_path TEXT UNIQUE NOT NULL, -- Ex: "/guias/aspirador/donos-de-pet/apartamento-pequeno"
  headline TEXT NOT NULL,      -- "Top 7 aspiradores que não espalham pelos em kitnets"
  intro_text TEXT NOT NULL,    -- Markdown com BDD e introdução persuasiva
  faq_json JSONB,              -- Perguntas e respostas úteis para Schema JSON-LD
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_revalidated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 Table: `guide_products` (A Relação Many-to-Many)
Ponte que diz quais produtos entraram naquele top 10 específico e por quê.
```sql
CREATE TABLE guide_products (
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rank_position INTEGER NOT NULL, -- 1 a 10
  contextual_pitch TEXT NOT NULL, -- O "por que ele entrou aqui" (2-3 bullets focados na persona)
  PRIMARY KEY (guide_id, product_id)
);
```

## 3. Integração com a Edge Function `hermes-gateway`
A Action atual `insert_post` precisará ser expandida para três novas Actions:
1. `upsert_product`: Adiciona ou atualiza dados duros do produto (imagem oficial PAAPI, nota).
2. `insert_guide`: Cria a página/conceito (categoria/persona/contexto + copy agressiva).
3. `link_product_to_guide`: Aloca a posição do produto no Top 10 e manda o *Pitch* de vendas daquele produto para aquela página em específico.
