# Design Architecture: Backend & Asaas

## 1. Banco de Dados (Supabase PostgreSQL)

### Schema Core
O banco de dados terá a seguinte estrutura (esboço das Migrations):

- **`profiles`**:
  - `id` (uuid, references `auth.users`)
  - `email` (string)
  - `role` (enum: `'admin' | 'client'`)
  - `asaas_customer_id` (string, nullable) - Retornado por `POST /v3/customers`
  - `created_at` (timestamp)

- **`servers`**:
  - `id` (uuid)
  - `name` (string)
  - `m3u_url` (string)
  - `dns_url` (string)
  - `is_active` (boolean)

- **`plans`**:
  - `id` (uuid)
  - `name` (string) - Ex: "Essencial", "Premium 4K"
  - `price_monthly` (numeric)
  - `features` (jsonb)

- **`devices`**:
  - `id` (string)
  - `name` (string)
  - `instructions` (text)
  - `video_url` (string)

- **`subscriptions`**:
  - `id` (uuid)
  - `profile_id` (uuid, references `profiles`)
  - `plan_id` (uuid, references `plans`, nullable)
  - `server_id` (uuid, references `servers`)
  - `status` (enum: `'trialing' | 'active' | 'past_due' | 'canceled'`)
  - `asaas_subscription_id` (string, nullable) - Retornado por `POST /v3/subscriptions`
  - `asaas_payment_id` (string, nullable) - Se for pagamento avulso
  - `starts_at` (timestamp)
  - `expires_at` (timestamp)

## 2. Row Level Security (RLS)
- **Profiles**: O usuário só pode ver/editar o próprio perfil. Admin pode ver todos.
- **Subscriptions**: O usuário só vê as próprias assinaturas. Admin vê todas.
- **Plans/Servers/Devices**: Leitura pública, escrita apenas Admin.

## 3. Arquitetura Asaas (Integração Oficial)
Utilizaremos a **API v3 do Asaas** através das Supabase Edge Functions:

### Edge Function: `asaas-checkout`
Chamada autenticada pelo frontend (`Authorization: Bearer <SUPABASE_TOKEN>`).
1. **Verificar Customer**: Busca o `asaas_customer_id` no `profiles`. Se não existir, faz `POST /v3/customers` enviando nome e e-mail, e salva o ID no Supabase.
2. **Criar Assinatura**: Faz `POST /v3/subscriptions` com o `customer`, `billingType: 'PIX'`, `value` (do plano) e `cycle: 'MONTHLY'`.
3. **Gerar PIX**: Retorna a payload contendo o `encodedImage` (QR Code) e `payload` (Copia e Cola) para o frontend exibir via tela de checkout.

### Edge Function: `asaas-webhook`
Endpoint público configurado no painel do Asaas para receber eventos de pagamento.
1. **Segurança**: Valida o header `asaas-access-token` para garantir que o request veio da Asaas.
2. **Eventos Mapeados**:
   - `PAYMENT_RECEIVED` ou `PAYMENT_CONFIRMED`: Localiza o pagamento no payload, acha a `subscription` atrelada no Supabase e atualiza o status para `active`, estendendo o `expires_at` em +30 dias.
   - `PAYMENT_OVERDUE`: Altera o status para `past_due`.
3. **Resiliência**: Retorna sempre `200 OK` após processar para evitar retentativas infinitas do Asaas.
