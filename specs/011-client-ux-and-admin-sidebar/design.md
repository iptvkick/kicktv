# Design: Client UX Enhancements & Admin Sidebar

## UI/UX (Frontend)

**1. Framer Motion Swipe Tabs (Dashboard)**
- Iremos instalar (se necessário) e usar `framer-motion` no `dashboard.tsx`.
- O container principal das views (Pessoal, Pagamento, Segurança) será encapsulado em um `<AnimatePresence mode="wait">` e o conteúdo num `<motion.div>`.
- O gesto será capturado por `drag="x"`. Dependendo do offset do drag (`dragEnd`), a aba `activeTab` é comutada para a direita ou esquerda de acordo com o index da aba.

**2. Painel Lateral de Notificações (Dashboard)**
- Ao clicar em `<Bell>`, abriremos um state `isNotificationsOpen`.
- Um overlay translúcido (`backdrop-blur-sm`) e um painel off-canvas que desliza da direita para a esquerda.
- Conterá placeholders elegantes de notificações como "Bem-vindo ao KickTV!".

**3. Upgrade de Telas Extras (Settings/Gear Button)**
- O ícone `Settings2` (Engrenagem) no Dashboard abrirá o state `isSettingsOpen`.
- O modal terá a seguinte lógica visual: "Você tem atualmente 1 tela. Deseja adicionar mais conexões simultâneas?".
- Um contador simples `[ - ] 1 [ + ]` (até o máximo de 3 telas totais, ou seja, +2 extras).
- Ao confirmar, o valor de `extra_screen_price` será calculado. A integração no frontend enviará esse upgrade e gerará um aviso de "Função em beta" para evitar bugs no Asaas imediatamente.

**4. Admin Sidebar (`admin.tsx`)**
- Simples inserção de `<Link to="/admin/configuracoes">` com o ícone `<Settings>`.
