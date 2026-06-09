# Research: Login Admin, Transições Direcionais e Responsividade

## Problemas Identificados

1. **Falha no Redirecionamento de Admin:**
   - **Sintoma:** O usuário faz login e é direcionado para a área de Cliente, mesmo acreditando ser Admin.
   - **Causa:** O trigger `handle_new_user()` no banco de dados (`20260608200000_create_core_schema.sql`) define automaticamente a `role` como `'client'` para TODOS os novos usuários. O sistema de login (`auth/login/page.tsx`) verifica a role; como é `client`, ele redireciona para `/cliente/dashboard`.
   - **Solução:** É necessário promover manualmente o usuário para `'admin'` no banco de dados, pois não há uma tela de "criar admin" (por motivos de segurança). Forneceremos o script SQL exato para o usuário rodar no Supabase, ou faremos via código.

2. **Transições de Tela Inadequadas:**
   - **Sintoma:** A transição atual surge de baixo para cima. O usuário deseja animações direcionais horizontais (deslizar para a esquerda ou direita dependendo de onde o botão clicado está no menu).
   - **Causa:** O componente `PageTransition.tsx` atual possui apenas uma animação estática de translação no eixo Y (`y: 10` para `y: 0`).
   - **Solução:** Refatorar `PageTransition.tsx` e o sistema de roteamento para armazenar o "índice" da rota atual e da rota de destino. Usar o Framer Motion para calcular a direção (`x: 100%` vs `x: -100%`) para criar um efeito de *swipe* nativo de iOS/Android.

3. **Responsividade do Dashboard Admin:**
   - **Sintoma:** O usuário reitera que o painel admin precisa ser diferente no PC (com menu lateral).
   - **Causa/Status:** A estrutura (`AdminSidebar` escondida no mobile e `BottomNavBar` escondida no desktop) já foi criada na Fase 6, mas pode necessitar de ajustes no layout do conteúdo do `dashboard/page.tsx` para se adaptar melhor aos dois cenários.
