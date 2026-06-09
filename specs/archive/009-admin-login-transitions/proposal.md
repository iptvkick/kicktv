# Proposal: Resolução de Acesso Admin e UX Dinâmica

## Escopo
Garantir que o acesso ao Painel de Administração seja efetivado corretamente elevando os privilégios do usuário, e aprimorar significativamente a Experiência do Usuário (UX) implementando navegação espacial (sliding transitions) ao invés de simples fades verticais.

## User Stories
1. **Como Administrador**, eu quero conseguir logar na minha conta e ser reconhecido como "admin" pelo sistema, para poder acessar o painel web.
2. **Como Usuário**, eu quero que, ao clicar nos botões do menu inferior, a tela deslize horizontalmente indicando a direção espacial (ex: se clico no item à direita, a tela vem da direita para a esquerda).
3. **Como Administrador**, eu quero que o painel se adapte perfeitamente: menu flutuante no celular e barra lateral estática no computador.

## BDD Scenarios

### Cenário: Promoção e Login de Administrador
- **Given (Dado):** que o usuário registrou seu email no sistema (ex: `admin@kicktv.com`) e o banco de dados atualizou sua role para `admin`.
- **When (Quando):** ele faz o login na tela inicial.
- **Then (Então):** o sistema detecta a role correta e o direciona para `/admin/dashboard` instantaneamente.

### Cenário: Transição Espacial de Telas (Mobile/Desktop)
- **Given (Dado):** que o usuário está na tela "Início" (índice 0 no menu).
- **When (Quando):** ele clica no botão "Perfil" (índice 3, à direita).
- **Then (Então):** a tela atual desliza para a esquerda, e a nova tela (Perfil) entra deslizando da direita, criando a sensação de espaço físico.
