# Spec 023: Backend & Admin Real Data Integration

## Objetivo
Atender à requisição de conectar a UI do Admin e do Cliente aos dados reais do banco (Supabase), eliminando hardcodes e mocks. Resolver o bug onde a tela de cliente chama o usuário genérico "Olá, Cliente" e os botões de configuração não funcionam.

## Requisitos
1. **Modelagem de Dados**: A tabela `profiles` deve possuir uma coluna `nome` (`TEXT`) para armazenar o nome real do usuário, permitindo saudações dinâmicas no frontend.
2. **Correção Plena do Painel Admin**: O arquivo `src/routes/admin/index.tsx` e TODAS as telas filhas (`/admin/planos`, `/admin/servidores`, etc) estão consultando tabelas legadas ou apenas exibindo mocks estáticos. Elas precisam ser conectadas às tabelas reais (`subscriptions`, `plans`, `servers`), e suas interfaces de configuração (botões de adicionar, editar, excluir) devem estar 100% funcionais, conectadas ao backend. Adicionalmente, será criada/estruturada a tela de **Integrações (`/admin/integracoes`)**, permitindo que o administrador configure chaves de API reais (como o **Asaas**) e as salve de forma segura no banco de dados.
3. **Correção do Painel Cliente**:
   - Resolução dos erros `406 Not Acceptable` garantindo que o perfil do usuário seja criado caso não exista (upsert), ou permitindo edição no `/cliente/perfil.tsx`.
   - Saudação deve utilizar `profile.nome` (com fallback para e-mail caso vazio).
4. **Resolução de RLS (403 Forbidden)**: Garantir que a policy na tabela `subscriptions` permita corretamente a leitura via client (anon/authenticated keys válidas).

## BDD Scenarios

### Cenário: Exibição Correta do Nome do Cliente
- **Given (Dado):** Um cliente logado com o nome "João" em seu `profile`
- **When (Quando):** Ele acessa `/cliente/dashboard`
- **Then (Então):** A tela deve exibir "Olá, João", substituindo o mock "Olá, Cliente".

### Cenário: Métricas Reais no Painel Admin
- **Given (Dado):** O sistema possui 10 `subscriptions` ativas no banco de dados real
- **When (Quando):** O admin acessa `/admin/`
- **Then (Então):** Os cards superiores devem exibir "10 Usuários Ativos", lendo diretamente da tabela `subscriptions` em vez de mocks ou tabelas inexistentes.
