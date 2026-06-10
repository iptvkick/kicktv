# Research: Webhook Events & Admin Config (Spec 015)

## Contexto e Pedido
O usuário avançou para a configuração do Asaas e encontrou dois obstáculos:
1. Ao configurar o webhook, o Asaas gera um Token de Autenticação de Webhook (ex: `whsec_CBin0...`). Não há um campo na interface atual para o administrador colar e salvar este token, garantindo a segurança das chamadas recebidas.
2. A lista de "Eventos" no painel do Asaas é enorme. O usuário não sabe quais eventos uma plataforma de assinatura (IPTV SaaS) precisa assinar.

## Análise (RPI-R)
1. **Eventos do Asaas:** Para sistemas de assinatura, os eventos que disparam gatilhos críticos no nosso sistema geralmente são:
   - `PAYMENT_CONFIRMED`: Pagamento confirmado (liberar/renovar plano).
   - `PAYMENT_RECEIVED`: Pagamento recebido (alternativa ao confirmed para boletos/pix).
   - `PAYMENT_OVERDUE`: Pagamento vencido (suspender plano).
   - `PAYMENT_DELETED` / `PAYMENT_REFUNDED`: Estornos e cancelamentos.
   
2. **Refatoração da Interface (`integracoes.tsx`):**
   A tela construída na Spec 014 atua quase como um "Read-only Guide" e testa a conexão lendo do banco, mas não permite a *inserção* dos dados diretamente ali (o usuário teria que injetar pelo Supabase Studio).
   Precisamos transformar a tela em um painel administrativo completo. Onde ele possa:
   - Colar a `API Key` (Access Token).
   - Colar o `Webhook Token` (`whsec_...`).
   - Salvar tudo na tabela `integrations`.

3. **Pesquisa em Andamento:**
   O subagente `/browser` está confirmando a nomenclatura exata dos eventos no painel do Asaas.
