# Phase 0: Research (Fix CSS)

**Contexto**: O usuário reportou que a Landing Page, ao rodar localmente (`npm run dev`), está sendo renderizada como HTML puro (sem nenhum estilo aplicado), apesar das classes Tailwind estarem presentes nos arquivos TSX e o arquivo `styles.css` estar sendo injetado no HTML. Ao tentar corrigir, o usuário invocou explicitamente o workflow `/vibe-proposal`.

### Análise do Problema
1. O servidor Vite injeta `<link rel="stylesheet" href="/@fs/.../styles.css">` corretamente no DOM.
2. Contudo, as requisições para o `styles.css` via Vite Dev Server sofrem "timeout" (congelam o stream). O Vite tenta compilar o CSS e entra em um loop infinito ou trava a thread.
3. Analisando o `src/styles.css`, identificamos a seguinte sintaxe do Tailwind CSS v4:
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```
4. **Causa Raiz:** A sintaxe `@theme inline` não é padrão no Tailwind v4 final (utiliza-se apenas `@theme { ... }`). A presença de diretivas inválidas ou de uma importação circular com o `@source` está causando o travamento do plugin `@tailwindcss/vite` durante o parse da AST.
5. Adicionalmente, garantir a ordem correta dos plugins no `vite.config.ts` é uma boa prática.

### Objetivo
Corrigir a compilação do Tailwind v4 para que a interface recupere a "vibe" TripGlide implementada, garantindo o funcionamento do SSR e do client-side.
