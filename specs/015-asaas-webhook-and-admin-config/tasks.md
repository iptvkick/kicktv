# Design & Tasks: Webhook Events & Admin Config (Spec 015)

## UI/UX Design (`integracoes.tsx`)
- Transformar o box de **Asaas (Gateway de Pagamento)** em um formulário real.
- Criar estado (`useState`) para `asaasApiKey` e `asaasWebhookToken`.
- Adicionar no Passo 1 um input de texto oculto (tipo password) para a API Key.
- Adicionar um Passo 3 focado em **Segurança do Webhook**.
- Listar visualmente os eventos recomendados com um visual moderno (badges):
  - `PAYMENT_RECEIVED`
  - `PAYMENT_CONFIRMED`
  - `PAYMENT_OVERDUE`
  - `PAYMENT_DELETED`
- Incluir o botão `[Salvar Credenciais]` que aciona `supabase.from('integrations').upsert()`.

## Tasks

> ⛔ **REGRA DE OURO:** Delegar.

### Fase 1: Frontend (Frontend Engineer)
- `[ ]` Atualizar `src/routes/admin/integracoes.tsx`:
  - `[ ]` Criar lógicas para fetch e update das chaves (`api_key` e `webhook_token`) na tabela `integrations` do banco.
  - `[ ]` Adicionar os inputs visuais para colar a Access Token e o Webhook Token (`whsec_...`).
  - `[ ]` Expandir o texto do passo-a-passo explicando e listando os eventos exatos que devem ser selecionados (`PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`).
  - `[ ]` Implementar o salvamento das chaves clicando no botão "Salvar Credenciais".

### Fase 2: Backend Ajuste (Backend Engineer)
- `[ ]` Modificar a tabela `integrations` caso não suporte o formato do webhook token, mas como já existe o campo `credentials` (JSONB) no design da tabela (se ela usar isso) ou a coluna específica, adaptar a inserção frontend para salvar no objeto JSON adequado: `credentials: { apiKey: "...", webhookToken: "whsec_..." }`. (A instrução principal aqui é garantir que o save frontend obedeça a estrutura do Supabase).

### Fase 3: QA (Deploy Engineer)
- `[ ]` Rodar `npm run build` após a conclusão das fases.
