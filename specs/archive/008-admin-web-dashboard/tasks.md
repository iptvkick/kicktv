# Tasks: Admin Web Dashboard & SDD Compliance

## Fase 1: Limpeza Visual (SDD Compliance Total)
- [ ] Editar `globals.css` para garantir variáveis de luz padrão (`#f5f6f7` e `#212529`), removendo forçosamente cores neon.
- [ ] Revisar as telas `/auth/login`, `/cliente/*` e a Landing Page (`/`) para garantir que tudo usa o formato Minimalista Elegante (sem fundos verdes e bordas cyberpunk).

## Fase 2: Admin Web Full-Width
- [ ] Criar `kicktv-saas/src/components/ui/AdminSidebar.tsx` (Menu lateral claro para Admin).
- [ ] Refatorar `kicktv-saas/src/app/admin/layout.tsx` para remover o `max-w-md` centralizado. Deve ser uma estrutura `w-full h-screen flex` com a Sidebar à esquerda e o conteúdo principal fluido à direita.

## Fase 3: Performance (Skeletons) e Transições
- [ ] Corrigir `kicktv-saas/src/app/cliente/dashboard/page.tsx` para não causar tela branca. Implementar um componente de "Loading" local ou usar `Suspense`/Skeletons antes dos dados do Supabase chegarem.
- [ ] Implementar as transições suaves de rotas com `framer-motion` (Page Transition wrapper).
