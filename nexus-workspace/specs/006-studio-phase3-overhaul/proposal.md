# Proposal — 006: Nexus Studio Deep Overhaul (Phase 3)

## Resumo

Corrigir os 5 bugs críticos que impedem o uso real do sistema, implementar 4 novas features estruturais (Chat UX, Fluxograma de Agentes, Vault Obsidian-like, Tela de Custos), e garantir que o motor Gemini CLI responda de verdade. O objetivo final é que o sistema seja **usável de ponta a ponta** — do onboarding ao chat funcional com IA.

---

## Requisitos

### R1 — Motor Funcional (Critical)
O roteamento de mensagens para o Gemini CLI deve funcionar. Cada agente deve receber seu system prompt e responder de verdade. Se o WSL não estiver disponível, usar fallback nativo Windows. Logging de cada execução com stdout/stderr real.

### R2 — Chat UX Tipo OpenClaw
- Lista de sessões anteriores na lateral do chat.
- Botão "Novo Chat" que cria sessão limpa.
- Exibir resposta real do motor com Markdown renderizado.
- Não criar sessão fantasma ao delegar missão.

### R3 — Agentes como Fluxograma Drag-and-Drop
- Canvas interativo com React Flow.
- Nós customizados representando agentes (avatar, nome, role, status).
- Edges animadas conectando manager → workers.
- Suporte a hierarquia multi-nível.
- Toolbar para criar agente direto no canvas.
- Persistir posições no backend.

### R4 — Vault como Obsidian
- Árvore de pastas na sidebar esquerda (expand/collapse, ícones por tipo).
- Preview de Markdown renderizado no painel central.
- Tab de MindGraph com `react-force-graph-2d`.
- Zoom, drag, clique em nó para abrir arquivo.

### R5 — Missões com Status Real
- Campo `status` no model `ChatSession` (pending → running → done → error).
- Atualizar status conforme execução do motor.
- Log real da execução visível no card da missão.

### R6 — Dashboard Útil
- Context Feed sem duplicatas, com auto-scroll e badge de novas entradas.
- Card de memória substituído por mini file-tree com contagem.
- Métricas KPI: total agentes, missões ativas, uptime, últimas interações.

### R7 — Tela de Custos
- Nova rota `/costs`.
- Model `UsageLog` para registrar cada chamada de motor.
- Filtros por data e agente.
- Cards: gasto hoje, esta semana, previsão mensal.
- Gráfico de barras (últimos 7 dias por agente).

---

## User Stories

### US-01: Como operador, quero enviar uma mensagem no chat e receber a resposta real do Gemini CLI, para saber que meus agentes estão funcionando.
- **Critério:** A resposta exibida no chat é o output real do `gemini-cli`, não um echo da mensagem.

### US-02: Como operador, quero ver meus chats anteriores na lateral e poder iniciar um novo chat limpo, para não perder contexto.
- **Critério:** Lista de sessões na lateral; botão "Novo Chat" cria session vazia; sessões anteriores carregam mensagens ao clicar.

### US-03: Como operador, quero organizar meus agentes visualmente como um fluxograma, conectando managers a workers por drag-and-drop.
- **Critério:** Canvas React Flow com nós arrastáveis; edges ao conectar; persistência de posições; criação de agente inline.

### US-04: Como operador, quero navegar meus arquivos do vault como no Obsidian, com preview de Markdown e um mind graph interativo.
- **Critério:** Árvore na lateral; preview renderizado; graph com zoom e clique para abrir.

### US-05: Como operador, quero que missões reflitam o status real (pendente → executando → concluída → erro) em vez de todas aparecerem como "concluído".
- **Critério:** Kanban mostra cards nas colunas corretas; log real visível.

### US-06: Como operador, quero ver quanto estou gastando por agente e por dia, com previsão mensal.
- **Critério:** Tela /costs com filtros; gráfico de barras; cards de resumo.

---

## BDD Scenarios

### Cenário: Motor Gemini CLI responde de verdade
- **Given:** Um agente "TestBot" existe com system prompt "Você é um assistente de testes".
- **When:** O operador envia "Qual a data de hoje?" no chat do TestBot.
- **Then:** A resposta exibida contém texto gerado pela IA (não "Processado via gemini-cli: Qual a data de hoje?").

### Cenário: Novo Chat limpa o histórico visual
- **Given:** O operador está no chat do agente "TestBot" com 5 mensagens.
- **When:** O operador clica em "Novo Chat".
- **Then:** O thread de mensagens é limpo; uma nova sessão é criada; a sessão anterior aparece na lista lateral.

### Cenário: Arrastar agente no fluxograma
- **Given:** Existem 3 agentes (1 manager, 2 workers) no canvas.
- **When:** O operador arrasta um worker para uma nova posição.
- **Then:** A posição é salva; ao recarregar a página, o agente permanece na posição definida.

### Cenário: Conectar agentes via edge
- **Given:** Um manager e um worker estão no canvas sem conexão.
- **When:** O operador arrasta do handle de saída do manager para o handle de entrada do worker.
- **Then:** Uma edge animada é criada; o worker é vinculado ao manager no backend.

### Cenário: Preview de Markdown no Vault
- **Given:** O vault contém o arquivo `notas/reuniao-05.md`.
- **When:** O operador clica no arquivo na árvore da sidebar.
- **Then:** O conteúdo Markdown é renderizado no painel central com headings, listas e code blocks formatados.

