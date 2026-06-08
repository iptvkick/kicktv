# 005 — Nexus Agency Studio: Overhaul Completo

> **Spec-Kit ID:** 005-studio-overhaul
> **Tipo:** Refatoração + Features + Bugfix
> **Prioridade:** P0 — Bloqueante para uso real
> **Última atualização:** 2026-05-06

---

## 1. Contexto

O Nexus Agency Studio completou seu primeiro ciclo de onboarding com sucesso, mas o uso real revelou **13 bugs e lacunas críticas** que tornam o produto inutilizável. Esta proposta cobre a resolução de **todos** os problemas identificados, organizados em 4 fases de implementação progressiva.

### Problemas Críticos Identificados

| # | Bug | Severidade | Fase |
|---|-----|-----------|------|
| 01 | Input perde foco após cada caractere | 🔴 P0 | 1 |
| 02 | Heartbeat/status do engine é fake | 🟡 P1 | 2 |
| 03 | "Chat" redireciona para Missões | 🔴 P0 | 1 |
| 04 | Agentes não criam pastas/output | 🟡 P1 | 3 |
| 05 | Vault sem árvore + preview + mind map | 🔴 P0 | 2 |
| 06 | "Configurar" no Vault leva ao onboarding | 🔴 P0 | 1 |
| 07 | Nova Missão trava infinitamente | 🔴 P0 | 1 |
| 08 | "Configurações" leva ao onboarding | 🔴 P0 | 1 |
| 09 | Memória Ativa no Dashboard é mock | 🟡 P1 | 2 |
| 10 | Sem heartbeat configurável por agente | 🟡 P1 | 3 |
| 11 | Sem cron / modo dreaming | 🟠 P2 | 4 |
| 12 | "C3PO" hardcoded no código | 🟡 P1 | 1 |
| 13 | Onboarding acessível após completar | 🔴 P0 | 1 |

---

## 2. Arquitetura Proposta

### 2.1 Frontend (React + Vite + Tailwind + Framer Motion)

```
src/
├── App.tsx                    # Router com guards
├── pages/
│   ├── Dashboard.tsx          # [MODIFY] Remover mocks, conectar API real
│   ├── Agents.tsx             # [MODIFY] Fix input, extrair AgentForm
│   ├── Missions.tsx           # [MODIFY] Missão assíncrona
│   ├── Chat.tsx               # [NEW] Tela de conversa real-time
│   ├── Vault.tsx              # [REWRITE] Tree view + preview + graph
│   ├── Settings.tsx           # [NEW] Configurações do studio
│   └── Onboarding.tsx         # [MODIFY] Guard de acesso
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        # [MODIFY] Heartbeat real
│   │   └── AppShell.tsx       # (sem mudança)
│   ├── ui/
│   │   ├── Modal.tsx          # (sem mudança)
│   │   ├── GlassCard.tsx      # (sem mudança)
│   │   ├── Badge.tsx          # (sem mudança)
│   │   └── TerminalBlock.tsx  # (sem mudança)
│   ├── vault/
│   │   ├── FileTree.tsx       # [NEW] Árvore recursiva de pastas
│   │   ├── MarkdownPreview.tsx # [NEW] Renderer de .md
│   │   └── MindGraph.tsx      # [NEW] Visualização de grafo tipo Obsidian
│   └── chat/
│       ├── ChatThread.tsx     # [NEW] Thread de mensagens
│       └── ChatInput.tsx      # [NEW] Input com streaming
└── hooks/
    ├── useApi.ts              # (sem mudança)
    ├── useProcessSession.ts   # (sem mudança)
    └── useHeartbeat.ts        # [NEW] Hook de polling de saúde
```

### 2.2 Backend (Express + Prisma + SQLite)

```
src/
├── index.ts                   # [MODIFY] Novos endpoints + async missions
├── engine.ts                  # (sem mudança)
└── rag.ts                     # (sem mudança)

Novos endpoints:
  GET  /api/health/detailed    → Motor + agents + RAG status
  POST /api/agents/chat        → [FIX] Tornar assíncrono
  GET  /api/agents/:id/chat    → Histórico de chat de um agente
  POST /api/agents/:id/chat    → Enviar mensagem (cria sessão se não existe)
  GET  /api/vault/tree         → Árvore hierárquica de pastas
  GET  /api/vault/file         → Conteúdo de um arquivo
  GET  /api/config             → [FIX] Retornar config completa
  POST /api/config/set         → (sem mudança)
  POST /api/config/bulk        → [NEW] Setar múltiplas configs
```

### 2.3 Schema Prisma (Mudanças)

```prisma
model Agent {
  // ... campos existentes ...
  heartbeatInterval Int?         // Intervalo em ms (null = sem heartbeat)
  lastHeartbeat     DateTime?    // Último ping
  workspacePath     String?      // Pasta de output do agente
}

model ChatSession {
  // ... sem mudanças ...
}

model Message {
  // ... sem mudanças ...
}

model Config {
  // ... sem mudanças ...
}
```

---

## 3. Fases de Implementação

### Fase 1 — Desbloqueio (Bugs P0)
> **Meta:** Tornar o studio navegável e funcional em todas as telas.

