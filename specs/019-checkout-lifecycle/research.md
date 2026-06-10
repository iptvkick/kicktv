# Research: Spec 019 — Checkout e Ciclo de Vida do Assinante

## Problemas Identificados

| # | Problema | Arquivo | Detalhe Técnico |
|---|---|---|---|
| 1 | Planos mockados na Landing Page | `routes/index.tsx` | R$35 e R$45 hardcoded. Botão não passa `planId` |
| 2 | Trial de onboarding FAKE | `onboarding/tutorial.tsx` | Credenciais geradas por `Math.random()`, nenhuma Edge Function real é chamada |
| 3 | Tela de seleção de plano inexistente | — | Não existe `/cliente/planos.tsx`. Cliente vai direto do registro ao trial |
| 4 | Campo `price_monthly` inexistente | `asaas-checkout/index.ts` | A função busca `price_monthly` mas a tabela `plans` usa `base_price` — causa o 400/500 |
| 5 | CPF já salvo mas ainda pedido | `perfil.tsx` | Modal de PIX sempre pede CPF mesmo que `profile.cpf` já esteja preenchido |
| 6 | Assinatura expirada sem saída | `perfil.tsx` | Não existe botão "Renovar" ou fluxo para escolher novo plano |
| 7 | Histórico de faturas ausente | `perfil.tsx` | A seção "Métodos de Pagamento" só mostra "Pagar PIX". Sem extrato |
| 8 | Nome não salva no onboarding | `onboarding/tutorial.tsx` | O campo de nome não faz `upsert` no perfil |
