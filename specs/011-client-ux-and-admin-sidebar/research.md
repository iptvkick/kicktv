# Research (RPI-R): Client UX Enhancements & Admin Sidebar

## Contexto e Pedido
O usuário testou as atualizações e apontou 4 melhorias pontuais focadas em UI/UX e Arquitetura:
1. **Swipe Nav no Perfil/Dashboard:** O usuário quer que ao clicar nos botões de menu do Perfil (ou nas abas do Dashboard), a transição entre "Dados Pessoais", "Pagamento" e "Segurança" ocorra arrastando a tela para os lados (Framer Motion Swipe/Slide).
2. **Painel de Notificações Animado:** O botão de sino (Bell) no dashboard principal não faz nada. Precisa abrir um painel lateral/modal flutuante animado exibindo as notificações.
3. **Botão de Configurações (Upgrade/Telas Extras):** O ícone da engrenagem no Dashboard precisa abrir uma interface permitindo ao usuário solicitar até 2 "Telas Extras", somando o valor `extra_screen_price` cadastrado no plano original.
4. **Admin Sidebar:** O link para `/admin/configuracoes` simplesmente não existe no menu lateral (`src/routes/admin.tsx`), impedindo que o admin consiga testar o Asaas a menos que digite a URL manualmente.

## Análise de Arquivos
- `src/routes/admin.tsx`: O menu de navegação lateral (`<aside>`) possui apenas "Servidores Xtream", "Planos" e "Onboarding Builder". Adicionar "Configurações (Asaas)" é trivial.
- `src/routes/cliente/dashboard.tsx`: Já possui as "Tabs" (`activeTab`). Podemos envolver o conteúdo em um `<motion.div>` da biblioteca `framer-motion` (que é padrão do ecosistema UX moderno) usando `drag="x"` e `onDragEnd` para capturar os swipes da esquerda para a direita.
- `framer-motion` está disponível no ecossistema e será injetado/usado para as micro-interações de notificação e drag.
