# Design — 006: Nexus Studio Deep Overhaul

## Design System (mantido)

- **Paleta:** Dark base `#09090b`, Primary cyan `#00f5e6`, Secondary amber `#ffbf00`
- **Tipografia:** Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- **Bordas:** `rgba(255,255,255,0.08)` com glow sutil em hover
- **Glass:** `backdrop-filter: blur(12px)` + `rgba(255,255,255,0.03)`
- **Animações:** Framer Motion para transições, CSS para micro-interações

---

## Tela: Chat (Redesign)

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  ← Voltar   🤖 AgentName  ·  online              ⊕ New  │
├──────────┬───────────────────────────────────────────────┤
│ Sessions │                                               │
│ ──────── │         Chat Thread (Markdown)                │
│ > Hoje   │                                               │
│   sess1  │  [user msg]                                   │
│   sess2  │  [assistant msg — rendered MD]                │
│ > Ontem  │  [user msg]                                   │
│   sess3  │  [assistant msg — rendered MD]                │
│          │                                               │
│          │  ┌─ typing indicator ─┐                       │
│          │                                               │
├──────────┴───────────────────────────────────────────────┤
│  [📎]  [        input area          ]  [Send ➤]         │
└──────────────────────────────────────────────────────────┘
```

- **Sessions sidebar (220px):** Lista agrupada por data, cada item mostra título truncado + timestamp.
- **Thread:** Mensagens com avatar; respostas do agente renderizadas como Markdown (headings, code blocks, listas).
- **Novo Chat:** Botão no header; cria nova session, limpa thread.

### Componentes Stitch/React
- `ChatSessionList` — sidebar de sessões
- `ChatThread` (refactor) — agora com Markdown rendering via `react-markdown`
- `ChatInput` (mantido) — auto-resize textarea

---

## Tela: Agentes (Fluxograma)

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  Agentes    [+ Criar Agente]  [Zoom -] [Zoom +] [Fit]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│          ┌──────────────┐                                │
│          │  🤖 Manager  │                                │
│          │  C3PO        │                                │
│          │  ● online    │                                │
│          └──┬───────┬───┘                                │
│             │       │                                    │
│      ┌──────┘       └──────┐                             │
│      ▼                     ▼                             │
│  ┌──────────┐      ┌──────────┐                          │
│  │ ⚙ Worker │      │ ⚙ Worker │                          │
│  │ Coder-v1 │      │ Vendedor │                          │
│  │ ● online │      │ ● online │                          │
│  └──────────┘      └──────────┘                          │
│                                                          │
│  [MiniMap]                                               │
└──────────────────────────────────────────────────────────┘
```

### React Flow — Nó Customizado `AgentNode`
```
┌─────────────────────────────┐
│ [Avatar]  NomeLongo...      │
│           role: worker      │
│           ● online          │
│ ────────────────────────────│
│ [💬 Chat] [✏️ Edit] [🗑]   │
└─────────────────────────────┘
```

- **Handle superior:** entrada (para receber edge de manager)
- **Handle inferior:** saída (para enviar edge a sub-workers)
- **Cores:** Manager = cyan glow, Worker = amber outline
- **Interações:** Double-click para editar inline; right-click para menu contextual

### Persistência
- Campos `positionX`, `positionY` no model Agent
- Campo `parentId` (self-relation) para hierarquia
- Endpoint `PUT /api/agents/:id/position` para salvar posição
- Endpoint `PUT /api/agents/:id/connect` para definir parentId

---

## Tela: Vault (Obsidian-like)

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  Vault   [Re-indexar]  [🔍 Busca semântica]              │
├──────────┬─────────────────────────────┬─────────────────┤
│ FileTree │     [Preview] [Graph]       │                 │
│ ──────── │                             │                 │
│ ▼ 📁 src │   # Título do Arquivo       │                 │
│   📄 a.md│                             │                 │
│   📄 b.md│   Conteúdo renderizado      │                 │
│ ▶ 📁 docs│   em Markdown com           │                 │
│ ▶ 📁 logs│   syntax highlighting       │                 │
│          │                             │                 │
│          ├─────────────────────────────│                 │
│          │ Ou tab [Graph]:             │                 │
│          │  ○──○──○                    │                 │
│          │   ╲  ╱                      │                 │
│          │    ○                        │                 │
│          │  Mind Graph interativo      │                 │
└──────────┴─────────────────────────────┴─────────────────┘
```

### FileTree
- Recursivo com expand/collapse via state local
- Ícones: 📁 pasta, 📄 `.md`, 📊 `.csv`, 🖼️ imagem
- Indentação visual com `padding-left: depth * 16px`
- Highlight do arquivo selecionado com cyan glow

### MarkdownPreview
- `react-markdown` + `remark-gfm`
- Custom components para headings (com anchor), code blocks (com syntax highlight via `rehype-highlight` ou prism), tables
- Metadata bar: nome do arquivo, tamanho, última modificação

### MindGraph
- `react-force-graph-2d` com dados do `/api/vault/tree`
- Cada pasta = nó grande (cor amber), cada arquivo = nó pequeno (cor cyan)
- Links representam relação pai-filho
- Zoom, pan, clique em nó abre no preview
- Tooltip com nome e tamanho

---

## Tela: Custos (Nova)

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  Custos   [Filtro: Agente ▼] [Data: Última semana ▼]     │
├──────────────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│  │  💰 Hoje   │ │ 📊 Semana  │ │ 📈 Previsão│           │
│  │  R$ 2,40   │ │  R$ 12,80  │ │  R$ 54,00  │           │
│  │  12 calls  │ │  68 calls  │ │  ~290 calls│           │
│  └────────────┘ └────────────┘ └────────────┘           │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │  Bar Chart — Últimos 7 dias por agente       │        │
│  │  █ ██ ███ ██ █ ████ ██                       │        │
│  │  seg ter qua qui sex sab dom                 │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │  Tabela de Logs Recentes                     │        │
│  │  Hora  | Agente   | Tokens | Custo           │        │
│  │  00:22 | TestBot  | 1.2k   | R$ 0,18        │        │
│  │  00:21 | Coder-v1 | 3.4k   | R$ 0,51        │        │
│  └──────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

### Componentes
- `CostSummaryCards` — 3 cards KPI
- `CostBarChart` — Recharts BarChart com cores por agente
- `CostLogTable` — Tabela paginada com logs recentes

---

## Database Schema (Prisma — alterações)

```prisma
model Agent {
  // existentes...
  positionX   Float?    @default(0)
  positionY   Float?    @default(0)
  parentId    String?
  parent      Agent?    @relation("AgentHierarchy", fields: [parentId], references: [id])
  children    Agent[]   @relation("AgentHierarchy")
}

model ChatSession {
  // existentes...
  status      String    @default("pending") // pending, running, done, error
}

model UsageLog {
  id          String   @id @default(uuid())
  agentId     String?
  engine      String   @default("gemini-cli")
  tokensIn    Int      @default(0)
  tokensOut   Int      @default(0)
  costUsd     Float    @default(0)
  durationMs  Int      @default(0)
  createdAt   DateTime @default(now())
}
```