### Cenário: Missão reflete status real
- **Given:** O operador cria uma nova missão "Gerar relatório".
- **When:** O motor inicia a execução.
- **Then:** O card aparece na coluna "Em Execução" com status "running"; após conclusão, move para "Concluída" com log visível.

### Cenário: Tela de custos exibe dados por agente
- **Given:** O agente "TestBot" executou 10 chamadas hoje.
- **When:** O operador navega para /costs e filtra por "TestBot".
- **Then:** O card "Gasto Hoje" mostra o total de tokens/chamadas; o gráfico mostra barras por dia.

---

## Fases de Implementação

### Fase A — Motor Funcional + Bug Fixes (Critical Path)
1. Fix `executeCommand`: detectar se gemini-cli existe no PATH nativo Windows (sem WSL); fallback para `npx gemini` ou error amigável.
2. Adicionar campo `status` no model ChatSession (migration Prisma).
3. Atualizar endpoints para setar status corretamente (pending → running → done/error).
4. Fix dedup no Context Feed (frontend).
5. Fix missão não polluting chat (separar endpoints de missão vs. chat).
6. Adicionar model `UsageLog` no Prisma.

### Fase B — Chat UX Overhaul
1. Redesign da página Chat com sidebar de sessões.
2. Botão "Novo Chat" + lógica de criação de sessão.
3. Renderização de Markdown nas respostas do agente.
4. Polling otimizado com SSE ou long-polling.

### Fase C — Fluxograma de Agentes (React Flow)
1. Instalar `@xyflow/react`.
2. Criar componente `AgentFlowCanvas` com nós customizados.
3. Adicionar campos `positionX`, `positionY`, `parentId` no model Agent.
4. Endpoints para salvar posições e hierarquia.
5. Substituir a página Agents pelo canvas.
6. Toolbar inline para criar/editar agente.

### Fase D — Vault Obsidian-like
1. Componente `FileTree` recursivo com expand/collapse.
2. Componente `MarkdownPreview` com `react-markdown` + `remark-gfm`.
3. Componente `MindGraph` com `react-force-graph-2d`.
4. Tabs no painel principal: "Preview" / "Graph".
5. Integrar com endpoints existentes `/api/vault/tree` e `/api/vault/file`.

### Fase E — Dashboard Remake + Custos
1. Refazer Dashboard com KPIs reais e feed deduplicado.
2. Criar página `/costs` com filtros.
3. Endpoints para `UsageLog` (create, query by date/agent).
4. Gráfico de barras com dados reais (lib: `recharts`).
5. Cards de resumo: hoje, semana, previsão.

---

## Dependências a Instalar

| Package | Versão | Uso |
|---------|--------|-----|
| `@xyflow/react` | latest | Canvas drag-and-drop para agentes |
| `react-markdown` | latest | Renderização de Markdown |
| `remark-gfm` | latest | GitHub Flavored Markdown |
| `react-force-graph-2d` | latest | MindGraph do vault |
| `recharts` | latest | Gráficos de custos |

---

## Arquivos Modificados/Criados

### Backend
- `[MODIFY]` `prisma/schema.prisma` — campos `status`, `positionX`, `positionY`, `parentId`, model `UsageLog`
- `[MODIFY]` `src/index.ts` — fix motor, endpoints de usage, fix dedup, fix mission vs. chat
- `[MODIFY]` `src/engine.ts` — detecção nativa de gemini-cli, fallback, timeout

### Frontend
- `[MODIFY]` `src/pages/Chat.tsx` — sidebar de sessões, novo chat, markdown render
- `[MODIFY]` `src/pages/Agents.tsx` — substituir grid por React Flow canvas
- `[MODIFY]` `src/pages/Vault.tsx` — FileTree, MarkdownPreview, MindGraph
- `[MODIFY]` `src/pages/Dashboard.tsx` — KPIs, feed dedup, mini file-tree
- `[MODIFY]` `src/pages/Missions.tsx` — status real, logs reais
- `[NEW]` `src/pages/Costs.tsx` — tela de custos
- `[NEW]` `src/components/agents/AgentNode.tsx` — nó customizado React Flow
- `[NEW]` `src/components/agents/AgentFlowCanvas.tsx` — canvas principal
- `[NEW]` `src/components/vault/FileTree.tsx` — árvore de arquivos
- `[NEW]` `src/components/vault/MarkdownPreview.tsx` — preview MD
- `[NEW]` `src/components/vault/MindGraph.tsx` — graph interativo
- `[NEW]` `src/components/costs/CostChart.tsx` — gráfico de barras
- `[MODIFY]` `src/App.tsx` — rota /costs

---

## Critérios de Aceite Globais

1. ✅ Chat retorna resposta real do Gemini CLI (não echo).
2. ✅ Novo Chat limpa thread; sessões anteriores na lateral.
3. ✅ Agentes exibidos como fluxograma drag-and-drop com edges.
4. ✅ Vault tem árvore de pastas, preview MD, e mind graph.
5. ✅ Missões refletem status real (pending/running/done/error).
6. ✅ Tela de custos com filtros e gráfico funcional.
7. ✅ TypeScript compila sem erros; build Vite passa.
8. ✅ Nenhum bug de input focus, redirect loop, ou tela travada.
