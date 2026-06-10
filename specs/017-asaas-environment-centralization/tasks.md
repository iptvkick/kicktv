# Tasks: Asaas Environment & Centralization (Spec 017)

> ⛔ **REGRA DE OURO:** Delegar!

## Fase 1: Centralização e Limpeza Frontend (Frontend Engineer)
- `[x]` Em `src/routes/admin/integracoes.tsx`, adicione um RadioGroup ou Select (estilo moderno) para selecionar o "Ambiente" (`sandbox` ou `production`) no formulário do Asaas.
- `[x]` Atualize a função de save (`handleSave`) para incluir `environment: asaasEnvironment` no objeto `credentials`.
- `[x]` Leia e **Delete/Remova** toda a seção de configuração de chaves de API Asaas do arquivo `src/routes/admin/planos.tsx` (exclua os accordions de configurações que sobrepõem a tela de integrações).
- `[x]` Leia e **Delete/Remova** toda a seção de configuração do Asaas do arquivo `src/routes/admin/configuracoes.tsx` (caso ainda exista código lá), de modo que APENAS `integracoes.tsx` cuide disso.

## Fase 2: Backend e Nuvem (Backend Engineer)
- `[x]` Na verdade, a Edge Function `asaas-ping-test` já lê `credentials?.environment === 'production'` nativamente graças às specs antigas! Não é preciso alterar o backend de Ping Test, apenas garantir que a UI de integrações passe a variável corretamente pro banco. O Backend Engineer atuará apenas como QA verificando se a estrutura do banco (tabela `integrations`) suporta o novo JSON sem problemas de tipagem em `types.ts`.
