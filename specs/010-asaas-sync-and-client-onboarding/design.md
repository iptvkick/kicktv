# Design: Asaas Sync & Client Onboarding

## Arquitetura de Sincronização (Supabase Edge Functions)
Como estamos conectando APIs externas, e precisamos do Token Asaas (salvo no banco em `integrations`), o local mais seguro para a lógica é o backend do Supabase.

**1. Edge Function `asaas-sync`:**
- A UI de `planos.tsx` em vez de chamar `supabase.from('subscription_plans').insert()`, chamará `supabase.functions.invoke('asaas-sync', { body: { type: 'plan', data: newPlan } })`. A função criará o plano no Asaas e no Supabase na mesma transação.
- O Frontend no momento de Registro Auth ou o trigger do Banco chamará a mesma function para `{ type: 'customer', data: userProfile }` e salvará o `asaas_customer_id` na tabela `profiles` ou `asaas_customers`.

## Arquitetura de Interface (Stitch UI)

**Dashboard do Cliente (`dashboard.tsx`)**
Vamos aplicar o conceito de **"Progressive Disclosure"**:
1. Se `subscription.dispositivo_principal` ou `profile.dispositivo_principal` (dependendo do schema) estiver VAZIO:
   - A Tab de "Dados Pessoais" esconde os detalhes M3U.
   - Mostra um título gigante: "Onde você vai assistir?".
   - Renderiza os `onboarding_devices` como Cards Grandes com ícones.
2. Quando clica no Card:
   - Dispara Update no Supabase salvando a escolha.
   - A tela faz uma transição revelando as Senhas M3U e puxando logo abaixo a lista de `onboarding_steps` para o dispositivo selecionado, renderizando os textos e vídeos do YouTube configurados no Admin.

## Banco de Dados
Para suportar o cruzamento:
- Tabela `subscription_plans`: Adicionar coluna `asaas_id` (string nula) para guardar o ID do plano na plataforma terceira.
- Tabela `iptv_subscriptions` ou `profiles`: Garantir que a coluna `dispositivo_principal` (UUID ou Texto com o ID do device) exista e possa ser preenchida. (O schema atual já possui `dispositivo_principal` em `iptv_subscriptions`, vamos apenas usá-lo ativamente).
