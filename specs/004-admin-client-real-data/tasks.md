# Spec 004: Real Data & Clean UI - Tasks

## [x] Database / Backend (`database-engineer`)
- [x] Criar a tabela `integrations` para armazenar as chaves de API (ex: Asaas).
- [x] Aplicar RLS estrito: apenas Admins (verificando `user_roles`) podem ler/escrever na tabela `integrations`.
- [x] Inserir linha base para `provider = 'asaas'` na tabela de integrações.
- [x] Rodar `supabase gen types typescript --local` para atualizar o `types.ts` do frontend.

## [x] Frontend UI / Data Binding (`frontend-engineer`)

### 1. Paleta de Cores
- [x] Editar `src/styles.css` para remover qualquer menção ao "verde" e garantir que `--accent` seja um contraste monocromático forte (preto no claro, branco no escuro).

### 2. Integração do Painel Admin (CRUD Real)
- [x] Criar tela `/admin/configuracoes` com formulário para gerenciar a chave do Asaas (buscando e salvando na tabela `integrations`).
- [x] Refatorar os componentes de `/admin` (Planos, Servidores, Onboarding) para remover arrays mockados e implementar `supabase.from(...)` para carregar dados reais.
- [x] Garantir que ações de Adicionar, Editar e Excluir estejam funcionando e refletindo no Supabase.

### 3. Redesign do Painel do Cliente
- [x] Fazer uma varredura visual em `src/routes/cliente.tsx` e seus componentes filhos para remover designs antigos/quebrados.
- [x] Unificar o visual dos cards com a estética Pill (`rounded-[24px]`).
- [x] Puxar os dados reais do plano do usuário (`subscription_plans` e data de expiração da assinatura) diretamente do Supabase.
