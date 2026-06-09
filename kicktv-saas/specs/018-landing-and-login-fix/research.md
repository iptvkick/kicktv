# Research Document (018-landing-and-login-fix)

## 1. Problema de UX/UI (Landing Page e Login)
O usuário relatou uma forte inconsistência visual entre a Landing Page/Login e o painel de Administração.
- **Estado Atual da LP:** Possui um design "Dark Liquid Glass" com glows azuis (fundo escuro `bg-background` forçado no `globals.css` como `#0a0a0a` ou híbrido de azul marinho).
- **Estado Atual do Admin:** Possui um design "Branco Minimalista" com fundos claros (`bg-slate-50`, cards brancos).
- **Feedback:** O usuário considerou o tema dark/blue "feio e escroto" e exigiu o retorno do padrão "Branco Minimalista e Maximalista" (tipografia grande, layouts limpos e claros) que já estava presente na concepção inicial (SDD) para todas as telas externas.

## 2. Problema Funcional (Erro no Login)
O login falha para clientes com o console error: `Erro ao buscar profile: {}`
- **Causa Raiz:** No arquivo `src/app/auth/login/page.tsx`, a função `handleLogin` faz uma query com `.single()` na tabela `profiles`. Se o usuário recém-criado ou importado no Supabase Auth não tiver um registro correspondente na tabela `profiles` pública (ex: ausência de trigger automatizada), o Supabase retorna um erro `PGRST116` (linha não encontrada), estourando o erro na tela.
- **Solução Proposta:** Fazer o tratamento do erro `profileError`. Se o erro ocorrer ou nenhum profile for retornado, deve-se aplicar o Fallback redirecionando o usuário para `/cliente/dashboard` assumindo a role "cliente" por padrão, sem travar o acesso.
