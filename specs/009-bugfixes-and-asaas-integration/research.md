# Research (RPI-R): Bugfixes e Integração Asaas

## 1. Contexto e Escopo
O cliente apontou três áreas de atrito graves no fluxo atual:
1. **Onboarding Admin (`src/routes/admin/onboarding.tsx`)**: Atualmente, a criação de "Passos de Onboarding" para dispositivos é mockada no estado local (`steps`) e não há relação 1:N com a tabela `onboarding_devices`.
2. **Integração Asaas (`src/routes/admin/configuracoes.tsx`)**: O painel só possui um campo genérico para "API Key". Não suporta ambientes (Sandbox vs Prod) e não há como testar a conexão diretamente pela UI.
3. **Painel do Cliente (`src/routes/cliente/dashboard.tsx`)**: 
   - Ao criar a conta, o usuário não possui uma linha em `subscriptions` (ou a mesma não é definida como `trial` com expiração de 4h). Com isso, a UI já renderiza "Expirado / Sem plano ativo".
   - A interface do Dashboard está linear, misturando dados da assinatura com métodos de pagamento, sem uma separação limpa.

## 2. Análise do Código Existente
### Frontend
- **Onboarding Admin**: O estado `steps` é hardcoded no useState. Não há fetch nem insert para `onboarding_steps`. 
- **Configuração Asaas**: A UI lê de `integrations` com `provider = 'asaas'`, mas assume um único campo de texto `api_key`. O `supabase upsert` salva isso na raiz da tabela.
- **Dashboard do Cliente**: O `dashboard.tsx` tem 247 linhas. O layout apresenta um "Hero Card" de assinatura, mas o botão PIX e outras infos ficam jogadas abaixo. A UI atual é estática e monolítica.

### Database (Supabase)
- A tabela `integrations` tem a coluna `api_key` como `text`. Para suportar Sandbox e Produção, precisaremos alterar a modelagem (ou adicionar um JSONB, ou adicionar colunas `sandbox_key`, `production_key`, `environment`).
- O sistema de trial precisa ser garantido. Atualmente, novos usuários são salvos na tabela `profiles`. A tabela `subscriptions` deve ser populada via Trigger do Postgres ou Edge Function assim que a conta é criada.

## 3. Benchmarking
- **Stripe/Asaas UI**: Ambos usam chaves duplas (Live e Test) controladas por um Toggle global ou Toggles na página de Developers. Nosso admin adotará o padrão de "Environment Switch".
- **Netflix/Max (Dashboard)**: Utilizam navegação horizontal (Tabs) para separar "Conta", "Cobrança" e "Perfis". Adotaremos Tabs para o Cliente.
