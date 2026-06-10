# Tasks: Client UX Enhancements & Admin Sidebar

> ⛔ **REGRA DE OURO:** O Tech Lead não escreve código. Delegue as tarefas abaixo para o **Frontend Engineer**.

## Fase 1: Admin Sidebar (Frontend Engineer)
- `[ ]` Em `src/routes/admin.tsx`, adicionar o componente `<Link to="/admin/configuracoes">` com o ícone `<Settings>` logo abaixo do link de "Onboarding Builder".

## Fase 2: Drag/Swipe Views no Cliente (Frontend Engineer)
- `[ ]` Instalar `framer-motion` (verificar se já não está listado em package.json, e se não, usar o comando seguro).
- `[ ]` Em `src/routes/cliente/dashboard.tsx`, envolver o bloco condicional de conteúdo das abas (Pessoal, Pagamento, Segurança) num `<AnimatePresence mode="wait">` e `<motion.div>`.
- `[ ]` Adicionar `drag="x"`, `dragConstraints` e `onDragEnd` à `motion.div`. Ao arrastar para a esquerda (offset negativo) ir para a próxima aba na ordem, ao arrastar para a direita (offset positivo) ir para a aba anterior.

## Fase 3: Componentes Animados do Dashboard (Frontend Engineer)
- `[ ]` Criar Modal/Slide Over de Notificações ativado pelo clique no ícone `<Bell>`. Deve deslizar suavemente.
- `[ ]` Criar Modal de "Configurações do Plano / Upgrade" ativado pelo ícone `<Settings2>`. O modal mostrará a quantidade de telas ativas e um botão para "Pedir mais acessos" (+1 ou +2), utilizando o preço estipulado do plano `extra_screen_price` (com mensagem de beta ou alerta `console.log` para não enviar pagamentos Asaas reais ainda).

## Fase 4: QA (Deploy Engineer)
- `[ ]` Executar `npm run build` para checar sintaxe e tipos do framer motion.
