# BDD Scenarios & Requirements: Admin Dashboard Overhaul

## 1. O Problema
O painel admin atual (`src/routes/admin/index.tsx`) é estático, genérico e carece de dados cruciais para a tomada de decisão no modelo Programmatic SEO de afiliados. O design não reflete as diretrizes do **UX/UI 2026** e carece de estatísticas essenciais como CTR, Taxa de Conversão por Categoria e EPC (Earnings Per Click).

## 2. A Solução
Refatorar a UI do Admin implementando métricas avançadas baseadas em views e clicks, construindo gráficos detalhados para Amazon vs Mercado Livre vs Shopee, e implementando componentes ricos (Glassmorphism, High-Contrast e Micro-interações) em total compliance com a spec de design 2026.

## 3. Requisitos
- Adição da métrica **CTR (Click-Through Rate)** comparando Visitas de Páginas vs Cliques de Saída (Affiliate Clicks).
- Ranking de Guias (Top Páginas que mais geram receita/cliques).
- Design refatorado com paleta Dopamínica e Apple Liquid Glass.
- Gráficos interativos melhorados.

## 4. BDD Scenarios

### Cenário: Visualização de Métricas Globais
- **Given (Dado):** O usuário acessou a rota `/admin`.
- **When (Quando):** Os dados de `clicks_tracking` e `page_views` (nova métrica) forem carregados.
- **Then (Então):** A tela deve exibir cards flutuantes (Glassmorphism) com o "CTR Geral", "Volume de Cliques" e "Projeção de EPC".

### Cenário: Drill-down por Categoria
- **Given (Dado):** O dashboard carregou o ranking de categorias.
- **When (Quando):** O admin clicar na categoria "Aspiradores".
- **Then (Então):** Um sub-painel se expande detalhando o split de tráfego entre Amazon e Mercado Livre para esta categoria específica.
