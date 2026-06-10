# Proposal & Design: Asaas Integrations (Spec 016)

## Requisitos e Ações Corretivas
1. **REQ-01 (Deploy Cloud):** Fazer o deploy remoto das Edge Functions (`asaas-ping-test` e as demais) para o servidor do Supabase na nuvem do cliente. Sem isso, o frontend não consegue pingar a função.
2. **REQ-02 (Atualização de Design - Webhook Handler):** Garantir que a Edge Function `asaas-webhook` (se existir ou quando for criada) verifique o header HTTP `asaas-access-token` contra o banco de dados antes de processar qualquer evento.
3. **REQ-03 (Segurança):** Configurar variáveis de ambiente adequadas para as funções rodarem na nuvem, como as referências ao próprio Supabase caso não estejam auto-injetadas no contexto da edge function.

## BDD Scenarios

### Cenário 1: Teste de Conexão Funcional
- **Given:** A edge function `asaas-ping-test` está deployada na nuvem.
- **When:** O admin clica em "Testar Conexão Asaas".
- **Then:** O frontend atinge o endpoint com sucesso (sem erro de "Failed to send a request"), valida a apiKey e exibe o feedback visual Verde ou Vermelho.

### Cenário 2: Blindagem do Webhook
- **Given:** O Asaas dispara um evento de `PAYMENT_CONFIRMED`.
- **When:** Ele atinge a nossa `asaas-webhook` edge function.
- **Then:** O script extrai o `asaas-access-token`, checa se ele bate com o do banco de dados e só processa a assinatura se houver correspondência, barrando IPs de intrusos.
