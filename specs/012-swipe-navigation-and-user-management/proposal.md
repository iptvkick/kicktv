# Proposal: Global Swipe & Admin Architecture

## Requisitos
- **REQ-01 (Swipe Global):** A navegação principal do cliente (Início, Player, Suporte, Perfil) deve ser comutável através de gestos de Swipe/Drag horizontal usando `framer-motion`, simulando abas de um App nativo (Tinder/Instagram like).
- **REQ-02 (Refatoração do Perfil):** Remover os conteúdos de "Pagamento" e "Segurança" de dentro de `dashboard.tsx`. A tela `perfil.tsx` assumirá o controle, contendo botões que expandem ou navegam para sub-telas dedicadas para Pagamento (Faturas do Asaas) e Segurança.
- **REQ-03 (Admin Asaas Centralizado):** A tela `planos.tsx` deve ser o epicentro de todas as integrações financeiras. As chaves de API (Sandbox/Production) devem ser movidas para o topo desta tela, eliminando a necessidade de uma tela isolada de `configuracoes.tsx`.
- **REQ-04 (Admin Gerenciamento de Usuários):** Criar uma nova rota administrativa `/admin/usuarios` que liste todos os clientes cadastrados (`profiles`), exibindo status da assinatura (`subscriptions`), datas de expiração e permitindo interações (edição ou revogação de acesso).

## User Stories
1. **Como Cliente no Celular**, quero arrastar o dedo para o lado em qualquer lugar da tela e ser levado para a tela de Suporte ou Perfil instantaneamente, sem precisar clicar na barra inferior minúscula.
2. **Como Cliente**, quero clicar em "Meu Perfil" e ver claramente as opções da minha conta separadas, com botões grandes, em vez de abas apertadas na tela inicial.
3. **Como Administrador**, quero ter uma lista de todos os usuários do sistema, buscar por email e verificar rapidamente se estão com o plano "Ativo" ou "Expirado".

## BDD Scenarios

### Cenário 1: Navegação Swipe Nativa
- **Given (Dado):** O cliente está acessando pelo celular na rota `/cliente/dashboard` (Início).
- **When (Quando):** Ele arrasta a tela da direita para a esquerda (offset horizontal <-50px).
- **Then (Então):** O React Router intercepta a animação e o redireciona automaticamente para `/cliente/player` de forma animada.

### Cenário 2: Gestão de Usuários
- **Given (Dado):** O Administrador acessa o menu lateral esquerdo e clica em "Gerenciar Usuários".
- **When (Quando):** A página carrega e busca os dados de `profiles`.
- **Then (Então):** Uma tabela preenchida com as colunas (Email, Plano, Vencimento, Status) é renderizada com opção de filtro, permitindo ao admin ter visão macro de sua base.
