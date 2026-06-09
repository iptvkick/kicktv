# Checklist de Execução (016-admin-plans-page)

## Fase 1: Correção de Build (Tailwind)
- [ ] Editar `src/app/globals.css` e remover `@plugin "tailwindcss-animate";` que está causando falha de resolução no Turbopack. O Tailwind 4 no Next 15 pode lidar com animações diretamente ou através de configs locais caso necessário. Se remover resolver o build, paramos por aí.

## Fase 2: Banco de Dados (Supabase)
- [ ] Criar a migração `supabase/migrations/20260609000001_create_plans_table.sql` contendo o DDL da tabela `plans` e RLS.
- [ ] Escrever o código de Inserção Mock para criarmos 3 planos iniciais (Básico, Ouro, Diamante) na migração ou tratar o Fallback na UI.

## Fase 3: Engenharia Frontend (UI/UX)
- [ ] Substituir o conteúdo em branco de `src/app/admin/planos/page.tsx` por uma tela contendo Layout de Grid (`grid-cols-1 md:grid-cols-3`).
- [ ] Fazer o Data Fetching SSR `supabase.from('plans').select('*')`, com Fallback idêntico ao que fizemos na tela de Servidores, para não quebrar em caso de banco desatualizado no localhost.
- [ ] Renderizar os Cards de planos usando design Premium (cores dinâmicas, glass-panel, e tipografia ousada).

## Fase 4: Quality Gate
- [ ] Validar que o `npm run build` passa com sucesso.
- [ ] Validar a navegação.
