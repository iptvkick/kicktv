# 🔬 Research — CrivoCerto v2.0
**ID:** `005-crivocerto-v2`  
**Data:** 2026-05-20  
**Fase:** RPI-R — Pesquisa e Contexto

---

## 1. Contexto do Projeto

O usuário possui um blog de reviews com afiliados chamado **CrivoCerto** (`crivocerto.davicode.me`), atualmente no WordPress. O objetivo é reconstruir do zero como uma aplicação Next.js moderna, com:

- Design premium inspirado no **conciliamec.lovable.app** (clean, light, Revolut-style) 
- Estrutura de conteúdo inspirada no **ebommesmo.com.br** (portal de reviews) — mas sem "cara de IA" e com mais personalidade editorial
- Publicação automatizada via **agente autônomo** (3x/dia) que pesquisa e posta reviews com links de afiliado
- Monetização: **Amazon Associados** (ativo) + **Mercado Livre Afiliados** e **Shopee Afiliados** (temporariamente desativados)

---

## 2. Análise do Concorrente Principal: É Bom Mesmo? (ebommesmo.com.br)

### O que funciona bem
- **Stack técnica**: Next.js + geração estática → Performance excelente (Core Web Vitals verdes)
- **Estrutura de post**: Carrossel de produtos em destaque → grid de reviews → Prós/Contras → Tabela comparativa → FAQ → Artigos relacionados
- **SEO**: Título no formato `[Produto] é Bom Mesmo? As X Melhores Opções` → capta intenção de compra "transacional"
- **Meta tags**: og:image 1200×628, canonical, author tag, keywords explícitas
- **Afiliados**: Tag Amazon `tag=ebommesmo-org-20` injetada em todos os links via parâmetro `linkCode=osi`
- **Persona editorial**: "Ricardo Sanches" + "Laboratório É Bom Mesmo?" — gera autoridade (E-E-A-T)
- **Estrutura**: 166+ páginas de reviews → volume impressionante de conteúdo
- **Publisher**: `@guiadotop` no Twitter — coerência de marca

### O que pode ser melhorado (nosso diferencial)
- Design genérico — fundo branco puro, sem personalidade visual
- Posts com "cara de IA" óbvia: textos repetitivos, ausência de dados concretos além dos prós/contras
- Sem rating numérico visual (nota 0-10)
- Sem comparativo entre marketplaces (Amazon vs. Mercado Livre vs. Shopee)
- Sem filtros ou buscas por categoria na home
- Seções FAQ são mostradas sem resposta — apenas a pergunta expandível (UX ruim)
- Sem modo escuro ou personalização de leitura

### Padrão de Post Descoberto
```
URL: /[slug-produto]-e-bom-mesmo
Estrutura: 
  1. Hero: Carrossel de imagens de produtos (Amazon CDN)
  2. Índice do Artigo
  3. Critérios de Escolha
  4. Análise Detalhada (1 a 10 produtos com prós/contras)
  5. Comparativo de Preços
  6. Dicas para Escolher
  7. FAQ (sem respostas visíveis — bad UX)
  8. Especialistas (fotos + bio)
  9. Artigos Relacionados
```

---

## 3. Referência de Design: ConciliaMec (conciliamec.lovable.app)

**Identidade**: Dashboard financeiro para mecânicas populares  
**Vibe**: Clean, minimal, light mode, tipografia forte, espaçamento generoso  
**O que nos inspira:**
- Fundo branco/off-white com cards limpos e bordas sutis
- Hierarquia tipográfica clara — títulos em peso 700+, corpo em peso 400-500
- Dados numéricos em destaque com cor de accent (verde para positivo, vermelho para negativo)
- Micro-animações e separação clara entre seções sem uso de linhas divisórias brutas
- Muito espaço em branco — sensação de "respirar"
- Sem gradientes pesados — tons neutros com 1 cor de destaque
- Inspiração Revolut: confiança transmitida pela clareza

---

## 4. Análise do Mercado de Blogs de Afiliados Brasil 2026

