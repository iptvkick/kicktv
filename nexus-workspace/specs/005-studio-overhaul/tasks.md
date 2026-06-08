# Tasks — 005 Studio Overhaul

> Checklist de execução. Marque `[x]` ao completar, `[/]` em progresso.

---

## Fase 1 — Desbloqueio (Bugs P0)

### 1.1 Fix Input Focus (BUG-01)
- [ ] Extrair `AgentForm` para componente top-level em `Agents.tsx`
- [ ] Receber `form` e `onChange` como props
- [ ] Testar digitação fluida no modal de criação
- [ ] Testar digitação fluida no modal de edição
- [ ] Validar que System Prompt (textarea) aceita múltiplas linhas

### 1.2 Criar Settings.tsx (BUG-08)
- [ ] Criar `src/pages/Settings.tsx`
- [ ] Seção "Agência" — campo nome (carrega de `/api/config`)
- [ ] Seção "Motor" — seletor engine + campo API key + status
- [ ] Seção "Vault" — campo path + botão re-indexar + stats
- [ ] Seção "Dados" — botão resetar DB + exportar config
- [ ] Botão "Salvar Alterações" → `POST /api/config/bulk`
- [ ] Registrar rota `/settings` em `App.tsx`
- [ ] Adicionar import em `App.tsx`

### 1.3 Criar Chat.tsx (BUG-03)
- [ ] Criar `src/pages/Chat.tsx`
- [ ] Criar `src/components/chat/ChatThread.tsx`
- [ ] Criar `src/components/chat/ChatInput.tsx`
- [ ] Layout: header com nome do agente + thread + input bar
- [ ] Load histórico: `GET /api/agents/:id/chat`
- [ ] Envio: `POST /api/agents/:id/chat` → retorno async
- [ ] Polling de mensagens novas a cada 2s enquanto status=processing
- [ ] Auto-scroll no container de mensagens
- [ ] Registrar rota `/chat/:agentId` em `App.tsx`
- [ ] Mudar link "Chat" em `Agents.tsx` de `/missions?agent=...` para `/chat/{id}`

### 1.4 Backend: Chat Assíncrono (BUG-07)
- [ ] Refatorar `POST /api/agents/chat` para retorno imediato
- [ ] Criar `POST /api/agents/:id/chat` — cria sessão + manda mensagem
- [ ] Criar `GET /api/agents/:id/chat` — retorna sessões
- [ ] Criar `GET /api/agents/:id/chat/:sessionId/messages` — mensagens
- [ ] Executar engine em background via `child_process.spawn`
- [ ] Salvar output como `Message` no DB com role=assistant
- [ ] Tratar timeout de 60s com status "error"

### 1.5 Fix Vault Link (BUG-06)
- [ ] Em `Vault.tsx`, trocar `<a href="/onboarding">` por `<a href="/settings">`
- [ ] Texto: "Configurar nas definições →"

### 1.6 Guard Onboarding (BUG-13)
- [ ] Em `App.tsx`, rota `/onboarding`: se `onboarded === true`, redirect para `/dashboard`
- [ ] Testar acesso direto a `/onboarding` após onboard completo

### 1.7 Remover C3PO (BUG-12)
- [ ] `Dashboard.tsx` linha 17: mudar fallback de `'C3PO (Manager)'` para `'Principal (Manager)'`
- [ ] `Agents.tsx` linha 86: mudar placeholder de `"Ex: Coder-v1"` para `"Nome do agente"`
- [ ] Grep completo por "C3PO" no codebase e remover
- [ ] Grep completo por "Coder-v1" e substituir por exemplos genéricos

### 1.8 Backend: Bulk Config + Health
- [ ] Criar `POST /api/config/bulk` — recebe `{ configs: [{key, value}] }`
- [ ] Criar `GET /api/health/detailed` — retorna status completo do sistema
- [ ] Testar ambos endpoints via curl

### 1.9 Validação Fase 1
- [ ] Build sem erros: `npm run build` (frontend)
- [ ] Testar criação de agente (input fluido)
- [ ] Testar chat com agente (mensagem vai e resposta volta)
- [ ] Testar Settings (salvar e recarregar config)
- [ ] Testar que `/onboarding` redireciona após configurar
- [ ] Testar que `/settings` abre corretamente da sidebar

---

## Fase 2 — Vault & Monitoring

### 2.1 Backend: Tree + File endpoints
- [ ] Criar `GET /api/vault/tree` — retorna hierarquia recursiva de pastas
- [ ] Criar `GET /api/vault/file?path=...` — retorna conteúdo do arquivo
- [ ] Sanitizar path para evitar directory traversal (security)
- [ ] Testar com vault path configurada e sem

### 2.2 Vault Tree View (BUG-05a)
- [ ] Criar `src/components/vault/FileTree.tsx`
- [ ] Renderização recursiva de diretórios com expand/collapse
- [ ] Ícones: 📁 pasta, 📄 arquivo
- [ ] Click em arquivo: seta `selectedFile`
- [ ] Animação de expand: `framer-motion` `AnimatePresence`
- [ ] Manter estado de expand em `useState<Set<string>>`

