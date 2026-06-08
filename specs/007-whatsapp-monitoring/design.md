# Design Document: WhatsApp Monitoring Playbook

## 1. UI/UX Architecture (Stitch MCP + UX 2026)

Seguindo as diretrizes de 2026 (Apple Liquid Glass + Maximalismo Tátil):

### Estética Visual (Dark Technical)
- **Vibe:** Dark Technical (zinc-950, slate-900 com highlights em Blue/Amber/Teal para as etapas).
- **Glassmorphism:** Uso intensivo de `backdrop-blur-xl` e bordas translúcidas (`border-white/10`) nos painéis de KPI do Dashboard.
- **Tipografia:** `Outfit` para Headlines e Números de KPI gigantes (text-6xl+). `Inter` para tabelas e textos do corpo. Alto contraste obrigatório (WCAG 2.2).

### Layout do Dashboard
- **Hero Section:** Número gigantesco mostrando o "Global Compliance %" de todas as unidades, com micro-interações ao hover.
- **Grids de Etapas:** 4 cards em Liquid Glass, cada um representando uma etapa (1. Cordialidade, 2. Orçamento, 3. Checklist, 4. Google Review). Barras de progresso dopamínicas preenchem conforme a porcentagem de acerto.
- **Tabela de Gerentes:** Tabela estilizada (Glass) com avatar, nome, unidade e score atual de cumprimento (0 a 100%).
- **Alertas de Atrito:** Alertas flutuantes (Neo-Minimalismo) avisando sobre discrepâncias (ex: "Alerta: Faltam 7 reviews no Google da Unidade X em relação aos fechamentos").

## 2. Módulo de Gestão (Unidades e Gerentes)
Uma área dedicada onde o Monitor (David) pode administrar as equipes.
- **Tela de Gestão:** Formulários inibidores de atrito (Maximalismo Tátil) para adicionar novas Unidades (`units`) e registrar Gerentes (`managers`), vinculando-os 1:1 à sua respectiva unidade. Isso assegura o agrupamento correto das métricas no Dashboard principal.

## 3. Modelagem de Banco de Dados (Supabase MCP)

O backend focará em performance e rastreabilidade através do PostgreSQL. 

### Tabelas Principais

1. **`units` (Unidades)**
   - `id` (uuid, PK)
   - `name` (text)
   - `google_place_id` (text) - Para linkar com as avaliações
   - `created_at` (timestamptz)

2. **`managers` (Gerentes)**
   - `id` (uuid, PK - referência a auth.users)
   - `unit_id` (uuid, FK para units)
   - `full_name` (text)
   - `phone` (text)
   - `chatwoot_inbox_id` (int, opcional) - Vinculação silenciosa no Chatwoot

3. **`whatsapp_cycles` (Ciclos de Atendimento)**
   - `id` (uuid, PK)
   - `manager_id` (uuid, FK)
   - `customer_phone` (text)
   - `started_at` (timestamptz)
   - `max_response_time_breached` (boolean) - Marca se passou de 20min

4. **`cycle_steps` (Etapas do Atendimento)**
   - `id` (uuid, PK)
   - `cycle_id` (uuid, FK)
   - `step_number` (int, 1 a 4)
   - `is_compliant` (boolean)
   - `reason_failed` (text, nullable)
   - `evaluated_at` (timestamptz)

5. **`google_reviews_log` (Logs do GMB)**
   - `id` (uuid, PK)
   - `unit_id` (uuid, FK)
   - `review_count_diff` (int) - Discrepância calculada
   - `logged_date` (date)

### Row Level Security (RLS)
- **Managers:** Podem dar SELECT apenas onde `unit_id` seja o mesmo da sua lotação.
- **CEO (Dani) / Monitor (David):** Acesso de `SELECT` total com role `admin` / `monitor`.

## 4. Integrações e Orquestração
- **API do Chatwoot (Stealth):** Para alta performance na coleta de dados sem intervenção manual, o sistema utiliza a API Oficial do Chatwoot (`/api/v1/accounts/{account_id}/conversations`). As credenciais (Account ID, API Access Token) ficam protegidas via `.env.local` e no cofre do Supabase. O painel inclui uma tela `/config` discreta (acessível apenas via role `monitor` ou link direto, não exposta em menus proeminentes) para ajustar esses tokens sem poluir a visão do CEO.
- A avaliação das etapas é processada silenciosamente analisando as mensagens retornadas pela API do Chatwoot.
- A verificação de Google Reviews acontece através de um job `pg_cron` cruzando total de `step_number = 4` do dia com a API do GMB.
