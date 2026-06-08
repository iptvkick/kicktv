# Checklist de Implementação — Configurações Dinâmicas

> **Fluxo SDD:** Este checklist ditará o ritmo da fase `/vibe-apply` do Spec 002.

## Fase 1: Banco de Dados Dinâmico (Supabase)
- [ ] Criar arquivo de migração para as novas tabelas: `system_settings`, `xtream_servers`, `subscription_plans`, `onboarding_devices`, `onboarding_steps`.
- [ ] Aplicar RLS estrito: Leitura pública para onboarding/planos, segurança total (service_role only) para `xtream_servers`.
- [ ] Escrever Script de Seeding (Dados Iniciais): Inserir 1 servidor mock, 1 plano padrão e 1 aparelho padrão para evitar interface quebrada logo após o build.
- [ ] Rodar `supabase gen types` para atualizar as tipagens da aplicação (`src/types/database.types.ts`).

## Fase 2: Backend (Edge Functions de Resiliência)
- [ ] Atualizar função `generate-trial`:
  - Buscar a `trial_duration_hours` em `system_settings`.
  - Implementar lógica de Try/Catch percorrendo a lista de `xtream_servers` ordenados por `priority`.
- [ ] Atualizar função de Geração de Faturas e Renovação:
  - Ler `subscription_plans` e calcular `base_price` + (`extra_screen_price` * telas_selecionadas).

## Fase 3: Portal Admin (O Builder)
- [ ] Criar `/admin/layout.tsx` (Sidebar preta, fonte Instrument Sans).
- [ ] Criar `/admin/servidores`: Tabela CRUD com reordenação de hierarquia de Fallback.
- [ ] Criar `/admin/planos`: Formulário com inputs de valor e custo de tela extra.
- [ ] Criar `/admin/onboarding`: Interface visual (lista + modais) permitindo ao admin criar botões (TV, Celular) e embutir links de YouTube neles.

## Fase 4: O Cliente Vendo a Mágica (Front-end Público)
- [ ] Refatorar `/` (Landing Page): Substituir o array chumbado `devices` por requisição assíncrona ao Supabase (`onboarding_devices`).
- [ ] Implementar o "Player de Passo a Passo": Se o cliente clicar no botão criado pelo admin, abrir um Flow com os `onboarding_steps` injetando o `media_url` no `<iframe>` (YouTube embed).
- [ ] Refatorar modal de "Gerar Teste Grátis" e "Pagar via Asaas" no `/cliente/dashboard` para puxar os planos ativos e o slider de "Quantas telas simultâneas você precisa?".

## Fase 5: Validação Final
- [ ] Garantir responsividade Mobile nos vídeos do YouTube incorporados (Aspect Ratio 16:9).
- [ ] Fazer commit seguro seguindo padrão SDD.
