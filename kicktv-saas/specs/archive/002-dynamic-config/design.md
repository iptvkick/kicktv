# Architecture & Database Design — Configurações Dinâmicas

## 1. UX/UI Design (Admin e Cliente)
Seguindo o **SDD** aprovado (A estética minimalista TripGlide - Fundo `#f5f6f7`, Fonte `Instrument Sans` e botões escuros `#212529`).

### 1.1 Painel Admin (`/admin/config`)
- Uso massivo de "Data Tables" para listar servidores e planos.
- Uso de modais com abas (Tabs) para edição complexa. Exemplo: Ao clicar em "Smart TV", o modal exibe a lista de "Passo 1, Passo 2" com drag-and-drop (ordenamento) e campo para colar URL do YouTube.

### 1.2 Onboarding Cliente (`/`)
- A lista suspensa do "Onde você quer assistir?" será populada dinamicamente.
- Quando o cliente clica, a UI exibe os passos como um **Carousel interativo**, onde a mídia (Vídeo/Foto) fica grande no topo (com cantos arredondados de 24px) e as instruções ficam embaixo com botão "Próximo Passo".

## 2. Modelagem do Banco (Supabase)

Para suportar essas dinâmicas, o schema do PostgreSQL será expandido:

### Tabela `system_settings`
Gerencia valores globais chave/valor.
- `key` (text, PK) — ex: `trial_duration_hours`, `playlist_base_name`
- `value` (jsonb) — ex: `{"hours": 4}`

### Tabela `xtream_servers`
Gestão de servidores e hierarquia.
- `id` (uuid)
- `name` (text)
- `url` (text)
- `username` (text)
- `password` (text)
- `priority` (int) — 1 para Principal, 2+ para Fallbacks.
- `is_active` (boolean)

### Tabela `subscription_plans`
Precificação dinâmica para o Asaas.
- `id` (uuid)
- `name` (text) — ex: "Trimestral Familia"
- `duration_months` (int)
- `base_price` (decimal)
- `extra_screen_price` (decimal) — Custo por tela adicional.
- `is_active` (boolean)

### Tabela `onboarding_devices` e `onboarding_steps`
O construtor do tutorial.
- **`onboarding_devices`**: `id`, `name`, `icon_name` (string mapeada para lucide-react), `is_active`, `order_index`.
- **`onboarding_steps`**: `id`, `device_id` (FK), `step_number` (int), `title` (text), `description` (text), `media_url` (text - youtube embed ou imagem).

## 3. Segurança (RLS)
- **Select:** `onboarding_devices`, `onboarding_steps`, `subscription_plans` têm leitura pública (`public` role).
- **Select:** `xtream_servers` e `system_settings` só podem ser lidos pela role `service_role` (nas Edge Functions) ou `admin`. O frontend do cliente JAMAIS baixará a lista de servidores Xtream.
- **Insert/Update/Delete:** Exclusivos para `role = 'admin'` na tabela `profiles`.
