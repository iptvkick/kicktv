# Design Spec 023

## Diretrizes Visuais
- **Vibe:** "Limpo e Funcional". Sem exageros. A navegação baseada em abas inferiores dita que todas as rotas principais devem ter o mesmo peso visual de cabeçalho.
- **Backgrounds:** `bg-zinc-50` ou `bg-white` para as telas principais, unificando a cor base do container root.
- **Tipografia:**
  - Títulos de página (Page Headers): `text-2xl font-bold tracking-tight text-foreground`.
  - Subtítulos: `text-sm text-foreground/60`.
- **Containers:** 
  - O container principal deve ter `flex-1 flex flex-col pt-12 pb-24 px-6` (padrão de tela com aba flutuante inferior).
  - Remoção de todos os `<ArrowLeft />` flutuantes das telas que fazem parte do Menu Inferior.