1. **Fix Input (BUG-01):** Extrair `AgentForm` para componente top-level estável
2. **Criar Settings.tsx (BUG-08):** Página de configurações com seções Engine/Vault/Agency
3. **Criar Chat.tsx (BUG-03):** Página de conversa com agente via streaming
4. **Fix Vault link (BUG-06):** Mudar "Configurar" para ir ao Settings
5. **Fix Nova Missão (BUG-07):** Tornar criação assíncrona com retorno imediato
6. **Guard Onboarding (BUG-13):** Redirecionar para dashboard se já configurado
7. **Remover C3PO (BUG-12):** Substituir todos os hardcodes por labels neutras
8. **Atualizar App.tsx:** Adicionar rotas `/chat/:agentId`, `/settings`

### Fase 2 — Vault & Monitoring
> **Meta:** Entregar a experiência de Vault tipo Obsidian e monitoramento real.

1. **Vault Tree View (BUG-05a):** Árvore recursiva de pastas com expand/collapse
2. **Markdown Preview (BUG-05b):** Renderer real de arquivos `.md`
3. **Mind Graph (BUG-05c):** Visualização D3.js/force-graph com nós e links animados
4. **Heartbeat Real (BUG-02):** Polling `/api/health/detailed` a cada 5s
5. **Memória Ativa Real (BUG-09):** Conectar Dashboard à API de vault
6. **Backend Tree endpoint:** `GET /api/vault/tree` com hierarquia recursiva

### Fase 3 — Agent Workspace & Autonomia
> **Meta:** Agentes que geram e organizam outputs no filesystem.

1. **Workspace por agente (BUG-04):** Pasta `workspaces/<agentId>/` criada automaticamente
2. **Heartbeat configurável (BUG-10):** Campo no Agent model + UI no Settings
3. **Output persistence:** Salvar output de cada chat message como arquivo no workspace

### Fase 4 — Cron & Dreaming Mode
> **Meta:** Consolidação autônoma de memória 24h.

1. **Cron system (BUG-11):** `node-cron` com jobs configuráveis
2. **Dreaming Mode:** Consolidação diária de memória via RAG indexing programado
3. **UI de cron:** Seção no Settings para agendar ciclos de dreaming

---

## 4. Decisões de Design

### 4.1 Chat vs Modal
**Decisão:** Chat como página dedicada (`/chat/:agentId`) e não modal.
**Razão:** Modals limitam a área de conversa, não suportam histórico longo, e conflitam com o padrão Dify/Chainlit de thread-based chat.

### 4.2 Vault: Graph View
**Decisão:** Usar `react-force-graph-2d` para o mind map.
**Razão:** Mais leve que D3.js puro, suporta zoom/pan nativo, e tem API simples para nós + links. Alternativa: `@react-sigma/core` (mais performante para grafos grandes).

### 4.3 Settings vs Onboarding
**Decisão:** Settings é uma página separada que edita as mesmas configs do onboarding. Onboarding é one-time.
**Razão:** O usuário não deve re-executar o wizard completo para mudar uma config. Settings granular é padrão de mercado.

### 4.4 Engine Status
**Decisão:** Polling de `/api/health/detailed` a cada 5s via hook `useHeartbeat`.
**Razão:** SSE seria mais eficiente mas adiciona complexidade. Para MVP, polling é suficiente e debug-friendly.

---

## 5. Dependências a Instalar

### Frontend
```bash
npm i react-force-graph-2d react-markdown remark-gfm rehype-highlight
```

### Backend
```bash
npm i node-cron
npm i -D @types/node-cron
```

---

## 6. Critérios de Aceite

### Fase 1 (Mínimo Viável)
- [ ] Inputs aceitam digitação fluida sem perda de foco
- [ ] Página Settings abre corretamente e salva configs
- [ ] Chat com agente funciona com streaming de resposta
- [ ] Nova Missão retorna imediatamente como "pending"
- [ ] Onboarding inacessível após completar
- [ ] Zero referências a "C3PO" no código

### Fase 2 (Vault & Status)
- [ ] Vault mostra árvore hierárquica com expand/collapse
- [ ] Clique em arquivo mostra preview Markdown renderizado
- [ ] Tab "Mind Map" mostra grafo animado com zoom/pan
- [ ] Status do engine na sidebar atualiza em tempo real
- [ ] Memória Ativa no Dashboard mostra arquivos reais

### Fase 3 (Workspaces)
- [ ] Pasta criada automaticamente ao criar agente
- [ ] Output de chat salvo como `.md` no workspace do agente
- [ ] Heartbeat configurável por agente

### Fase 4 (Cron)
- [ ] Job de consolidação roda no horário configurado
- [ ] RAG re-indexa automaticamente no ciclo de dreaming
- [ ] UI de cron funcional no Settings

---

## 7. Riscos & Mitigações

| Risco | Mitigação |
|-------|----------|
| `react-force-graph` pode ser pesado para muitos nós | Limitar a 200 nós + lazy loading |
| Chat síncrono pode travar backend | Execução em child_process com timeout de 60s |
| SQLite pode ter contention com cron + API | Mutex via Prisma transaction |
| Vault sem path configurada retorna vazio | UI mostra CTA claro para Settings |

---

## 8. Prioridade de Execução

```
FASE 1 ←── EXECUTE PRIMEIRO (desbloqueia uso real)
  └── FASE 2 ←── Vault é o diferencial do produto
        └── FASE 3 ←── Autonomia real dos agentes
              └── FASE 4 ←── Nice-to-have, pode ser futuro
```

> **Recomendação:** Implementar Fase 1 + 2 neste sprint. Fases 3 e 4 como follow-up.
