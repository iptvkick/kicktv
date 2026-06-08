# Tasks (ID: 008-hermes-autonomous-api)

Este documento contém o checklist estrito e sequencial de tarefas para implementar a arquitetura de acesso da IA "Hermes" via Supabase.

## FASE 1 — Infraestrutura de Banco de Dados
- [ ] 1.1 Criar migração local no Supabase CLI (`npx supabase migration new create_agent_jobs`)
- [ ] 1.2 No arquivo de migração, criar a tabela `agent_jobs` e habilitar o RLS
- [ ] 1.3 Adicionar Policy na tabela `agent_jobs` para visualização restrita a usuários `authenticated`
- [ ] 1.4 No arquivo de migração, criar a rotina de agendamento usando `cron.schedule` e `net.http_post` para o webhook do Hermes (deixando o endpoint de URL como um parâmetro ou comentário explicativo de como ativar remotamente)
- [ ] 1.5 Aplicar a migração no banco de dados (`supabase db push`) se estiver logado, ou deixar pronto para o usuário.

## FASE 2 — Acesso do Cliente (Front-end Admin)
- [ ] 2.1 Gerar os tipos TypeScript com as novas tabelas (para incluir o `agent_jobs`)
- [ ] 2.2 Criar um novo componente / seção dentro de `routes/admin/index.tsx` para listar as últimas 5 execuções de `agent_jobs`.
- [ ] 2.3 Atualizar o design do Dashboard para que a métrica do agente apareça em um painel lateral, confirmando se ele está operando adequadamente.

## FASE 3 — Documentação e Hand-off para o Hermes
- [ ] 3.1 Adicionar um arquivo na raiz `HERMES_API_GUIDE.md` explicando detalhadamente (com requests cURL) como a IA deve ler categorias via PostgREST e como injetar dados usando o Header correto.
- [ ] 3.2 Omitir credenciais reais, instruindo o usuário sobre onde coletar a `SUPABASE_SERVICE_ROLE_KEY` e a URL do projeto.
