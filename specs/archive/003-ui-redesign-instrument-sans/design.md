# Spec 003: UI Redesign (Instrument Sans) - Design & Arquitetura

## 1. Design System (CSS Global)

O arquivo `src/styles.css` será profundamente limpo.

### Paleta Base
```css
:root {
  /* Cores Base do Design (Dribbble Reference) */
  --background: #f5f6f7;
  --foreground: #212529;
  --card: #ffffff;
  --card-border: #e5e7eb;
  
  /* Primary Action - Baseado no Banking App */
  --primary: #212529;
  --primary-foreground: #ffffff;
  
  /* Accent Color (Verde Neobank/Viagem) */
  --accent: #a3e635; /* Verde vibrante */
  --accent-foreground: #212529;

  --radius-card: 1.5rem; /* 24px - Bem arredondado */
  --radius-pill: 9999px; /* Pill shapes */
}

.dark {
  --background: #0a0a0f;
  --foreground: #f5f6f7;
  --card: #212529;
  --card-border: #374151;
  
  --primary: #f5f6f7;
  --primary-foreground: #212529;
}
```

### Tipografia
- Substituir as importações antigas no `index.html` por:
  `<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">`
- Setar `font-family: 'Instrument Sans', sans-serif;` globalmente.

## 2. Componentes Estruturais

### Floating Pill Navbar (Mobile)
- Elemento `<nav>` posicionado `fixed bottom-4 left-1/2 -translate-x-1/2`.
- Estilo: `bg-primary text-primary-foreground rounded-full px-6 py-3 flex gap-4`.
- Apenas visível em `< md`. No Desktop, usamos uma barra lateral limpa ou topbar comum.

### Cards UI
- Deixarão de ter `liquid-glass`.
- Classe base sugerida: `bg-card text-foreground rounded-[24px] border border-border shadow-sm`.
- Imagens de topo de card: `rounded-t-[24px]`.

### Botões
- Totalmente pill-shaped: `rounded-full`.
- Ação principal forte: Fundo sólido (`bg-primary` ou `bg-accent`), sem stroke fino.
- Sem hover 3D. Apenas `hover:opacity-90` ou `hover:bg-primary/90`.
