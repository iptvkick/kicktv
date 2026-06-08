# Research: Frontend Real Data & UI/UX 2026

## Contexto e Desafios (RPI-R)
1. **Desktop Layout Quebrado**: O usuário reportou que a visualização no PC está quebrada. As imagens mostram caixas pretas gigantescas ocupando a tela inteira com muito espaço vazio, e uma `BottomNavBar` flutuando de forma desengonçada na parte inferior sem delimitação de contêiner.
2. **Navegação Simples**: A `BottomNavBar` atual é estática e "dura". O usuário forneceu um código em Framer Motion muito mais fluido e dinâmico, que precisa ser adaptado para exibir botões diferentes dependendo se o usuário logado é `admin` ou `client`.
3. **Mocks**: O sistema ainda está rodando com dados estáticos. Precisamos conectar com o Supabase usando o schema recém-criado.
4. **Telas Incompletas**: As telas de "Player", "Suporte" e "Perfil" do cliente ainda são apenas *placeholders*.
5. **Acesso Admin**: Necessário criar um usuário Admin via script no banco real para testes.

## Benchmarking & Soluções (Tendência 2026)
- **Desktop vs Mobile Navigation**: Em telas de celular, uma `BottomNavBar` de vidro (Liquid Glass) flutuando (`fixed bottom-4`) com as animações elásticas do Framer Motion propostas pelo usuário fica perfeita. Em Desktop (PC), uma navegação na parte inferior em telas *ultrawide* fica estranha. O ideal é usar `max-w-md mx-auto` para emular um app mobile no centro da tela, OU converter a `BottomNavBar` em uma `SideBar` no Desktop. A abordagem de centralizar o conteúdo num contêiner mobile-first (`max-w-md` ou `max-w-xl`) cercado por um background escuro estilizado costuma ser mais rápida e elegante para SaaS focados em mobile.
- **Microinterações**: O código fornecido pelo usuário tem *spring physics* (stiffness: 300, damping: 26). Isso traz o "Maximalismo Tátil".
- **Real Data**: O `supabase-js` será usado nos componentes React via `useEffect` ou Server Components (TanStack Start) para puxar `profiles`, `subscriptions` e `servers`.
