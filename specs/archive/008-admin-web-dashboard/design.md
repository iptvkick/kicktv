# Design: Restauração SDD e Admin Widescreen

## 1. Padrão Visual (Minimalismo Claro - SDD Oficial)
A paleta obedece estritamente o `sdd-design.md`:
- **Fundo Global:** `#f5f6f7` (Cinza muito claro) para evitar o branco ofuscante.
- **Cartões e Superfícies:** `#ffffff` (Branco puro) com `shadow-sm` ou `shadow-md` muito suaves.
- **Textos e Destaques (O "Preto" elegante):** `#212529` (Dark Charcoal). Todos os botões principais, barras ativas, ícones importantes usarão esta cor.
- **Sem Neon:** Abolição do `#00FF66`.

## 2. O Conceito Admin (Full Web / Widescreen)
A experiência de Administração do SaaS precisa de espaço para gestão de faturas, servidores e listas de usuários.
- **Layout Geral Desktop:** Um layout em Flexbox ou Grid `grid-cols-[250px_1fr]` para Desktop.
- **Sidebar (Menu Lateral):** Fixa à esquerda. Fundo `#ffffff`, textos e ícones em cinza escuro, com o item ativo destacado com fundo cinza super claro e texto `#212529` em negrito.
- **Área de Conteúdo (Main):** Ocupa o restante da tela (`w-full`), permitindo que as tabelas "respirem".

## 3. Componentes de Performance e Transição
1. **`AdminSidebar.tsx`**: Novo componente para `/admin`.
2. **`SkeletonLoading`**: Esqueletos cinza claro (`bg-gray-200 animate-pulse`) que preenchem as caixas antes do dado chegar.
3. **`PageTransition.tsx`**: Um wrapper global (ou usado por rota) em volta de `{children}` utilizando `motion.div` do Framer Motion para transições de `opacity` (fade in/fade out) de 0.2s.

## 4. O Problema da Landing Page
A Landing Page (`/`) vai adotar um estilo "Monocromático Premium". Fundo branco, tipografia gigantesca em Charcoal (`#212529`), e botões invertidos (preto com texto branco) para dar o peso visual sem precisar usar Dark Mode ou Neon.
