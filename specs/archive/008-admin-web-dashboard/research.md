# Research: Re-Adequação do SDD e Admin Web Dashboard

## Erros Cometidos (Post-Mortem)
1. **Design Violado:** O Agente tentou introduzir um tema "Liquid Glass / Neon Green" (Skill `ux-ui-architect-2026`) que violou abertamente a Seção 1.2 do documento `001-kicktv-saas/sdd-design.md`, que exigia um "Minimalismo Claro" (`#f5f6f7` e `#212529`). O neon não era desejado.
2. **Landing Page Quebrada:** Ao tentar reverter o tema para Light Mode na Fase 5, a Landing Page perdeu estilo e ficou esteticamente comprometida, o que gerou a reclamação "tava bonito antes". Precisamos de uma Landing Page que respeite o SDD (Light/Dark elegante) sem recorrer ao "neon cyberpunk".
3. **Admin Layout Falso:** O layout de Admin atual no Next.js herda o mesmo formato `max-w-md` (Mobile-First restrito a uma coluna vertical) da área do cliente. O Admin precisa ser "100% Web" (Widescreen responsivo).
4. **Performance ("Demora 1000 anos"):** A tela de Dashboard do Cliente faz chamadas pesadas via Supabase no `useEffect`, sem tratamento visual (Skeleton) e sem cache de Server Side, travando a tela em branco.
5. **Falta de Transições:** As trocas de rotas no Next.js são abruptas ("sai do nada"), necessitando do `framer-motion` para page transitions elegantes (`AnimatePresence`).

## Soluções Técnicas
1. **Restaurar SDD:** Forçar imediatamente as cores `#f5f6f7`, `#ffffff` e `#212529`. Remover todos os traços de `#00FF66` (verde neon).
2. **Refatorar Admin:** Criar um layout `admin/layout.tsx` que utiliza `w-full min-h-screen flex`, com uma barra lateral de navegação (Sidebar) para telas grandes, e um menu offcanvas/hamburger para mobile.
3. **Animações Elegantes:** Configurar um `Template.tsx` com framer-motion para realizar cross-fade suave nas rotas.
