# Proposal (018-landing-and-login-fix)

## Requisitos
1. **Reversão de Tema:** A Landing Page (`src/app/page.tsx`) e a página de Login (`src/app/auth/login/page.tsx`) devem abandonar a paleta escura (Dark Glow) e adotar o padrão "Branco Minimalista / Maximalista" que já é sucesso na área administrativa.
2. **Correção do Bug de Acesso:** O sistema não deve barrar usuários de acessar a plataforma caso eles não possuam um registro atrelado na tabela `profiles`. O Fallback será considerar qualquer erro de profile fetching como acesso padrão de "Cliente".

## BDD Scenarios

### Cenário: Acesso à Landing Page Clara
- **Dado** que o visitante acessa a rota `/`
- **Quando** o componente é renderizado
- **Então** ele deve visualizar um fundo claro (`bg-white` ou `bg-slate-50`), textos escuros com alto contraste e uma estética minimalista, sem brilhos neons que o incomodem.

### Cenário: Login de cliente sem Perfil na Tabela
- **Dado** que o usuário digita um e-mail e senha válidos no Supabase Auth
- **Quando** o sistema tenta buscar sua role na tabela `profiles` e falha (vazio)
- **Então** o sistema ignora o erro silenciosamente, loga o usuário e o redireciona diretamente para `/cliente/dashboard`.
