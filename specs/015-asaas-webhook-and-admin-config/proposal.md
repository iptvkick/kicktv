# Proposal: Webhook Events & Admin Config (Spec 015)

## Requisitos
- **REQ-01 (Guia de Eventos Webhook):** Listar claramente na UI os eventos exatos que o administrador deve marcar no painel do Asaas para o sistema de Assinatura operar sem falhas.
- **REQ-02 (Admin Form):** A página `/admin/integracoes.tsx` não deve ser apenas visual. Deve conter um formulário onde o Admin salva a `API Key` (Access Token) e o `Webhook Token` (`whsec_...`) diretamente no banco de dados Supabase (`integrations`), evitando intervenção manual via Studio.
- **REQ-03 (Webhook Security):** O painel deve explicar para que serve o `Webhook Token` gerado e orientar o usuário a colar.

## BDD Scenarios

### Cenário 1: Salvando as Chaves Pelo Painel
- **Given (Dado):** O Administrador acessou a aba Integrações.
- **When (Quando):** Ele preenche o campo "Asaas API Key" e "Asaas Webhook Token" e clica em Salvar.
- **Then (Então):** O sistema dá um `upsert` na tabela `integrations` no Supabase e atualiza a interface confirmando o salvamento.

### Cenário 2: Eventos Claros
- **Given (Dado):** O Admin está configurando o Webhook no painel do Asaas.
- **When (Quando):** Ele lê o sistema KickTV, visualiza uma tag laranja com os eventos recomendados: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`.
- **Then (Então):** Ele tem certeza do que marcar e evita marcar eventos inúteis que gargalariam a API.
