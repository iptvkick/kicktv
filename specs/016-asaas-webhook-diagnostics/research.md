# Research & Diagnostics: Asaas Integrations (Spec 016)

## 1. Diagnóstico do Erro de Ping (Failed to send a request)
**Sintoma:** Ao clicar no botão de "Testar Conexão", a interface lança um `Failed to send a request to the Edge Function`.
**Causa Raiz:** O código da nossa Edge Function `asaas-ping-test` está pronto e perfeito localmente (na pasta `supabase/functions`), mas **ele nunca foi feito deploy para o servidor em nuvem do Supabase!**
**Resolução:** Rodar o comando `npx supabase functions deploy asaas-ping-test --no-verify-jwt` (ou similar) para empurrar o script do seu computador para o servidor cloud.

## 2. Alinhamento com a Documentação do Asaas (Webhooks)
Com base na documentação oficial de Webhooks (https://docs.asaas.com/docs/sobre-os-webhooks):
- **Autenticação:** O Asaas envia um cabeçalho HTTP chamado `asaas-access-token` contendo o exato token (Webhook Token) que o usuário acabou de colar e salvar na aba de Integrações.
- **Formato (Payload):** O payload padrão contém um campo `event` (ex: `PAYMENT_CONFIRMED`) e um objeto `payment` contendo os dados do cliente, valor, e ID da assinatura associada.
- **Eventos:** Os eventos mais cruciais para renovação/bloqueio automático de serviços de IPTV/SaaS são:
  - `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED` (Liberam ou mantêm acesso).
  - `PAYMENT_OVERDUE` (Suspende o acesso).
  - `PAYMENT_REFUNDED` / `PAYMENT_DELETED` (Cancelamento imediato).
- **Tratamento Fila (Retries):** Se a nossa Edge Function retornar algo diferente de status `200`, o Asaas tentará reprocessar em tempos exponenciais. Por isso nosso script precisa responder `200` rapidamente mesmo que caia num try-catch.
