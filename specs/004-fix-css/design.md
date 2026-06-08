# Design Architecture: Fix CSS

## 1. UI/UX Impact
- **Nenhum Redesign**: O foco é resgatar o design aprovado previamente na Spec 003 (estética TripGlide).
- **Consistência Visual**: Ao corrigir o motor do Tailwind, a página voltará a renderizar os gradientes sutis, as micro-animações do framer-motion (já que elas dependem muitas vezes das classes injetadas para tamanho/posicionamento flexível) e a tipografia "Instrument Sans".

## 2. Ajustes de CSS Nativo
No Tailwind v4, o bloco de variáveis CSS é integrado da seguinte maneira:
```css
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-accent: var(--accent);
  --font-sans: "Instrument Sans", Arial, Helvetica, sans-serif;
}
```
A palavra `inline` será removida.
