# Tarefas de Integração Backend (Spec 023)

## Backend / Banco de Dados (Subagente de Backend)
- [ ] Criar arquivo de migration SQL (`supabase migration new add_nome_to_profiles`).
- [ ] Adicionar `ALTER TABLE public.profiles ADD COLUMN nome TEXT;`.
- [ ] Criar a tabela `integrations` (ou `settings`) com suporte a RLS (apenas Admin tem acesso) contendo colunas como `asaas_api_key`.
- [ ] Executar a migration localmente (`supabase migration up`).
- [ ] Atualizar as tipagens do TypeScript executando o gerador do Supabase.

## Frontend Admin (Subagente Frontend)
- [ ] Acessar `src/routes/admin/index.tsx`. Trocar as consultas legadas pela tabela real `subscriptions` e `profiles`.
- [ ] Acessar `src/routes/admin/servidores.tsx` e `src/routes/admin/planos.tsx`. Remover todos os arrays e dados mockados.
- [ ] Substituir o conteúdo das tabelas nestas duas rotas por consultas Reais no Supabase (`select * from servers`, `select * from plans`).
- [ ] Criar a nova rota `src/routes/admin/integracoes.tsx` seguindo o design claro do projeto. Adicionar formulários de input para chaves da API (ex: Asaas) que salvam direto na nova tabela do Supabase.
- [ ] Ativar os botões de configuração (Adicionar Novo, Editar, Excluir). Implementar a chamada de banco de dados nativa do Supabase (ex: `.from('servers').insert({...})`) conectada aos diálogos/modais de input.

## Frontend Cliente (Subagente Frontend)
- [ ] Em `src/routes/cliente/dashboard.tsx`: Alterar "Olá, Cliente" para utilizar `profile?.nome || "Cliente"`.
- [ ] Em `src/routes/cliente/perfil.tsx`:
  - Remover qualquer hardcode ou mock.
  - Criar um formulário simples permitindo atualizar o campo `nome` na tabela `profiles`.
  - Conectar ao método `supabase.from("profiles").update({ nome })`.
- [ ] Garantir que o erro 406 ao buscar profiles não aconteça mais (o trigger de banco cuida da criação, mas o frontend deve ter um handler apropriado caso falhe).
