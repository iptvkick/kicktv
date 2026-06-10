# Tasks: Asaas Sync & Client Onboarding

> ⛔ **REGRA DE OURO:** Agentes devem focar exclusivamente em sua disciplina e marcar `[x]` apenas após validar sua etapa.

## Fase 1: Database (Database Engineer)
- `[x]` Criar migration alterando a tabela `subscription_plans`: Adicionar a coluna `asaas_id` (VARCHAR ou TEXT, nullável).
- `[x]` Garantir que a tabela `iptv_subscriptions` ou tabela equivalente que gere a assinatura do usuário (criada pelo trigger de 4 horas) possua a coluna `dispositivo_principal` pronta para receber UUID.
- `[x]` Rodar local ou aplicar no Supabase, garantindo que o `types.ts` continue com o JSONB funcionando.

## Fase 2: Backend (Backend Engineer)
- `[x]` Criar Edge Function `asaas-sync` em `supabase/functions/asaas-sync`.
- `[x]` Esta função deve ler as chaves Asaas usando a tabela `integrations` e receber payloads variados (`type: 'plan'` ou `type: 'customer'`).
- `[x]` Ao receber `'plan'`, fazer a chamada para API Asaas criando um plano, e então inserir em `subscription_plans` no Supabase com o `asaas_id` preenchido.
- `[x]` Ao receber `'customer'`, ler o id do user no auth e fazer a chamada para API Asaas, atualizando o profile correspondente no banco com o id do Asaas.

## Fase 3: Frontend Admin (Frontend Engineer)
- `[ ]` Na página `/admin/planos.tsx`, alterar o método `handleSavePlan` para remover a chamada `supabase.from('subscription_plans').insert()`.
- `[ ]` Trocar pela invocação da Edge Function `supabase.functions.invoke('asaas-sync', { body: { type: 'plan', data: newPlan } })`. Renderizar loaders apropriados.

## Fase 4: Frontend Client (Frontend Engineer)
- `[ ]` Na página `/cliente/dashboard.tsx` (Aba Pessoal), verificar se o `subscription.dispositivo_principal` está vazio.
- `[ ]` Se vazio: Renderizar UI de "Selecione seu Aparelho". Fazer um fetch na tabela `onboarding_devices` e montar botões clicáveis. Ocultar dados de M3U.
- `[ ]` Ao clicar num aparelho, dar update na coluna `dispositivo_principal` da assinatura ativa.
- `[ ]` Se não for vazio: Renderizar os M3U, e abaixo, fazer fetch na tabela `onboarding_steps` para o device escolhido, listando os passos de instalação passo a passo na tela do cliente.

## Fase 5: QA e Deploy (Deploy Engineer)
- `[x]` Executar o build estrito `npm run build` para checar tipagens da nova Function e Colunas.
