# Tasks: Spec 022 - UX Pós-Pagamento & Admin Details

## Fase 1: Banco de Dados (Database Engineer)
- `[x]` Criar uma migration para ativar o Supabase Realtime na tabela `invoices` e `subscriptions` (ex: `ALTER PUBLICATION supabase_realtime ADD TABLE invoices;`).

## Fase 2: Backend (Backend Engineer)
- `[x]` Criar a Edge Function `asaas-simulate`. Ela deve receber `invoice_id` e `status` (ex: 'RECEIVED', 'OVERDUE'), atualizar a tabela `invoices`, e se 'RECEIVED', atualizar o `status` na tabela `subscriptions` para 'ACTIVE' simulando perfeitamente o webhook do Asaas.
- `[x]` Fazer o deploy da Edge Function com `--no-verify-jwt` se for o caso, ou garantir que a function requer JWT mas tem bypass de RLS no service_role.

## Fase 3: Frontend - Checkout UX & Simulator (Frontend Engineer)
- `[x]` Em `src/routes/cliente/assinatura.tsx`: Adicionar Supabase Realtime Listener monitorando a tabela `invoices`. Quando o status do invoice recém-criado mudar para `RECEIVED`, mudar a tela para SUCESSO e ativar o botão de "Ir para a TV" instantaneamente.
- `[x]` Em `src/routes/cliente/assinatura.tsx`: Adicionar um countdown timer visual de 10 minutos pro PIX. Expirando o tempo, ocultar QR Code e exibir botão "Gerar Novo PIX".
- `[x]` Criar o componente `src/components/sandbox/CheckoutSimulator.tsx` que aparece só quando `VITE_SANDBOX_MODE='true'`. Ele deve ter botões "Pagar PIX", "Falhar PIX" que disparam a Edge Function `asaas-simulate`.

## Fase 4: Frontend - Redesigns (Frontend Engineer)
- `[x]` Refatorar `src/routes/auth/login.tsx` com UX 2026 (Maximalismo tátil, Glassmorphism, etc).
- `[x]` Substituir a rota do "Media Player" genérico pela rota de Suporte Arrojado (`src/routes/cliente/suporte.tsx`).
- `[x]` Criar a rota dinâmica de administrador `src/routes/admin/clientes/$id.tsx` implementando o "Raio-X" detalhado do cliente (Assinatura, Status, Histórico de Faturas completo).
- `[x]` Em `src/routes/admin/clientes/index.tsx`, garantir que a tabela seja clicável e direcione para `$id`.
