# Tasks: Implementação do CRM 100% Funcional

> [!WARNING]  
> Você deve rodar estes passos estritamente através do comando `/vibe-apply`.

- [ ] **1. Criação do Usuário no Supabase**
  - Acessar o Supabase (via script customizado chamando Supabase JS ou CLI) e registrar as credenciais solicitadas: E-mail: `mktfunil1@gmail.com` / Senha: `Mktfunil8563*`.

- [ ] **2. Refatoração Visual Crítica (Headers e Cores)**
  - Editar `src/pages/Index.tsx` e remover a seção `<!-- Page Header -->` que contém o cumprimento "Olá, Administrador".
  - Ajustar o CSS/Tailwind no `DashboardLayout.tsx` e `Index.tsx` para usarem variáveis do tema unificado (`bg-background`, sem usar HEX fixos que conflitem com as cores do Shadcn).
  - Garantir que não existam 3 blocos de cores dividindo a tela bizarramente.

- [ ] **3. Integração de Autenticação (Frontend)**
  - Instalar dependências se necessário (o pacote `@supabase/supabase-js` já existe).
  - Criar `src/features/auth/components/Login.tsx` com um visual Apple Liquid Glass 2026.
  - Implementar hook ou context `useAuth` para gerenciar estado logado vs deslogado.
  - Atualizar `App.tsx` para usar Rotas Privadas. Se deslogado, manda para `/login`.

- [ ] **4. Estruturação do Banco de Dados (Supabase CLI)**
  - Revisar as migrações em `supabase/migrations/`. 
  - Se não houver a tabela `units`, `managers` e `leads`, criar uma nova migration com `supabase migration new setup_crm_tables`.
  - Aplicar a migration com `supabase db push` ou `supabase migration up`.
  - Regenerar as tipagens TS: `npx supabase gen types typescript --local > src/types/database.types.ts`.

- [ ] **5. Conexão do Contexto e Mocks**
  - Alterar o arquivo `src/context/AppDataContext.tsx` para parar de usar os arrays estáticos fixos (`mockLeads`, `mockUnits`).
  - Buscar dados via Supabase na montagem da aplicação.

- [ ] **6. Teste e Validação**
  - Fazer login com as credenciais criadas.
  - Navegar até o dashboard (verificando a ausência do double header).
  - Testar o roteamento (forçar sair da URL manualmente).
