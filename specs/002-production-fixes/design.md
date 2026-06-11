# Design: Correções de Produção e Interface

## UX/UI
O ajuste na home foca em micro-refinamentos de *spacing* (Margens e Paddings).
- Reduzir o `pt-32` e `space-y-32` do container principal em `src/routes/index.tsx`.
- Reduzir a `mt-12` na Hero section.

## Error Boundary
- Implementar componente de erro limpo, seguindo as diretrizes WCAG 2.2, contendo uma mensagem amigável e um botão de recarregar a página.

## Metadados (SEO)
- As tags Open Graph, Title e Description no `__root.tsx` passarão a focar na proposta de valor de streaming (IPTV).
