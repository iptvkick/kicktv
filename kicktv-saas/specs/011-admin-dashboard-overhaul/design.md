# UX/UI Design - Admin Overhaul 2026

Baseado nas diretrizes do `ux-ui-architect-2026`.

## Estética Geral
- **Estilo:** Dark Mode Elegante + Apple Liquid Glass.
- **Cores (Paleta Dopamínica Curada):** 
  - Fundo: `Zinc-950`
  - Destaque Positivo (Up/Growth): `Emerald-400`
  - Amazon: `Amber-500`
  - Mercado Livre: `Yellow-400`
  - Shopee: `Orange-500`
- **Materiais:** Efeitos translúcidos usando `backdrop-blur-xl`, `bg-white/5` e bordas com `border-white/10`.

## Componentes para o Stitch MCP
Ao implementar com o Stitch, devemos solicitar:

### 1. Liquid KPI Bento Box
Grids assimétricos para as KPIs principais (Cliques, CTR, Receita Estimada). O card mais importante (CTR) deve ser 2x maior na horizontal.

### 2. Micro-interações
- Efeito de `hover:translate-y-1` nos cards.
- Gráficos com tooltips suaves e fade-in on mount.

### 3. Acessibilidade (WCAG 2.2)
- Textos com alto contraste.
- Focus outlines claros (`ring-2 ring-teal-500`) em todos os botões e links.
