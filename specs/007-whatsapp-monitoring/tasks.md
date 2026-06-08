# Tasks: WhatsApp Monitoring Playbook

## Fase 1: Configuração Inicial e DB (Supabase MCP)
- [ ] Criar migração SQL `000x_create_whatsapp_monitoring_tables.sql` com as tabelas: `units`, `managers`, `whatsapp_cycles`, `cycle_steps`, `google_reviews_log`.
- [ ] Adicionar coluna `chatwoot_inbox_id` (ou identificador similar) na tabela `managers` para amarração silenciosa da caixa de entrada do Chatwoot com o gerente.
- [ ] Aplicar restrições de chaves estrangeiras e índices otimizados para consultas de dashboards.
- [ ] Ativar Row Level Security (RLS) nas novas tabelas.
- [ ] Criar políticas RLS para permitir visão geral para Admins (Daniel/David) e restrita por `unit_id` para Gerentes.
- [ ] Executar o gerador de tipos do Supabase (`supabase gen types typescript --local`).

## Fase 2: Módulo de Gestão (Cadastro e Configuração)
- [ ] Desenvolver **Módulo de Cadastro de Unidades e Gerentes** (Painel CRUD no frontend) permitindo vincular gerentes às suas respectivas unidades.
- [ ] Criar tela oculta de Configurações (`/config` ou sub-aba avançada visível apenas para Admin/David) para inserir *Account ID* e *API Access Token* do Chatwoot.
- [ ] Criar Edge Function (Supabase) configurada para fazer fetch seguro na API do Chatwoot (`/api/v1/accounts/{account_id}/conversations`) mascarando os tokens.

## Fase 3: Backend & Processamento de Etapas
- [ ] Criar script/cron (via `pg_cron` ou webhook) para processar conversas importadas do Chatwoot e validar as 4 etapas automaticamente.
- [ ] Criar lógica para sinalizar `max_response_time_breached` (atrasos > 20min) baseado nos timestamps das mensagens recuperadas.
- [ ] Criar endpoint/função para cruzar o total de aprovações da Etapa 4 com a API do Google Meu Negócio.

## Fase 4: Desenvolvimento Frontend Dashboard (UI/UX 2026)
- [ ] Criar rota/página `/monitoramento-whatsapp` no painel Davicode (visão principal do CEO).
- [ ] Desenvolver Componente **Global Compliance Score** (Hero Section em tamanho exagerado, tipografia 7xl, Liquid Glass effect).
- [ ] Desenvolver **Grid das 4 Etapas** (Cards com barras de progresso animadas para Etapas 1 a 4).
- [ ] Desenvolver **Tabela de Performance de Gerentes** (Avatar, Nome, Unidade, Score).
- [ ] Implementar **Filtros** por unidade e por período.
- [ ] Desenvolver Componente de **Alerta de Atrito (Google Reviews)** indicando falha de conversão da Etapa 4.

## Fase 5: Refinamento e Validação
- [ ] Aplicar regras da `ux-ui-architect-2026`: remover minimalismo genérico, ajustar micro-interações (`:focus-visible`, hover states).
- [ ] Garantir acessibilidade (WCAG 2.2): alvos de 44x44, contrastes de texto.
- [ ] Testar BDD Scenarios (Ciclo 100%, Falha na Etapa 2 e Rastreabilidade do Google).
