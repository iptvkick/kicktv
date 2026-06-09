# Proposta de Implementação (014-admin-dashboard-real-data)

## Requisitos
1. Substituir mocks de dados da Dashboard Admin por consultas SSR reais no Supabase.
2. Criar as rotas e componentes UI em branco para as telas faltantes: `/admin/planos`, `/admin/servidores`, `/admin/tutoriais` (conforme menu lateral).
3. Na Dashboard:
   - Calcular Usuários Ativos.
   - Calcular Receita Mensal (`SUM` da tabela `payments` onde `status = 'pago'`).
   - Calcular Trials Ativos (count em `iptv_subscriptions`).
   - Listar últimos clientes registrados.
4. Caso a tabela `servers` ou `planos` seja necessária futuramente, criar a modelagem (por enquanto, podemos fazer Mock do status do servidor caso não exista na DB ou criar as tabelas).

## User Stories
- **Como Administrador**, quero ver os números exatos da minha receita e total de usuários em tempo real para tomar decisões baseadas em dados vivos.
- **Como Administrador**, quero poder clicar nas seções de Planos, Servidores e Tutoriais no menu lateral e ser redirecionado para a respectiva tela estruturada, mesmo que esteja vazia de lógica complexa inicialmente.

## Critérios de Aceite
- Todos os cards da página inicial devem consumir da Server Action do Supabase.
- A navegação não deve quebrar ao clicar nas outras páginas.
- Os cards devem manter a estética Premium (Liquid Glass) exata da imagem de referência, feita em TailwindCSS.

## BDD Scenarios

### Cenário: Carregamento do Painel de Admin com Dados
- **Given (Dado):** O Administrador está logado e o banco Supabase contém 5 clientes ativos e 3 trials.
- **When (Quando):** O Administrador acessa `/admin/dashboard`.
- **Then (Então):** O servidor realiza a contagem agregada, injeta nas props do componente UI, e os cards exibem exatamente "5" Ativos e "3" Trials, sem delay no cliente (SSR puro).

### Cenário: Navegação para Tela de Planos
- **Given (Dado):** O Administrador está no painel de controle.
- **When (Quando):** Ele clica em "Planos" na Sidebar.
- **Then (Então):** O sistema exibe a página `/admin/planos` contendo o cabeçalho "Gerenciar Planos", sem erro 404, mantendo a animação do `PageTransition`.
