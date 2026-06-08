# Proposal: Supabase DB & Integração Asaas

## 1. Visão Geral
Este documento propõe a arquitetura de dados e de cobranças para tornar o KickTV um SaaS totalmente funcional. Substituiremos todos os "mocks" de frontend por tabelas relacionais no Supabase. O gateway de pagamentos escolhido é o **Asaas**, exigindo o uso de Supabase Edge Functions para escutar os Webhooks de pagamento.

## 2. Requisitos Técnicos
1. **Modelagem Relacional (PostgreSQL via Supabase)**: Tabelas para Profiles, Plans, Servers, Devices e Subscriptions.
2. **Autenticação**: Supabase Auth atrelado aos Profiles.
3. **Integração Financeira (Asaas)**:
   - Geração de `Asaas Customer ID` no cadastro.
   - Geração de Cobrança (PIX preferencialmente).
   - Webhook para processar eventos `PAYMENT_RECEIVED` e atualizar a tabela `subscriptions`.
4. **Painel Admin**: Conectar as telas de admin às APIs reais do Supabase com capacidades de CRUD.
5. **Painel do Cliente**: Exibir dados reais de planos ativos, vencimento e servidor liberado.

## 3. BDD Scenarios

### Cenário: Geração do Teste Grátis (Trial)
- **Given (Dado):** O usuário preenche o e-mail na Landing Page e cria a conta.
- **When (Quando):** O sistema registra o usuário no Supabase Auth.
- **Then (Então):** Uma trigger no Supabase cria a linha em `profiles`, aciona a criação de uma `subscription` com status `trialing` e validade de 4 horas, vinculada ao `server` de teste padrão.

### Cenário: Pagamento da Assinatura via Asaas
- **Given (Dado):** O usuário clica em "Assinar Plano Premium".
- **When (Quando):** O Frontend chama uma Edge Function do Supabase que solicita um PIX ao Asaas.
- **Then (Então):** O sistema exibe o QR Code PIX. Quando pago, o Webhook do Asaas bate na Edge Function, que muda o status da `subscription` para `active` e estende a validade por 30 dias.

### Cenário: Admin gerenciando Servidores
- **Given (Dado):** O Administrador acessa `/admin/servidores`.
- **When (Quando):** Ele remove um servidor antigo e adiciona uma nova URL de Painel P2P.
- **Then (Então):** O banco de dados salva a alteração e, no próximo onboarding, os novos usuários recebem a URL atualizada.
