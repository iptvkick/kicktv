# Checklist de Execução (014-admin-dashboard-real-data)

## Fase 1: Criação de Estruturas Faltantes (Cascas)
- [ ] Criar arquivo `src/app/admin/planos/page.tsx` com layout básico de página e título "Planos".
- [ ] Criar arquivo `src/app/admin/servidores/page.tsx` com layout básico de página e título "Servidores".
- [ ] Criar arquivo `src/app/admin/tutoriais/page.tsx` com layout básico de página e título "Tutoriais".
- [ ] Garantir que a Sidebar em `src/components/ui/AdminSidebar.tsx` aponta os Links (`href`) para essas rotas corretamente.

## Fase 2: SSR Data Fetching (Dashboard)
- [ ] Editar `src/app/admin/dashboard/page.tsx` para se tornar um `Async Server Component`.
- [ ] Instanciar `const supabase = await createClient()` do `@/utils/supabase/server`.
- [ ] Fazer query de `Usuários Ativos` (count em `iptv_subscriptions` status 'ativo').
- [ ] Fazer query de `Receita Mensal` (sum em `payments` status 'pago').
- [ ] Fazer query de `Trials Ativos` (count em `iptv_subscriptions` status 'trial').
- [ ] Fazer query de `Taxa de Conversão` (Mock inteligente baseado em ativos/trials se necessário).
- [ ] Fazer query de `Últimos Registros` ordenado por data descendente (limite 5).

## Fase 3: Renderização Visual (Design 2026)
- [ ] Substituir o conteúdo estático atual da Dashboard pelos dados coletados na Fase 2.
- [ ] Refinar o layout visual para corresponder ao mock (Cards brancos, bordas macias, tabelas com badges de Status).

## Fase 4: Validação
- [ ] Rodar o projeto e navegar entre as seções do Admin pelo Menu Lateral.
- [ ] Confirmar ausência de erros 404 e carregamento impecável.
