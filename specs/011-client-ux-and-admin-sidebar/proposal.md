# Proposal: Client UX Enhancements & Admin Sidebar

## Requisitos
- **REQ-01 (Admin Sidebar):** Adicionar um link no componente `admin.tsx` apontando para `/admin/configuracoes` com o ícone adequado (ex: Settings), permitindo navegação para a tela de integrações do Asaas.
- **REQ-02 (Swipe Views):** Na tela de Perfil / Dashboard do cliente, o conteúdo das abas (Dados Pessoais, Pagamento, Segurança) deve responder ao gesto de arrastar horizontalmente (swipe right/left) e deve possuir uma animação suave (Slide).
- **REQ-03 (Notification Panel):** O botão de sino na Home do Cliente não pode ser um elemento estático. Ele deve abrir um painel "Off-canvas" ou Popover flutuante no topo de forma muito suave.
- **REQ-04 (Upgrade de Plano / Telas Extras):** O ícone de engrenagem no Card de Plano do Dashboard deve disparar a abertura de um Modal. Este modal permitirá ao usuário ver a opção de "Adicionar +1 ou +2 Telas Extras" calculando com base na coluna `extra_screen_price` (buscada via join com a tabela de Planos).

## User Stories
1. **Como Cliente no Celular**, quero poder deslizar meu dedo para a direita para sair de Dados Pessoais e ir para Pagamento, gerando fluidez como num aplicativo nativo bancário.
2. **Como Cliente**, quero clicar no ícone de Notificações e ver um slide suave me dizendo que não tenho notificações recentes.
3. **Como Administrador**, quero ter um atalho visível no meu painel esquerdo para acessar a área do Asaas, pois esqueci a URL escondida `/admin/configuracoes`.

## BDD Scenarios

### Cenário 1: Drag to Switch Tabs
- **Given (Dado):** O cliente está na página `/cliente/dashboard` com a aba "Dados Pessoais" ativa.
- **When (Quando):** Ele arrasta o conteúdo da tela para a esquerda com o mouse/dedo.
- **Then (Então):** A tela transita para a aba "Pagamento" revelando a seção do PIX de forma animada, sem *hard refresh*.

### Cenário 2: Admin acha as Configurações
- **Given (Dado):** O Administrador loga no `/admin`.
- **When (Quando):** Ele olha o painel lateral escuro.
- **Then (Então):** Ele enxerga a opção "Configurações Asaas" logo abaixo de "Planos", clicando e abrindo as chaves com sucesso.
