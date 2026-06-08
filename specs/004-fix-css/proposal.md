# Proposal: Correção Crítica do Tailwind v4 / CSS

## 1. Visão Geral
Restaurar a estilização CSS da aplicação eliminando as falhas de compilação do Vite causadas pela sintaxe incorreta no `src/styles.css`.

## 2. Requisitos Técnicos
- Remover a keyword `inline` do `@theme` no `src/styles.css` que causa quebra silenciosa no AST parser do `@tailwindcss/vite`.
- Garantir que a ordem dos plugins em `vite.config.ts` seja segura (idealmente `tailwindcss()` deve ter precedência, embora em v4 a ordem geralmente já venha tratada, não custa revisar).
- Remover diretivas desnecessárias de `@source` caso estejam causando loop infinito, dependendo apenas do parser nativo do Tailwind.

## 3. BDD Scenarios

### Cenário: Renderização com Tailwind Ativo
- **Given (Dado):** O desenvolvedor inicia o servidor de desenvolvimento via `npm run dev`.
- **When (Quando):** O navegador requisita `localhost:8080/`.
- **Then (Então):** A página é renderizada com todos os estilos TripGlide (background gelo `#f5f6f7`, botões escuros, fontes aplicadas) e nenhum fallback HTML puro é visível.
