# Design: Liquid UI & Supabase Integration

## 1. UX/UI 2026: O Novo Layout
Para resolver o problema do PC "esticado e quebrado", utilizaremos a técnica de **Responsive Centered App**:
- O `<body>` ou o root da rota terá um background escuro (`bg-black` ou `bg-zinc-950`).
- O contêiner principal do App terá um `max-w-3xl mx-auto min-h-screen bg-zinc-950/50 backdrop-blur-xl border-x border-white/5`.
- Isso faz com que no celular ocupe 100%, mas no Desktop crie uma coluna centralizada elegante (estilo web app mobile-first, como o X/Twitter antigo ou apps bancários na web), impedindo que caixas de texto fiquem com 2000px de largura.
- A `BottomNavBar` terá a classe `fixed bottom-4 left-1/2 -translate-x-1/2` para ficar sempre centralizada, independente do tamanho da tela.

## 2. A Barra de Navegação Animada
A base visual fornecida pelo usuário utiliza *Framer Motion*. O esquema de cores se manterá no **Dark + Verde Neon** (`text-primary`, `bg-primary/10`).
- **Rotas Client:**
  - Home (Dashboard)
  - Tv (Player)
  - Headset (Suporte)
  - User (Perfil)
- **Rotas Admin:**
  - LayoutDashboard (Estatísticas)
  - ListTree (Planos)
  - Server (Servidores)
  - Smartphone (Dispositivos)

## 3. Estratégia de Dados (Supabase)
Como geramos as tipagens manualmente (`types.ts`), utilizaremos o `@supabase/supabase-js` diretamente nos componentes com `useEffect` (já que o usuário está utilizando páginas CSR ou SSR híbrido, mas `useEffect` é mais rápido para interações de dashboard se a auth via cookies não estiver totalmente injetada).
- Para evitar bugs com RLS, usaremos as funções normais: `supabase.from('subscriptions').select('*, plans(*), servers(*)')`.
