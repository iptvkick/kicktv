# Tasks (018-landing-and-login-fix)

## 1. Tratamento de Erro do Login (Backend/Frontend)
- [ ] No arquivo `src/app/auth/login/page.tsx`, interceptar o `profileError` e forçar o redirecionamento para `/cliente/dashboard` em vez de setar o state de Error.

## 2. Limpeza Visual (Frontend)
- [ ] No arquivo `src/app/globals.css`, remover as sobreposições extremas de dark mode nas variáveis ou focar as cores na versão clara.
- [ ] No arquivo `src/app/page.tsx`, remover a classe `grain` e backgrounds abstratos (`bg-primary/20 blur-[120px]`). Ajustar os textos para `text-gray-900` e fundos para `bg-slate-50`.
- [ ] No arquivo `src/app/auth/login/page.tsx`, remover o fundo estrelado abstrato de glow azul. Tornar o card central um elemento limpo, branco, sob um fundo cinza leve (`bg-slate-50`).
