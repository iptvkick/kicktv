# Research (RPI-R): Asaas Real-time Sync & Device Selector

## Contexto
O usuário apontou novas necessidades vitais para a automatização e usabilidade final:
1. **Sincronização de Planos (Admin -> Asaas):** Atualmente, criar um plano em `planos.tsx` apenas o salva no Supabase local. Ele precisa ser refletido como uma Assinatura ou Plano recorrente dentro do Asaas automaticamente.
2. **Sincronização de Clientes (Auth -> Asaas):** Novos perfis (`profiles`) criados não estão gerando Customers no Asaas. Precisamos de um espelhamento "real-time" para que as faturas PIX possam ser geradas depois sem dor de cabeça.
3. **Onboarding do Cliente (Dispositivo):** No Dashboard, quando o cliente inicia o Trial ou assina, ele precisa ter uma interface clara perguntando "Onde você vai instalar?". Se o sistema tentar adivinhar, pode falhar.

## Análise Técnica Atual
- **Planos:** `planos.tsx` faz um `insert` direto na tabela `subscription_plans`.
- **Clientes:** `profiles` possui uma trigger que gera o Trial de 4h (criada na Spec 009).
- **Onboarding Cliente:** O dashboard foi refatorado para usar Abas. O ideal é termos uma aba "Instalação" ou exibir o Seletor de Aparelhos como um Passo Obrigatório antes de liberar as senhas M3U.

## Soluções Arquiteturais
1. **Webhooks vs Aplicação:** Para o cruzamento em tempo real, utilizaremos **Edge Functions** chamadas a partir de **Triggers do PostgreSQL** (via `pg_net` ou `http` extension). Isso garante que, independente de onde o dado seja criado (Admin, API, CLI), o Asaas sempre será avisado. Se `pg_net` for complexo localmente, usaremos a abordagem de Edge Functions chamadas diretamente pela UI no `planos.tsx` e uma Edge Function chamada via Trigger na criação do profile.
2. **Device Selector:** No Dashboard do cliente, se o campo `selected_device_id` no perfil estiver vazio, a Aba Pessoal mostrará um Grid com as opções de Aparelho (lendo `onboarding_devices`). Ao clicar, o sistema salva e renderiza os `onboarding_steps` para ele.
