# Spec 005: Admin CRUD Realization - Proposal

## Requisitos do Sistema
1. **Interatividade Total (Admin):** Nenhum campo de input nas rotas de Admin deve ser inativo. Todos devem aceitar digitação e deleção de caracteres.
2. **Exclusão de Dados Mockados:** Constantes como `MOCK_PLANS` devem ser deletadas do código fonte. A tela não deve renderizar nada se o banco estiver vazio.
3. **Botões Funcionais:** Substituir botões marcados com `(mock)` por botões reais que executam `supabase.from('...').insert()` ou `.update()`.

## BDD Scenarios

### Cenário: Adição Real de Plano
- **Given (Dado):** que o Administrador acessa `/admin/planos`.
- **When (Quando):** ele preenche os inputs (que agora são editáveis) com Nome "Plano X" e Valor "50" e clica em "Salvar".
- **Then (Então):** A tela exibe um estado de carregamento (Spinner) e insere o plano no Supabase. O novo plano aparece na lista imediatamente.

### Cenário: Edição de Tutorial
- **Given (Dado):** que o Administrador acessa `/admin/onboarding`.
- **When (Quando):** ele edita o texto de um passo já existente em um input controlável.
- **Then (Então):** o botão "Salvar" dispara um UPDATE no banco usando o ID daquele dispositivo.
