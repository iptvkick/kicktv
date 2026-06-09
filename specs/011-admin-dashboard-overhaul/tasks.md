# Checklist de Execução

## 1. Backend e Modelagem de Dados
- [ ] Criar tabela/mecanismo para computar Page Views (`guide_views`).
- [ ] Criar RPC ou tipagens derivadas no Supabase para agregar Cliques vs Views (cálculo de CTR).

## 2. Stitch MCP & UI
- [ ] Refatorar a estrutura do `admin/index.tsx` usando Layouts Flexíveis (Bento Grid).
- [ ] Adicionar os cards de `CTR` e `Ranking de Guias`.
- [ ] Aplicar o styling Liquid Glass em todos os cards (`bg-white/5 backdrop-blur-xl border-white/10`).

## 3. Integração
- [ ] Atualizar o Recharts para utilizar as novas cores curadas.
- [ ] Otimizar os requests da rota Admin para evitar waterfall (usar `Promise.all` para chamadas independentes).
- [ ] Passar pelo Quality Gate UX 2026 (Responsividade e micro-interações).
