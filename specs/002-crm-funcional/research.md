# Research: CRM Funcional & Correções Estruturais

## Contexto Atual
O projeto `gerentesmec` possui uma estrutura visual baseada em Vite + React + Tailwind + Shadcn. No entanto, o sistema atual se encontra num estado de "Mockup/Vibe puro":
- **Dados Mockados**: Dashboards, tabelas e kanbans utilizam variáveis estáticas ou o `AppDataContext` sem persistência no backend.
- **Header Duplicado**: O `DashboardLayout.tsx` possui um `<header>` fixo com a saudação "Olá, Daniel 👋" e a página `Index.tsx` renderiza outro bloco de cabeçalho com "Olá, Administrador 👋", criando duplicação visual e confusão na hierarquia de informações.
- **Inconsistência de Cores**: O usuário relatou 3 cores diferentes de fundo nas divisões do dashboard. Atualmente, o layout mistura classes como `bg-background`, `bg-sidebar` (com bordas) e na página `Index.tsx` usa `bg-[#13111A]`, `bg-[#1E1B29]`, gerando uma colisão de temas entre a configuração nativa do Tailwind/Shadcn e as cores injetadas manualmente na tela principal.
- **Autenticação Inexistente**: Não há roteamento protegido. Qualquer usuário acessa o painel inteiro.
- **Mapeamento de Unidades**: As unidades do CRM precisam representar ativamente **Canais do Chatwoot**. 

## Requisitos Levantados
1. **Remover Mocks**: Implementar a integração real via Supabase.
2. **Sistema de Autenticação**: Proteger rotas e criar tela de login. O usuário de teste inicial deve ser `mktfunil1@gmail.com` com senha `Mktfunil8563*`.
3. **Consolidar UI**: Remover o header duplo e unificar a paleta de cores de fundo seguindo o padrão Dark Liquid Glass de 2026.
4. **Deploy e Funcionalidade**: Entregar o sistema pronto para uso e sem falhas de roteamento.

## Concorrentes e Benchmark (Para adequação visual de CRM de Mecânicas)
- **Siscar / Oficina Inteligente**: Sistemas robustos porém com visual muito datado (anos 2010). Nós vamos superá-los com uma UI Dark Premium.
- **Pipedrive**: Kanban super fluido, drag-and-drop sem lag. Usaremos essa referência para garantir que nosso kanban no CRM tenha as mesmas micro-interações.

**Decisão**: O foco da refatoração inicial será amarrar o fluxo de Auth e Banco de Dados antes de avançarmos em lógicas mais profundas.