### 2.3 Markdown Preview (BUG-05b)
- [ ] Instalar `react-markdown remark-gfm rehype-highlight`
- [ ] Criar `src/components/vault/MarkdownPreview.tsx`
- [ ] Fetch conteúdo via `GET /api/vault/file?path=...`
- [ ] Renderizar com syntax highlighting para code blocks
- [ ] Estilizar headers, links, listas em dark theme
- [ ] Scroll independente da tree

### 2.4 Mind Graph (BUG-05c)
- [ ] Instalar `react-force-graph-2d`
- [ ] Criar `src/components/vault/MindGraph.tsx`
- [ ] Transformar tree data em `{ nodes, links }` para force graph
- [ ] Nós: cor teal para pastas, amber para arquivos
- [ ] Node labels com nome do arquivo (truncado)
- [ ] Hover: tooltip com path completo
- [ ] Click: seta `selectedFile` e muda para tab de preview
- [ ] Zoom: scroll wheel nativo do force graph
- [ ] Controles: botões Zoom +/- e Fit
- [ ] Canvas background: `rgba(0,0,0,0.3)` com border-radius

### 2.5 Vault Page Rewrite
- [ ] Reescrever `Vault.tsx` com sistema de tabs (Arquivos / Mapa Mental)
- [ ] Tab "Arquivos": tree esquerda + preview direita
- [ ] Tab "Mapa Mental": graph full-width
- [ ] RAG search mantido acima de ambas tabs
- [ ] Substituir data source de `/api/vault/files` para `/api/vault/tree`

### 2.6 Heartbeat Real (BUG-02)
- [ ] Criar `src/hooks/useHeartbeat.ts`
- [ ] Poll `GET /api/health/detailed` a cada 5s
- [ ] Retorna `{ status, latencyMs, engine, agentCount }`
- [ ] Usar em `Sidebar.tsx` — substituir `● online` hardcoded
- [ ] Status visual: verde=online, vermelho=offline, amarelo=lento
- [ ] Mostrar latência em ms

### 2.7 Memória Ativa Real (BUG-09)
- [ ] Em `Dashboard.tsx`, substituir array hardcoded por fetch de `/api/vault/files`
- [ ] Limitar a 5 arquivos mais recentes
- [ ] Mostrar nome real + tamanho + data de modificação
- [ ] Fallback: "Nenhum arquivo na vault" se vazio

### 2.8 Validação Fase 2
- [ ] Vault tree mostra hierarquia correta
- [ ] Click em arquivo mostra preview Markdown renderizado
- [ ] Mind Graph renderiza com zoom/pan sem quebrar
- [ ] Heartbeat atualiza na sidebar em tempo real
- [ ] Dashboard mostra arquivos reais da vault
- [ ] Build sem erros

---

## Fase 3 — Agent Workspaces

### 3.1 Backend: Workspace Management
- [ ] Ao criar agente, criar pasta `workspaces/<agentId>/`
- [ ] Adicionar campo `workspacePath` no model Agent (migration)
- [ ] Endpoint `GET /api/agents/:id/workspace` — lista arquivos do workspace
- [ ] Salvar output de chat como `<timestamp>_response.md` no workspace

### 3.2 Heartbeat Configurável (BUG-10)
- [ ] Adicionar campos `heartbeatInterval` e `lastHeartbeat` no Agent model
- [ ] Migration Prisma
- [ ] UI em Settings ou no modal de edição do agente
- [ ] Backend: cron que pinga cada agente no intervalo configurado

### 3.3 Validação Fase 3
- [ ] Pasta criada ao criar agente
- [ ] Output de chat salvo no workspace
- [ ] Heartbeat por agente funcional

---

## Fase 4 — Cron & Dreaming (Futuro)

### 4.1 Backend: Cron System
- [ ] Instalar `node-cron`
- [ ] Criar sistema de jobs configuráveis via Config
- [ ] Job "dreaming": consolida vault a cada 24h
- [ ] Re-indexa RAG automaticamente

### 4.2 UI de Cron
- [ ] Seção "Dreaming Mode" no Settings
- [ ] Campo de horário (ex: "03:00")
- [ ] Toggle on/off
- [ ] Logs do último ciclo

### 4.3 Validação Fase 4
- [ ] Cron executa no horário
- [ ] RAG re-indexado automaticamente
- [ ] Logs visíveis no Settings

---

## Pós-implementação

- [ ] Grep final: zero referências a "C3PO", "Coder-v1", ou nomes hardcoded
- [ ] Build final sem erros
- [ ] Teste E2E completo via browser subagent
- [ ] Reset do DB para estado limpo
- [ ] Screenshot/vídeo de cada tela funcional
- [ ] Commit com mensagem descritiva