### Oportunidade
- Mercado crescendo: Amazon BR, Mercado Livre e Shopee expandindo programas de afiliados
- Volume de buscas do tipo "melhor [produto]" e "[produto] vale a pena?" continuam altíssimos
- Saturação de conteúdo de IA genérico → **diferencial de qualidade editorial é agora vantagem competitiva**
- E-E-A-T do Google penaliza conteúdo sem demonstração de experiência real

### Keywords de Alta Conversão (Intenção Transacional)
- `melhor [produto] para [objetivo]`
- `[produto] vale a pena?`
- `[produto A] vs [produto B]`
- `[produto] review`
- `[produto] é bom mesmo?` (branded do concorrente — podemos usar variações)

### Stack Recomendada pela Pesquisa
- **Framework**: Next.js 14+ com App Router + ISR (conteúdo se auto-atualiza)
- **Rendering**: SSG para posts estáticos, ISR com `revalidate: 3600` para preços dinâmicos
- **SEO**: JSON-LD Schema.org (Article + Product + Review + FAQPage)
- **Banco de dados**: Supabase (PostgreSQL) — posts, categorias, produtos, afiliados
- **Automação do agente**: Edge Functions Supabase + cron-job externo (n8n/Cloudflare Workers)
- **Imagens**: next/image com domínios Amazon/ML/Shopee liberados, WebP automático
- **Deploy**: Vercel (zero-config Next.js, Edge Network global)

### Automação (Agente Autônomo)
O agente precisa de:
1. **Trigger**: Cron 3x/dia (ex: 07:00, 13:00, 19:00 BRT)
2. **Research**: Pesquisa tendências (Google Trends API ou Firecrawl scrape de "Mais Vendidos" da Amazon BR)
3. **Content Generation**: LLM com prompt estruturado → gera JSON de post
4. **Image**: Extrai imagem do produto da Amazon via URL ou gera OG image
5. **Publish**: POST para Supabase via API → ISR revalida a página
6. **Affiliate Link**: Injeta `tag=crivocerto-20` (Amazon) automaticamente

---

## 5. Stack Técnica Final Recomendada

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Frontend** | Next.js 14 (App Router) | SSG+ISR, SEO nativo, performance |
| **UI Components** | Shadcn/ui + Radix UI | Acessibilidade, customizável |
| **Styling** | Tailwind CSS v3 + CSS Variables | Velocidade, design tokens |
| **Database** | Supabase (PostgreSQL) | RLS, Edge Functions, real-time |
| **Auth** | Supabase Auth | Para o painel admin do agente |
| **Deploy** | Vercel | CI/CD, ISR, Edge Network |
| **Images** | next/image + Amazon CDN | Performance otimizada |
| **SEO** | JSON-LD Schema.org | Rich snippets no Google |
| **Analytics** | Vercel Analytics (LGPD-friendly) | Sem cookies, performance |
| **Agente** | Supabase Edge Functions + Cron | Serverless, sem servidor extra |

---

## 6. Análise de Risco e Compliance

| Risco | Mitigação |
|-------|-----------|
| Penalização Google por conteúdo IA | Personalidade editorial + dados reais + E-E-A-T signals |
| Conta de afiliado suspensa | Disclosure visible, sem cloaking, respeitar ToS |
| Links afiliados quebrados | Sistema de link health-check periódico |
| Conteúdo duplicado | Canonical tags + conteúdo único por post |
| Rate limit APIs marketplaces | Cache em Supabase, fallback para dados estáticos |

---

## 7. Diferenciais Estratégicos do CrivoCerto v2 vs. ebommesmo

1. **"Crivo Meter"**: Badge de nota 0-100 visual por produto (ebommesmo não tem)
2. **Multi-marketplace**: Mostrar preço em Amazon + ML + Shopee no mesmo card
3. **Filtros inteligentes**: Por categoria, faixa de preço, nota, data
4. **Tendências em alta**: Seção "Em Alta Agora" atualizada pelo agente
5. **Design premium com identidade**: Não mais fundo branco genérico — identidade visual própria
6. **FAQ com respostas completas**: Schema FAQPage para rich snippets no Google
7. **Sem "cara de IA"**: Tom editorial consistente, dados específicos, comparações reais
