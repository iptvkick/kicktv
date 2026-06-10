# Spec 005: Admin CRUD Realization - Tasks

## [x] Frontend UI / Forms (`frontend-engineer`)

### 1. Rota de Planos (`/admin/planos.tsx`)
- [x] Deletar arrays mockados.
- [x] Criar estado `newPlan` (`useState`) para controlar os inputs de criação.
- [x] Garantir que os `inputs` da lista tenham `onChange` configurados ou substituí-los por textos puros com botão "Editar" ao lado.
- [x] Ligar o botão de Salvar (remover "mock") à função de `insert` real do Supabase.

### 2. Rota de Servidores (`/admin/servidores.tsx`)
- [x] Substituir inputs inativos/readOnly por formulários controlados de fato.
- [x] Implementar a mutação no botão "Salvar".

### 3. Rota de Onboarding (`/admin/onboarding.tsx`)
- [x] Garantir que o formulário de "Novo Passo" captura a digitação.
- [x] Atualizar a renderização da lista para depender 100% dos dados reais trazidos do Supabase.

### 4. Remoção Global de (mock)
- [x] Fazer uma busca (`ctrl+shift+f`) por "(mock)" em toda a pasta `src/` e deletar esses textos e comportamentos fakes dos botões.
