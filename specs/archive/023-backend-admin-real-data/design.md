# Design de Dados e Supabase (Spec 023)

## Alterações de Banco de Dados (Supabase)
O subagente Backend deverá gerar uma nova migration no Supabase:
1. `ALTER TABLE public.profiles ADD COLUMN nome TEXT;`
2. Corrigir as queries no dashboard Admin para refletirem a estrutura real do banco de dados (tabela `subscriptions` em vez de `iptv_subscriptions`).
3. Criar uma tabela (ou utilizar schema de config nativo) chamada `settings` ou `integrations` para armazenar de forma segura o `asaas_api_key`, `asaas_wallet_id` e afins.
4. Para o Admin, a métrica de Receita precisará ser mockada ou lida de outra fonte, pois não temos a tabela de pagamentos real no schema core atual. A prioridade é consertar a lista de usuários, status (trialing, active) e a tabela de registros.

## Alterações de UI (Frontend)
O subagente Frontend deverá:
1. Em `/cliente/dashboard.tsx`: Alterar "Olá, Cliente" para `Olá, {profile.nome || "Cliente"}`.
2. Em `/cliente/perfil.tsx`: Implementar o formulário real para atualizar os dados de Perfil (nome, etc), interligado via Supabase.
3. Em `/admin/index.tsx`: Atualizar a lógica do React para puxar os dados de `subscriptions` reais.
4. Em `/admin/servidores.tsx` e `/admin/planos.tsx`: Eliminar dados hardcoded/mocks. Conectar as tabelas com as chamadas Supabase nativas (`supabase.from("servers").select("*")` e `supabase.from("plans").select("*")`).
5. Criar a rota `/admin/integracoes.tsx`: Interface para o administrador inserir sua Chave de API do Asaas e outros tokens de configuração global do sistema. Tudo lido e gravado via Supabase.
6. As interfaces de Configuração (Adicionar/Editar/Excluir Servidor, Plano ou API Key) devem possuir formulários (Dialog/Modals) 100% interativos que chamam `insert`/`update`/`delete` no banco de dados.

A interface deverá manter EXATAMENTE o padrão "White Minimalist" recém-aprovado e limpado na Spec 022. Nenhuma alteração de estética (como mudar fundos ou bordas) está autorizada, apenas preenchimento de dados reais.
