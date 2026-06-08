# Design Architecture — KickTV SaaS

## 1. Vibe & Estética (UX/UI 2026)
De acordo com a diretriz `ux-ui-architect-2026`, adotaremos o estilo **Dark Technical** misturado com toques de **Neon Dopamine** para garantir uma estética premium e de alta conversão.

### 1.1 Paleta de Cores
- **Background Principal:** `zinc-950` (#09090b) e `black` (#000000).
- **Superfícies (Cards/Modais):** `zinc-900` com transparência (`bg-zinc-900/50 backdrop-blur-xl`).
- **Acentos / Primary (Call to Action):** Neon Dopamine — `Electric Blue` (#3b82f6 para branding) ou `Lime/Green` (#22c55e) para botões de pagamento e sucesso.
- **Tipografia:** Branco puro e `zinc-400` para subtítulos.

### 1.2 Tipografia
- **Headlines / Títulos:** `Outfit` ou `Space Grotesk` (Impacto, geométrico, moderno).
- **Body / Dados:** `Inter` (Legibilidade impecável, ideal para credenciais de acesso).

### 1.3 Elementos Visuais (O Fim do Blanding)
- **Apple Liquid Glass:** Modais de onboarding e painel de cliente utilizarão `backdrop-blur` intensos e bordas com `border-white/10`.
- **Microinterações:** Botões de "Renovar" ou "Copiar Senha" terão animações de escala e brilho dinâmico no hover.
- **Acessibilidade:** Textos grandes, contrastes maiores que 4.5:1, e alvos de toque grandes no mobile.

## 2. Divisão de Interfaces (Stitch MCP)

### 2.1 Área Pública (Landing Page)
- **Hero Section:** Headline colossal ("O Fim dos Travamentos"), prova social explícita.
- **Onboarding Wizard:** Cards interativos em grid (Roku, Samsung, Firestick) grandes e táteis. O fluxo deve ter transições `fade-in-up` suaves.

### 2.2 Portal do Cliente
- **Dashboard:** Visão limpa. Um "Card de Credenciais" em destaque com botões "Copiar" (com feedback visual). Um cronômetro mostrando dias restantes.
- **Web Player:** Container escuro com `video.js` embutido.

### 2.3 Painel Admin
- **Métricas:** Cards minimalistas com gradientes sutis indicando MRR e conversão.
- **Tabelas:** Tabelas de dados limpas com paginação, sem poluição visual.

## 3. Modelagem de Dados (Supabase MCP)
Tabelas a serem implementadas no banco:
1. `profiles`: Dados do usuário.
2. `iptv_subscriptions`: Gestão das credenciais do Xtream, validade.
3. `payments`: Histórico de faturas e webhooks.
4. `support_tickets`: Gestão de self-healing e contato.

A segurança é garantida via RLS, atrelando todas as consultas de leitura e escrita ao `auth.uid()` do usuário autenticado, a menos que ele seja `role = 'admin'`.
