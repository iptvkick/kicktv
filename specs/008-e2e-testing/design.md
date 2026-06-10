# Spec 008: E2E Agentic Testing (QA Pipeline) - Design

## Arquitetura de Testes E2E

### Estrutura de Pastas e Arquivos
1. **`playwright.config.ts`**: Configuração básica do Playwright.
   - Timeout padrão de 15 segundos por teste para rapidez.
   - Rodar em modo Headless por padrão.
   - Configurar para usar o servidor local do Vite em `http://localhost:8080` rodando em background.
2. **`tests/e2e.spec.ts`**: Casos de teste automatizados em TypeScript.
   - **Fluxo de Admin (CRUD Planos):**
     1. Navega para `/admin/planos`.
     2. Preenche formulário de novo plano (nome, preço, descrição).
     3. Clica em "Adicionar/Salvar".
     4. Valida que o novo plano aparece listado.
     5. Clica em "Excluir" no plano criado.
     6. Valida que o plano desaparece da lista.
   - **Fluxo de Admin (CRUD Servidores):**
     1. Navega para `/admin/servidores`.
     2. Preenche novo servidor.
     3. Salva e valida listagem.
     4. Exclui e valida remoção.
   - **Fluxo de Onboarding Cliente:**
     1. Navega para `/onboarding`.
     2. Avança nas etapas selecionando dispositivo.
     3. Verifica se as instruções correspondentes são exibidas de forma correta.

## Integração de Banco de Dados e Backend
1. **Banco de Dados:**
   - Inserções diretas de teste e validações usando o cliente Supabase ou queries psql locais para garantir RLS ativo e permissões corretas.
2. **Backend (Edge Functions):**
   - Disparo de requisições mock via fetch para validar o endpoint `/functions/v1/create-trial` e as rotas webhook de pagamento sem depender do fluxo visual.
