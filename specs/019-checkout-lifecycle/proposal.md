# Proposal: Checkout e Ciclo de Vida do Assinante (Spec 019)

## Objetivo
Corrigir o fluxo completo de pagamento e ciclo de vida do assinante: da landing page ao checkout PIX, passando pela renovação, histórico de faturas e onboarding real.

## Requisitos

### R1 — Landing Page com Planos Dinâmicos
- A seção `#planos` deve buscar os planos ativos da tabela `plans` no Supabase.
- O botão "Assinar" deve redirecionar para `/auth/register?planId=<id>` passando o plano selecionado.

### R2 — Fluxo de Registro → Trial Imediato → Opção de Upgrade
- Após o registro, o sistema concede um **trial automático** (chamar `generate-trial` real) e redireciona para o dashboard.
- No dashboard/tela inicial do cliente, exibe banner/card de trial com contador de tempo restante.
- Botão "Ativar Plano" no banner leva para `/cliente/assinatura` (tela de gestão da assinatura).

### R3 — Tela Dedicada de Gestão de Assinatura (`/cliente/assinatura`)
Tela central onde o cliente gerencia TUDO relacionado ao plano:
- **Status atual:** Trial / Ativo / Vencido (badge colorido)
- **Seletor de plano:** cards dos planos reais do DB com preço
- **Seletor de telas extras:** incrementar/decrementar com preço em tempo real
- **Checkout embutido:** gera PIX diretamente na tela (sem redirect) usando CPF já salvo
- **Histórico de faturas:** tabela com data, valor, status (PAGO/PENDENTE/VENCIDO)
- **Botão Cancelar:** cancelar assinatura vigente

### R4 — Checkout PIX Corrigido
- A Edge Function `asaas-checkout` deve usar `base_price` (não `price_monthly`).
- Se `profile.cpf` já estiver preenchido, não pedir CPF novamente.
- Após gerar a assinatura, salvar na tabela `subscriptions` corretamente.

### R5 — Perfil: Histórico de Faturas
- Substituir o card "Renovação Mensal" por uma seção completa com:
  - Status da assinatura (ATIVO, VENCIDO, TRIAL)
  - Próximo vencimento
  - Histórico de faturas da tabela `invoices` (data, valor, status PAGO/PENDENTE/VENCIDO)
- Se status for OVERDUE/CANCELED: mostrar botão "Renovar" → `/cliente/planos`.

### R6 — Onboarding com Nome Real + Trial Real
- O campo de nome deve fazer `upsert` em `profiles.full_name`.
- A geração do trial deve chamar a Edge Function `generate-trial` (ou `create-trial`) real, não gerar credenciais com `Math.random()`.

## BDD Scenarios

### Cenário 1: Assinatura Expirada com Histórico
- **Given:** Cliente com `subscription.status = 'OVERDUE'`
- **When:** Acessa a aba "Métodos de Pagamento" no perfil
- **Then:** Vê badge "Vencido", botão "Renovar Assinatura" e tabela com as últimas 5 faturas (data, valor, status)

### Cenário 2: PIX sem pedir CPF
- **Given:** `profile.cpf = '12345678901'` já salvo
- **When:** Clica em "Pagar PIX"
- **Then:** O modal pula o campo de CPF e gera o QR Code diretamente

### Cenário 3: Landing Page com Planos Reais
- **Given:** Admin cadastrou 2 planos ativos no painel
- **When:** Visitante acessa a landing page
- **Then:** Vê exatamente os 2 planos com nome e preço reais do banco
