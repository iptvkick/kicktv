# Proposal: Controle de Rotas Baseado em Perfis (Role-Based Auth)

## 1. Requisitos
- Impedir completamente que usuários não autenticados acessem `/admin` ou `/cliente`.
- Impedir que um usuário com a role `cliente` consiga acessar `/admin`.
- Redirecionar fluxos de login com precisão, dependendo do perfil carregado do banco.
- Toda proteção principal deve acontecer no **Server-Side** (via Middleware do Next.js), eliminando piscadelas de UI (FOUC).

## 2. BDD Scenarios

### Cenário: Tentativa de acesso anônimo à área Admin
- **Given (Dado):** O usuário não possui uma sessão ativa.
- **When (Quando):** Ele digita `https://kicktv.app/admin` diretamente na barra de endereço.
- **Then (Então):** O middleware intercepta a requisição e faz um redirecionamento HTTP 307 para `/auth/login`. Nenhuma parte da UI do admin é vazada ou processada.

### Cenário: Cliente comum tentando acessar a área Admin
- **Given (Dado):** O usuário está autenticado, mas a tabela `profiles` diz que a sua role é `cliente`.
- **When (Quando):** Ele tenta forçar a entrada em `/admin/dashboard`.
- **Then (Então):** O sistema barra o acesso no servidor e o redireciona automaticamente para `/cliente/dashboard`, exibindo o painel correto para a sua conta.

### Cenário: Administrador fazendo login
- **Given (Dado):** O usuário insere credenciais cujo perfil no banco tem a role `admin`.
- **When (Quando):** Ele clica em "Entrar".
- **Then (Então):** A API Autentica o usuário, cria a sessão de cookies segura e roteia instantaneamente para `/admin/dashboard` renderizando a Dashboard Administrativa perfeitamente, com acesso garantido aos dados.
