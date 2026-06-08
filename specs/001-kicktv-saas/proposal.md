# Proposal & Requisitos — KickTV SaaS

## 1. Visão Geral
Sistema B2B2C de IPTV contendo:
1. **Landing Page + Onboarding Wizard:** Para captação e geração automatizada de testes (Trials).
2. **Portal do Cliente:** Para renovação (PIX), status de linha, suporte e Web Player.
3. **Portal Admin:** Painel financeiro, gestão de clientes, métricas de MRR.

## 2. Requisitos Técnicos
- **Frontend:** React/Next.js com Tailwind CSS e Shadcn UI.
- **Backend/DB:** Supabase (PostgreSQL, Auth, Edge Functions).
- **Segurança:** RLS (Row Level Security) estrito. O Frontend NUNCA acessa a API Xtream diretamente.
- **Integração de Pagamento:** Asaas via Webhooks.

## 3. User Stories
- **US01:** Como um *visitante*, quero responder a um funil interativo sobre meu dispositivo para receber um teste gratuito automaticamente na tela.
- **US02:** Como um *cliente*, quero ver um painel com meu usuário, senha e URL do servidor, além dos dias restantes da minha assinatura.
- **US03:** Como um *cliente*, quero poder clicar em "Renovar via PIX" e ter minha linha reativada/estendida instantaneamente após o pagamento.
- **US04:** Como um *admin*, quero ver um dashboard com o MRR, quantidade de clientes ativos e tickets de suporte abertos.

## 4. Critérios de Aceite
- O banco de dados deve possuir as tabelas: `profiles`, `iptv_subscriptions`, `payments`, `support_tickets`.
- Todas as tabelas devem ter RLS ativo impedindo que o Cliente A veja dados do Cliente B.
- A lógica de geração de testes, renovação e self-healing deve existir em **Edge Functions**.

## 5. BDD Scenarios

### Cenário: Geração de Teste Grátis (Trial)
- **Given (Dado):** Que um visitante acessou a LP e completou o Wizard de dispositivo.
- **When (Quando):** Ele submete seu Nome e WhatsApp.
- **Then (Então):** O sistema chama a Edge Function `generate-trial`, salva o usuário no Auth, cria um registro em `iptv_subscriptions` com status `trial` e exibe as credenciais na tela.

### Cenário: Renovação Automática via PIX
- **Given (Dado):** Que um cliente tem uma assinatura `vencida` ou prestes a vencer.
- **When (Quando):** Um webhook de pagamento "Aprovado" do Asaas bate na Edge Function `renew-subscription`.
- **Then (Então):** A API Xtream é atualizada com +1 mês de validade, a tabela `payments` recebe o status `pago`, e a `data_vencimento` na tabela `iptv_subscriptions` é estendida.

### Cenário: Suporte Self-Healing
- **Given (Dado):** Que o cliente acessa a área de suporte e seleciona "Travamento constante".
- **When (Quando):** Ele envia o formulário indicando que usa uma "Smart TV Samsung".
- **Then (Então):** O sistema (Edge Function) responde instantaneamente com o guia de troca de DNS específico para Samsung e altera o ticket para status `resolvido` automaticamente (ou aguardando confirmação).
