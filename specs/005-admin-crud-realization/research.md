# Spec 005: Admin CRUD Realization - Research (RPI-R)

## O Problema Identificado
O usuário reportou que as telas de Admin (`planos.tsx`, `servidores.tsx`, `onboarding.tsx`) continuam travadas e disfuncionais. Os botões exibem o texto `(mock)` e os inputs estão inativos (não é possível digitar ou apagar informações).

## Análise do Erro do Subagente Frontend
Na Spec 004, o `frontend-engineer` adicionou as chamadas `supabase.from(...)`, mas falhou criticamente na camada de Apresentação (UI):
1. **Arrays Hardcoded:** Em vez de usar os dados retornados do Supabase no estado (`setPlans(data)`), a interface continuou iterando sobre as constantes antigas mockadas (`MOCK_PLANS`, `MOCK_SERVERS`).
2. **Inputs Não-Controlados / Disabled:** Os campos de input provavelmente estão com atributos `readOnly` ou com `value` fixo sem `onChange`.
3. **Botões "Falsos":** Os botões de salvamento mantiveram o console.log ou os textos de placeholder da Spec 001.

## Solução Necessária
Precisamos de uma intervenção cirúrgica apenas nas views do Admin. É necessário remover completamente os arrays estáticos do código, criar estados (`useState`) para formulários de criação/edição e ligar os eventos `onChange` e `onClick` reais.
