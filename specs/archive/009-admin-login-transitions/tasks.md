# Tasks: UX Dinâmica & Admin Access

## Fase 1: Promover o Usuário a Administrador
- [ ] Fornecer ao usuário o script SQL exato (ou instruí-lo) para atualizar sua conta recém-criada de `client` para `admin` no painel do Supabase, resolvendo o bug do login.

## Fase 2: Implementação de Transições Direcionais
- [ ] Criar um gerenciador de contexto (`NavigationContext.tsx` ou hook customizado) para rastrear a ordem das rotas baseada no menu.
- [ ] Refatorar o `PageTransition.tsx` para utilizar variantes do Framer Motion com `custom={direction}` baseadas em matemática de índices. `x: 100%` vs `x: -100%`.

## Fase 3: Polimento Responsivo Admin
- [ ] Revisar `admin/layout.tsx` e `admin/dashboard/page.tsx` para garantir que `overflow-x-hidden` proteja a tela durante as transições de deslize.
- [ ] Confirmar que o layout reage corretamente ao esconder o sidebar e exibir o bottom navbar em telas menores (`< 768px`).
