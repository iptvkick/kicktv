# Tasks: Fix CSS

## Fase 1: Correção do CSS Base
- [ ] Editar `src/styles.css`: Substituir `@theme inline {` por `@theme {`.
- [ ] Editar `src/styles.css`: Remover os imports `@source` caso não sejam estritamente necessários para o funcionamento padrão do Tailwind v4 no Vite.

## Fase 2: Configuração e Validação
- [ ] Validar ordem em `vite.config.ts`.
- [ ] Reiniciar o build/dev server e testar curl na URL CSS.
- [ ] Garantir que classes como `bg-background` e `text-foreground` voltem a aparecer.
