# Checklist de Execução (015-admin-ux-and-servers)

## Fase 1: Supabase DB
- [ ] Criar arquivo de migração `supabase/migrations/20260609000000_create_servers_table.sql`.
- [ ] Rodar o apply da migração no banco (ou rodar a query SQL via API local) para materializar a tabela `servers`.
- [ ] Inserir 2 servidores iniciais mockados na tabela para termos dados de teste.

## Fase 2: UX e Transições Web
- [ ] Editar `src/components/ui/PageTransition.tsx` para usar apenas Opacity/FadeIn sem X-slide na área Administrativa.
- [ ] Criar o arquivo `src/app/admin/loading.tsx` contendo o esqueleto padrão das telas do Admin (simulando cards e listas em wireframe cinza).

## Fase 3: Dashboard Real Data
- [ ] Modificar `src/app/admin/dashboard/page.tsx` para buscar os servidores via `supabase.from('servers').select('*')`.
- [ ] Atualizar o visual do widget "Status dos Servidores" no dashboard para iterar pelos servidores que vieram do banco.

## Fase 4: Tela de Servidores
- [ ] Reescrever `src/app/admin/servidores/page.tsx` para buscar os servidores via SSR no Supabase.
- [ ] Remover o "Módulo em Desenvolvimento" e renderizar a tabela visual com os dados de servidores ativos.

## Fase 5: Validação
- [ ] Testar a navegação de Servidores para Dashboard e checar a velocidade do Skeletons/Transitions.
