# Design: Checkout e Ciclo de Vida do Assinante (Spec 019)

## Database Changes
Nenhuma nova tabela. Apenas correções de campo:
- `asaas-checkout` usar `base_price` ao invés de `price_monthly`

## UI Architecture

### Landing Page (`routes/index.tsx`)
- Fetch de `plans` onde `is_active = true` no mount do componente
- Render dinâmico dos cards de plano (nome, base_price, billing_cycle)
- Botão: `<Link to="/auth/register" search={{ planId: plan.id }}>`

### Nova tela: `/cliente/planos.tsx`
- Cards dos planos com toggle de telas extras
- Preview de preço: `base_price + (extra_users * extra_user_price)`
- Botão Assinar → `/cliente/checkout?planId=X&extraUsers=N`

### Nova tela: `/cliente/checkout.tsx`
- Mostra resumo do plano selecionado e valor total
- Se CPF já salvo: vai direto para gerar PIX (sem modal)
- Se não: campo para digitar CPF e salvar no perfil antes de gerar
- Invoca `asaas-checkout` com `{ planId, extraUsers, cpfCnpj }`
- Exibe QR Code + código PIX copia-e-cola

### Perfil (`/cliente/perfil.tsx`)
- Seção "Assinatura" nova:
  - Badge de Status (ATIVO verde / VENCIDO vermelho / TRIAL cinza)
  - Data do próximo vencimento
  - Se OVERDUE/CANCELED: Botão "Renovar Assinatura" → `/cliente/planos`
- Seção "Histórico de Pagamentos":
  - Tabela: Data | Valor | Status (badge)
  - Dados da tabela `invoices` via query Supabase

### Onboarding (`/onboarding/tutorial.tsx`)
- Passo de nome: `upsert` em `profiles` ao confirmar
- Geração de trial: chamar `generate-trial` Edge Function real (não `Math.random()`)
