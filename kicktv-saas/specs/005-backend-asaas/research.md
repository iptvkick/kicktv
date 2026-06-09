# Phase 0: Research (Backend Supabase & Asaas)

**Contexto**: O usuário solicitou um novo `/vibe-proposal` mais elaborado para substituir completamente os dados mockados no Frontend por um Backend real usando **Supabase** (Banco de Dados, Auth e Edge Functions) e integração com o gateway de pagamentos **Asaas** para gerenciar cobranças e testes grátis (Trials).

### Análise do Escopo Atual (Mocks Identificados)
Através de pesquisa no repositório, identificamos que as seguintes áreas dependem de dados estáticos:
1. **Painel Admin (`/admin/*`)**:
   - `planos.tsx`: `const mockPlans = [...]` (Essencial, Premium 4K).
   - `servidores.tsx`: `const mockServers = [...]` (URLs de IPTV, DNS).
   - `onboarding.tsx`: `const mockDevices = [...]` (Smart TV, Android, iPhone).
2. **Área do Cliente (`/cliente/*` e `/onboarding/*`)**:
   - `tutorial.tsx`: Mock de seleção de dispositivo e geração de link.
   - `dashboard.tsx`: Dados falsos de assinatura ativa, datas de expiração e status.

### Integração com Asaas (Requisitos)
Para que o sistema seja um SaaS autônomo, o ciclo financeiro deve ser:
1. Usuário se cadastra -> Criação do `Customer` no Asaas.
2. Usuário escolhe Plano -> Criação da `Subscription` no Asaas (com PIX/Cartão).
3. Pagamento Aprovado -> Webhook do Asaas bate no Supabase Edge Function.
4. Edge Function -> Atualiza o status da assinatura na tabela `subscriptions` do Supabase.
5. Liberação do IPTV -> O sistema disponibiliza o link M3U / Usuário e Senha baseado no servidor.

### Regras de Negócios (A serem validadas)
- O teste grátis (4 horas) deve requerer um cadastro prévio para evitar "fantasmas" (Validado na Spec 003).
- O backend precisará de tabelas de `profiles`, `plans`, `servers`, `devices`, e `subscriptions`.
