# Design & Architecture (ID: 008-hermes-autonomous-api)

Este documento define a camada técnica que habilitará a interface REST nativa do Supabase para consumo pelo Agente de IA "Hermes", além de estender a infraestrutura para comportar logs de execução e jobs.

## 1. PostgREST: API de Interação do Hermes

O Supabase fornece instâncias do PostgREST prontas para uso. O Hermes interage diretamente pelas rotas padronizadas sem necessidade de SDK, enviando requisições REST puras (perfeito para n8n, make, ou webhooks customizados).

### Configuração de Endpoint
- **URL Base:** `https://<PROJECT_REF>.supabase.co/rest/v1`
- **Autenticação:** `apikey: <SERVICE_ROLE_KEY>` e `Authorization: Bearer <SERVICE_ROLE_KEY>`

*⚠️ A Service Role Key (diferente da Anon Key) bypassa o RLS e garante permissões totais para o Agente.*

### Padrão de Chamadas do Agente
1. **Listar Categorias Disponíveis:**
   ```http
   GET /rest/v1/categories?select=id,slug
   ```
2. **Inserir Novo Post (Review):**
   ```http
   POST /rest/v1/posts
   Content-Type: application/json
   Prefer: return=representation

   {
     "title": "Review gerado pelo Hermes",
     "slug": "review-gerado",
     "content": {"intro": "...", "body": "..."},
     "status": "published",
     "category_id": "<uuid>",
     "crivo_score": 88
   }
   ```

## 2. Banco de Dados: `agent_jobs` (Auditoria e Heartbeat)

Para auditar e monitorar o que o Hermes faz, precisamos de uma nova tabela `agent_jobs`.

### Tabela `agent_jobs`
- `id` (uuid, PK)
- `started_at` (timestamptz, indexado)
- `completed_at` (timestamptz)
- `status` (text) — check in: `running`, `success`, `failed`
- `action` (text) — Ex: `generate_review`, `scrape_trends`
- `metadata` (jsonb) — Dados adicionais retornados pelo Hermes (erro, URLs pesquisadas)

### RLS (Row Level Security)
- O `agent_jobs` será visível no painel `admin`.
- A policy garante que apenas `authenticated` (admins) visualizam via API (App front-end).
- O Hermes consegue escrever porque usa a chave *Service Role*.

## 3. Extensões PostgreSQL: O Gatilho Autônomo

Ao invés de depender de CRONs externos (como Vercel, que limitam tempo de execução), usamos o PostgreSQL.

1. **Ativar Extensões no Supabase:**
   - `pg_net` (habilita chamadas HTTP de saída a partir de queries SQL).
   - `pg_cron` (habilita agendamentos SQL).

2. **Definir o Agendador (Scheduler):**
   ```sql
   -- Agendando o Hermes para iniciar a rotina de publicações a cada 2 horas
   SELECT cron.schedule(
     'hermes-heartbeat', -- Nome do job
     '0 */2 * * *',      -- Cron expression: a cada 2 horas
     $$
       SELECT net.http_post(
         url := 'https://api.hermes-agent.com/webhook/trigger', -- URL DO HERMES
         headers := '{"Content-Type": "application/json"}'::jsonb,
         body := '{"action": "generate_content", "site": "crivocerto"}'::jsonb
       );
     $$
   );
   ```
   
## 4. UI / Frontend (Atualizações no Painel de Admin)
Para visualizar a atuação do agente:
- No `/admin/index.tsx`, adicionar um card ou tabela menor mostrando os "Últimos Jobs do Agente" mapeados da tabela `agent_jobs`.
- Mostrar a data do último "Heartbeat" do Cron job com um ícone de status (🟢 Ativo, 🔴 Falha).
