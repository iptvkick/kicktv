# Design & Tasks: Spec 013 (Bugfixes & Profile CPF)

## UI/UX
- A aba "Dados Pessoais" dentro da página de Perfil deve ser renderizada condicionalmente: um estado "Visualização" e um estado "Edição".
- No estado de Edição, aparecerão os inputs `Nome`, `E-mail` (read-only por motivos de Auth) e `CPF`.

## Tasks

> ⛔ **REGRA DE OURO:** Delegar.

### Fase 1: Database (Database Engineer)
- `[ ]` Criar migration para adicionar a coluna `cpf` na tabela `profiles`.
- `[ ]` Atualizar o arquivo de tipos manualmente (`types.ts`).

### Fase 2: Frontend (Frontend Engineer)
- `[ ]` Consertar o bug de Swipe no `dashboard.tsx`: Adicionar `style={{ touchAction: "pan-y" }}` na motion.div global em `cliente.tsx` ou remover containers com `overflow-x-hidden` que bloqueiam a propagação de touch.
- `[ ]` No `perfil.tsx` (Dados Pessoais), implementar o formulário (controlled components) que faça `supabase.from('profiles').update({ full_name, cpf })`.
