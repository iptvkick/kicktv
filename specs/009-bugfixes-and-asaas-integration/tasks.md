# Tasks: Bugfixes e Integração Asaas

> ⛔ **REGRA DE OURO:** Agentes devem focar exclusivamente em sua disciplina e marcar `[x]` apenas após validar sua etapa.

## Fase 1: Database (Database Engineer)
- `[ ]` Criar uma nova migration em `supabase/migrations/` para alterar a tabela `integrations`: Adicionar a coluna `credentials JSONB DEFAULT '{}'::jsonb`. (A antiga `api_key` pode ser ignorada no código).
- `[ ]` Criar uma nova migration em `supabase/migrations/` contendo uma trigger na tabela `profiles`. A função deve ser executada `AFTER INSERT ON profiles` e deve realizar o seguinte:
  - Inserir na tabela `subscriptions` uma linha com `profile_id = NEW.id`, `status = 'trialing'`, e `expires_at = timezone('utc'::text, now()) + interval '4 hours'`.
  - Garantir que essa trigger tenha privilégios para burlar RLS (usando `SECURITY DEFINER`).
- `[ ]` Garantir que a tabela `onboarding_steps` existe e possui `id`, `device_id` (relacionado a `onboarding_devices`), `title`, `description`, `youtube_id` e `order_index`. Se não existir, criá-la com RLS apropriado.
- `[ ]` Rodar localmente `supabase gen types typescript --local` para que o frontend receba as tipagens das colunas novas e da tabela de steps.

## Fase 2: Backend (Backend Engineer)
- `[x]` Criar uma Supabase Edge Function chamada `asaas-ping`. Ela receberá `{ "environment": "sandbox", "apiKey": "..." }` no body.
- `[x]` Na function, fazer um request simples de leitura para `https://sandbox.asaas.com/api/v3/customers?limit=1` (se for sandbox) ou `https://api.asaas.com/v3/customers?limit=1` (se produção). Passar o header `access_token` e retornar os dados (ou erro).

## Fase 3: Frontend Client (Frontend Engineer)
- `[ ]` Ler as alterações do banco via `types.ts`.
- `[ ]` Em `src/routes/cliente/dashboard.tsx`, refatorar totalmente o layout de 247 linhas.
- `[ ]` Criar o componente de state `activeTab` ('pessoal' | 'pagamento' | 'seguranca').
- `[ ]` Criar o "Pill Navigation" (3 botões arredondados em linha) abaixo do Header.
- `[ ]` Condicional de Renderização: 
  - **Aba Pessoal**: Exibir o Hero Card que mostra se a pessoa está Trialing, o Countdown das 4 Horas ou o aviso de expirado. Mover dados de senha M3U para aqui.
  - **Aba Pagamento**: Mover as seções de Faturas Asaas e Checkout (PIX) para esta view.
  - **Aba Segurança**: Adicionar campo de refazer senha via Supabase Auth (Se não houver API para isso de imediato, apenas deixar o placeholder).

## Fase 4: Frontend Admin (Frontend Engineer)
- `[ ]` Em `src/routes/admin/onboarding.tsx`, criar o estado `selectedDevice`.
- `[ ]` Quando clicar em um device da lista, buscar em `supabase.from('onboarding_steps')` os passos correspondentes. 
- `[ ]` Remover os formulários mockados da direita e acoplar as funções reais de `insert`, `update` e `delete` em `onboarding_steps`. Atualizar a view em tempo real ao salvar.
- `[ ]` Em `src/routes/admin/configuracoes.tsx`, ler `credentials` de `integrations`. Renderizar os inputs separados para Sandbox e Production, o Toggle de ambiente e acoplar a chamada HTTP para a função `asaas-ping` no botão de "Testar Integração".

## Fase 5: QA e Deploy (Deploy Engineer)
- `[x]` Executar o build estrito `npm run build` para garantir que o refactoring de tipagem JSONB não quebrou telas antigas.
