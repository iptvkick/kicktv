# Proposal: Auth Routing e Fix de Estilos

## 1. Requisitos
- **Correção Visual:** O projeto deve compilar com TailwindCSS v4 carregado corretamente, exibindo o layout planejado para as rotas já existentes, eliminando a exibição de HTML quebrado.
- **Roteamento de Acesso (Auth):**
  - Implementar navegação explícita e intuitiva a partir da Landing Page (ou de qualquer página pública) para os fluxos de Login (`/auth/login`) e Registro (`/auth/register`).
  - O fluxo de Registro ("Novo Usuário") deve capturar as informações necessárias para criar um novo usuário cliente.
- **Redirecionamento Pós-Login baseado em Role (Admin vs Cliente):**
  - Após um login com sucesso, o sistema deve direcionar um administrador para `/admin` e um cliente padrão para o `/cliente/dashboard`.

## 2. User Stories
1. **Como visitante**, quero visualizar o site com um design premium, funcional e bem estilizado, para ter confiança na plataforma.
2. **Como visitante**, quero encontrar botões claros de "Login" e "Criar Conta/Novo Usuário", para que eu consiga me registrar e acessar a plataforma.
3. **Como usuário cliente logado**, quero ser redirecionado para o meu painel cliente logo após inserir minhas credenciais corretamente, para gerenciar minha assinatura.
4. **Como administrador logado**, quero ser redirecionado para a área de admin, para gerenciar as configurações gerais e usuários do sistema.

## 3. Critérios de Aceite
- Ao rodar `npm run dev` ou abrir a versão de produção, todas as classes utilitárias do TailwindCSS devem ser processadas corretamente, e o visual original da aplicação deve ser restaurado.
- Os botões na navegação principal (navbar) ou nas chamadas de ação da página principal devem apontar efetivamente para as páginas de registro e login.
- O componente de autenticação (formulário de login) deve realizar login via Supabase e lidar com o respectivo redirect dependendo da role do usuário.
- O componente de registro deve ser capaz de salvar com sucesso uma nova conta.

## 4. BDD Scenarios

### Cenário: Exibição correta da interface
- **Given (Dado):** que a configuração do TailwindCSS e do TanStack Router estão aplicadas no projeto
- **When (Quando):** o usuário acessa a raiz `/` (ou qualquer outra rota)
- **Then (Então):** o navegador deve renderizar o DOM com o CSS processado sem classes tailwind "vazadas" e layout visual agradável.

### Cenário: Navegação para criar nova conta
- **Given (Dado):** que o visitante está na página principal não autenticado
- **When (Quando):** ele clica no botão "Gerar Teste Grátis" ou "Criar Conta"
- **Then (Então):** ele deve ser levado à rota `/auth/register` com o formulário de cadastro exposto.

### Cenário: Redirecionamento de um Administrador
- **Given (Dado):** que o usuário admin informou seu e-mail e senha no `/auth/login`
- **When (Quando):** ele clica no botão "Entrar" e as credenciais são validadas
- **Then (Então):** o sistema o redireciona automaticamente para a rota `/admin`.

### Cenário: Redirecionamento de um Cliente Padrão
- **Given (Dado):** que um usuário cliente preencheu as credenciais válidas no `/auth/login`
- **When (Quando):** o login é concluído com sucesso e o token da sessão gerado
- **Then (Então):** o sistema detecta que seu perfil é de cliente comum e redireciona para `/cliente/dashboard`.
