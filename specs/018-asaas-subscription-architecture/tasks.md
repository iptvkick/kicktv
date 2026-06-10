# Tasks: Arquitetura de Planos e Assinaturas (Spec 018)

## Fase 1: Database (Database Engineer)
- `[x]` Criar as tabelas `plans`, `subscriptions` e `invoices` com RLS apropriado.
- `[x]` Gerar os tipos atualizados via `supabase gen types typescript`.

## Fase 2: Webhooks e Backend (Backend Engineer)
- `[x]` Adaptar a Edge Function `asaas-webhook` para receber o evento de pagamento, espelhar na tabela `invoices` (criando ou atualizando) e atualizar o `status` e `next_due_date` na tabela `subscriptions`.
- `[x]` Criar a Edge Function `asaas-subscription-manager` (Checkout e Update). Recebe chamadas do Front para Criar assinatura no Asaas (informando o `cycle` adequado) ou Dar PUT para alterar quantidade de telas.

## Fase 3: UI Admin - Planos (Frontend Engineer)
- `[x]` Refatorar a aba de `/admin/planos.tsx` para fazer CRUD na tabela local `plans`, permitindo ao admin definir Preços, Adicionais e `billing_cycle`.

## Fase 4: UI Admin - Gestão de Clientes (Frontend Engineer)
- `[x]` Criar a tela `/admin/clientes/index.tsx` (Lista geral com status, nome, e-mail).
- `[x]` Criar a tela de Perfil do Cliente (`/admin/clientes/$id.tsx`) contendo: Visão Geral da Assinatura, Controle de Telas Extras, Botão de Cancelamento e Histórico de Pagamentos/Vencimentos (Tabela `invoices`).
