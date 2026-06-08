# Tasks — 006: Nexus Studio Deep Overhaul (Phase 3)

## Fase A — Motor Funcional + Bug Fixes (Critical Path)

- [ ] A1. Fix `engine.ts`: detectar gemini-cli no PATH nativo Windows (sem depender de WSL). Testar com `where gemini` / `which gemini-cli`. Se não existe, tentar `npx @anthropic-ai/claude-code` ou retornar erro amigável.
- [ ] A2. Migration Prisma: adicionar `status String @default("pending")` no ChatSession.
- [ ] A3. Migration Prisma: adicionar `positionX Float? @default(0)`, `positionY Float? @default(0)`, `parentId String?` no Agent (self-relation).
- [ ] A4. Migration Prisma: criar model `UsageLog` com campos (agentId, engine, tokensIn, tokensOut, costUsd, durationMs).
- [ ] A5. Rodar `npx prisma migrate dev` e regenerar client.
- [ ] A6. Refatorar `POST /api/agents/:id/chat` para atualizar `status` (pending → running → done/error).
- [ ] A7. Refatorar `GET /api/missions` para usar `session.status` real em vez de hardcoded `'done'`.
- [ ] A8. Separar lógica de missão (`POST /api/agents/chat`) para NÃO criar ChatSession duplicada — reusar endpoint `/api/agents/:id/chat`.
- [ ] A9. Registrar `UsageLog` a cada execução de motor (tokens estimados + duração).
- [ ] A10. Fix Context Feed no frontend: dedup por timestamp, limitar buffer, badge de novos.
- [ ] A11. Testar chat com agente — validar que resposta real do Gemini CLI aparece.

## Fase B — Chat UX Overhaul

- [ ] B1. Criar componente `ChatSessionList.tsx` — sidebar de sessões com agrupamento por data.
- [ ] B2. Redesign `Chat.tsx` — layout com sidebar (250px) + thread + input.
- [ ] B3. Implementar botão "Novo Chat" — cria session, limpa thread, foca no input.
- [ ] B4. Integrar `react-markdown` + `remark-gfm` no `ChatThread.tsx` para renderizar respostas.
- [ ] B5. Polling otimizado: parar polling quando tab está inativa (Page Visibility API).
- [ ] B6. Testar fluxo completo: criar chat → enviar msg → receber resposta MD → novo chat → voltar ao anterior.

## Fase C — Fluxograma de Agentes (React Flow)

- [ ] C1. Instalar `@xyflow/react`.
- [ ] C2. Criar `AgentNode.tsx` — nó customizado com avatar, nome, role, status, botões de ação.
- [ ] C3. Criar `AgentFlowCanvas.tsx` — canvas principal com nós, edges, minimap, controls.
- [ ] C4. Criar endpoints: `PUT /api/agents/:id/position`, `PUT /api/agents/:id/connect`.
- [ ] C5. Carregar agentes como nós com posições do banco; edges baseados em `parentId`.
- [ ] C6. Implementar drag para reposicionar (salvar ao soltar).
- [ ] C7. Implementar criação de edge ao arrastar handle (salvar `parentId`).
- [ ] C8. Botão "+ Criar Agente" no canvas — abre modal e posiciona novo nó.
- [ ] C9. Double-click no nó para editar inline (nome, role, prompt).
- [ ] C10. Substituir a página Agents.tsx pelo canvas.
- [ ] C11. Testar: criar 5 agentes, conectar hierarquia, recarregar página, validar persistência.

## Fase D — Vault Obsidian-like

- [ ] D1. Criar `FileTree.tsx` — componente recursivo com expand/collapse, ícones por tipo, highlight.
- [ ] D2. Criar `MarkdownPreview.tsx` — `react-markdown` com custom renderers para headings, code, tables.
- [ ] D3. Criar `MindGraph.tsx` — `react-force-graph-2d` com nós do vault tree.
- [ ] D4. Redesign `Vault.tsx` — sidebar FileTree + painel com tabs [Preview | Graph].
- [ ] D5. Integrar com `/api/vault/file` para carregar conteúdo ao clicar.
- [ ] D6. MindGraph: pastas = nós grandes amber, arquivos = nós pequenos cyan, clique abre preview.
- [ ] D7. Testar com vault real: navegar árvore, abrir MD, alternar para graph, zoom/pan.

## Fase E — Dashboard + Custos

- [ ] E1. Refazer Dashboard: cards KPI (total agentes, missões ativas, uptime motor, último chat).
- [ ] E2. Context Feed: dedup, auto-scroll, contagem de novas entradas.
- [ ] E3. Criar `Costs.tsx` — página com 3 cards KPI + gráfico de barras + tabela de logs.
- [ ] E4. Criar endpoints: `GET /api/usage/summary` (por período), `GET /api/usage/logs` (paginado).
- [ ] E5. Instalar `recharts`; criar `CostBarChart.tsx` com dados reais.
- [ ] E6. Filtros funcionais: seletor de agente + range de data.
- [ ] E7. Adicionar rota `/costs` no App.tsx e link na Sidebar.
- [ ] E8. Testar: enviar 5 msgs, navegar para /costs, validar que dados aparecem.

## Verificação Final

- [ ] V1. `npx tsc --noEmit` — zero erros em backend e frontend.
- [ ] V2. `npx vite build` — build de produção sem erros.
- [ ] V3. Teste E2E completo: onboarding → criar agente → chat funcional → missão com status → vault preview → custos.
- [ ] V4. Screenshot e vídeo de prova de cada tela.
