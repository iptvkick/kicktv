## Checklist de Implementação (002-production-fixes)

- [x] (Frontend) `src/routes/index.tsx`: Reduzir as classes `pt-32`, `space-y-32` e `mt-12` para diminuir o espaçamento excessivo.
- [x] (Integração) `src/integrations/supabase/client.ts`: Remover qualquer referência a `process.env`, mantendo exclusivamente `import.meta.env`.
- [x] (Integração) Criar `src/start.ts`: Importar `createStart` e registrar o `functionMiddleware` com `attachSupabaseAuth`.
- [x] (Frontend) `src/routes/__root.tsx`: Implementar `errorComponent` e `notFoundComponent` na configuração do `createRootRoute`.
- [x] (Frontend) `src/routes/__root.tsx`: Alterar metadados SEO/OG para a proposta de IPTV.
- [x] (Deploy) Validar a build local (`npm run build`).
