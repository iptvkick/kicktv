# Proposal: Transição para CRM 100% Funcional

## Visão Geral
Este proposal define os requisitos para transformar o atual mockup "GerentesMec" em uma aplicação funcional real, removendo dados falsos, inserindo proteção de rotas, arrumando defeitos visuais críticos e conectando as tabelas e autenticação com o Supabase.

## Requisitos de Negócio
- **Autenticação**: O sistema deve possuir uma tela de Login que valide as credenciais junto ao Supabase Auth.
- **Roteamento Protegido**: Telas como `/`, `/crm`, `/gerentes`, `/config` e `/relatorios` não podem ser acessadas sem um usuário autenticado.
- **Unidades = Canais Chatwoot**: O cadastro de unidades dentro de configurações deve servir como de-para para os Inbox/Channels do Chatwoot.
- **Dados Reais**: O Dashboard global e o ranking de gerentes devem espelhar as informações persistidas no banco.

## BDD Scenarios

### Cenário: Acesso Negado a Visitantes
- **Given (Dado):** que o visitante não está autenticado no sistema.
- **When (Quando):** ele tenta acessar a URL principal (`/`).
- **Then (Então):** ele deve ser imediatamente redirecionado para a rota de `/login`.

### Cenário: Autenticação com Sucesso
- **Given (Dado):** que o usuário está na tela de `/login`.
- **When (Quando):** ele insere o e-mail `mktfunil1@gmail.com` e a senha válida.
- **Then (Então):** o sistema o redireciona para o Dashboard, e a saudação no Header passa a exibir seu nome e status correto.

### Cenário: Unificação de Layout no Dashboard
- **Given (Dado):** que o usuário está logado e visualizando a rota `/`.
- **When (Quando):** o Dashboard é renderizado.
- **Then (Então):** ele deve visualizar um único Header de navegação superior, sem saudações duplicadas, com um fundo contínuo e integrado ao menu lateral sem divisões abruptas de cores.

### Cenário: Dados Reais no CRM
- **Given (Dado):** que existem auditorias salvas no Supabase para a Unidade "Dom Pedro".
- **When (Quando):** o usuário acessa a rota `/crm` e filtra por "Dom Pedro".
- **Then (Então):** o Kanban deve exibir os cards de atendimento processados diretamente do banco de dados, descartando os mocks locais.
