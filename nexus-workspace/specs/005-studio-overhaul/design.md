# Design — 005 Studio Overhaul

> Design system já existente (index.css). Este documento detalha apenas componentes **novos**.

---

## 1. Novas Páginas

### 1.1 Chat Page (`/chat/:agentId`)

```
┌─────────────────────────────────────────────────────────┐
│ AppShell (Sidebar + Header "Chat com {agentName}")      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─ Thread Container (scroll) ───────────────────────┐  │
│  │                                                   │  │
│  │  ┌─ Message (user) ────────────────────────────┐  │  │
│  │  │ Você                              14:35:22  │  │  │
│  │  │ Crie um relatório de vendas Q3...           │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌─ Message (assistant) ───────────────────────┐  │  │
│  │  │ 🤖 AgentName                      14:35:28  │  │  │
│  │  │ Gerando relatório com dados do vault...     │  │  │
│  │  │ ```md                                       │  │  │
│  │  │ # Relatório Q3 ...                          │  │  │
│  │  │ ```                                         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌─ Message (assistant, streaming) ────────────┐  │  │
│  │  │ 🤖 AgentName                      14:36:01  │  │  │
│  │  │ Analisando dados... ▋                       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ Input Bar ───────────────────────────────────────┐  │
│  │ [📎] [ Mensagem..._________________________ ] [▶] │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
- `ChatThread.tsx` — Container scrollável com auto-scroll
- `ChatInput.tsx` — Textarea com submit (Enter) e botão send
- Mensagens usam `glass-panel` com borda diferenciada por role
- Streaming via EventSource ou polling de `/api/agents/:id/chat/stream`

**Estilo:**
- User messages: borda esquerda `var(--primary)`, fundo `rgba(0,245,230,0.04)`
- Assistant messages: borda esquerda `var(--secondary)`, fundo `rgba(255,191,0,0.04)`
- Typing indicator: cursor piscante `▋` com `animate-blink`

---

### 1.2 Settings Page (`/settings`)

```
┌─────────────────────────────────────────────────────────┐
│ AppShell (Sidebar + Header "Configurações")             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─ Section: Agência ────────────────────────────────┐  │
│  │ Nome da Agência:  [ Nexus Agency__________ ]      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ Section: Motor de Execução ──────────────────────┐  │
│  │ Motor ativo:  [● Gemini CLI] [○ OpenClaw] [○ ...]│  │
│  │ API Key:      [ ******************************** ] │  │
│  │ Status:       ● Online (latência: 120ms)          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ Section: Vault ──────────────────────────────────┐  │
│  │ Caminho:      [ C:\Users\...\vault__________ ]    │  │
│  │ Arquivos:     42 indexados | Último: há 3 min     │  │
│  │ [Re-indexar RAG]                                  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ Section: Dados ──────────────────────────────────┐  │
│  │ [Resetar Database]  [Exportar Config]             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                    [ Salvar Alterações ]                 │
└─────────────────────────────────────────────────────────┘
```

**Estilo:** Seções em `GlassCard` com título uppercase + divider. Campos usam `input-glass`.

---

### 1.3 Vault Rewrite (`/vault`)

```
┌─────────────────────────────────────────────────────────┐
│ AppShell (Sidebar + Header "Vault")                     │
├─────────────────────────────────────────────────────────┤
│  [📁 Arquivos] [🧠 Mapa Mental]   ← Tabs              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TAB "Arquivos":                                        │
│  ┌─ Tree (w-72) ─────┐ ┌─ Preview ─────────────────┐   │
│  │ 📁 vault/          │ │ # README.md               │   │
│  │  ├ 📁 agents/      │ │                           │   │
│  │  │  ├ 📄 coder.md  │ │ Este vault contém a      │   │
│  │  │  └ 📄 planner.md│ │ memória vetorial da...    │   │
│  │  ├ 📁 missions/    │ │                           │   │
│  │  │  └ 📄 log.md    │ │ ## Seções                 │   │
│  │  └ 📄 README.md ◀  │ │ - Agents                  │   │
│  │                     │ │ - Missions                │   │
│  │ RAG Search:         │ │ - Knowledge               │   │
│  │ [🔍 buscar...     ] │ │                           │   │
│  └─────────────────────┘ └───────────────────────────┘   │
│                                                         │
│  TAB "Mapa Mental":                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │          ◉ vault                                 │   │
│  │         / | \                                    │   │
│  │        ◉  ◉  ◉                                  │   │
│  │       /   |    \                                 │   │
│  │      ◉   ◉     ◉    ← nós = arquivos            │   │
│  │                      ← links = pastas/referências│   │
│  │  [Zoom +] [Zoom -] [Fit] [Fullscreen]           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Componentes novos:**
- `FileTree.tsx` — Árvore recursiva com expand/collapse animado
- `MarkdownPreview.tsx` — `react-markdown` + `remark-gfm` + `rehype-highlight`
- `MindGraph.tsx` — `react-force-graph-2d` com:
  - Nós coloridos por tipo (pasta=teal, arquivo=amber)
  - Hover mostra nome do arquivo
  - Click centraliza e mostra preview
  - Scroll = zoom smooth
  - Drag = pan

---

## 2. Componentes Modificados

### 2.1 AgentForm (Fix BUG-01)

**Antes:** Função interna ao componente `Agents()` → re-criada a cada render.
**Depois:** Componente React top-level no mesmo arquivo, recebe `form` e `setForm` como props.

```tsx
// ANTES (bugado)
export default function Agents() {
  const [form, setForm] = useState({...});
  const AgentForm = () => (  // ← Recriado a cada render!
    <input value={form.name} onChange={...} />
  );
}

// DEPOIS (fixado)
function AgentForm({ form, onChange }: AgentFormProps) {
  return (
    <input value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} />
  );
}

export default function Agents() {
  const [form, setForm] = useState({...});
  return <AgentForm form={form} onChange={setForm} />;
}
```

### 2.2 Sidebar Heartbeat (Fix BUG-02)

**Antes:** `● online` hardcoded.
**Depois:** Usa `useHeartbeat()` hook que retorna `{ status, latency, engine }`.

```tsx
// Sidebar.tsx — Motor Status Card
const { status, latencyMs } = useHeartbeat();

<span style={{ color: status === 'online' ? '#4ade80' : '#f87171' }}>
  ● {status} {latencyMs ? `(${latencyMs}ms)` : ''}
</span>
```

### 2.3 App.tsx Routing (Fix BUG-08, BUG-13)

```tsx
<Routes>
  {/* Guard: onboarding inacessível se já onboarded */}
  <Route path="/onboarding" element={
    onboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />
  } />
  
  {/* Novas rotas */}
  <Route path="/chat/:agentId" element={<Chat />} />
  <Route path="/settings" element={<Settings />} />
  
  {/* Existentes */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/agents" element={<Agents />} />
  <Route path="/missions" element={<Missions />} />
  <Route path="/vault" element={<Vault />} />
  
  <Route path="/" element={<Navigate to={onboarded ? '/dashboard' : '/onboarding'} replace />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

---

## 3. Novos Endpoints Backend

### 3.1 `GET /api/health/detailed`

```json
{
  "status": "ok",
  "engine": "gemini-cli",
  "engineStatus": "online",
  "latencyMs": 120,
  "agentCount": 3,
  "missionCount": 7,
  "vaultFiles": 42,
  "ragIndexed": true,
  "uptime": 3600
}
```

### 3.2 `GET /api/vault/tree`

```json
{
  "tree": {
    "name": "vault",
    "type": "directory",
    "children": [
      {
        "name": "agents",
        "type": "directory",
        "children": [
          { "name": "coder.md", "type": "file", "size": 1234, "path": "/vault/agents/coder.md" }
        ]
      },
      { "name": "README.md", "type": "file", "size": 567, "path": "/vault/README.md" }
    ]
  }
}
```

### 3.3 `GET /api/vault/file?path=...`

```json
{
  "name": "coder.md",
  "path": "/vault/agents/coder.md",
  "content": "# Coder Agent\n\nEste agente é responsável por...",
  "size": 1234,
  "lastModified": "2026-05-06T01:00:00Z"
}
```

### 3.4 `POST /api/agents/:id/chat` (Async)

**Request:**
```json
{ "message": "Crie um relatório de vendas Q3" }
```

**Response (imediata):**
```json
{
  "sessionId": "uuid",
  "messageId": "uuid",
  "status": "processing"
}
```

A resposta real é polled via `GET /api/agents/:id/chat/:sessionId/messages`.

---

## 4. Design Tokens Adicionais

```css
/* Novos tokens para Chat */
.chat-bubble-user {
  background: rgba(0,245,230,0.04);
  border-left: 3px solid var(--primary);
  border-radius: 0 0.75rem 0.75rem 0;
}

.chat-bubble-assistant {
  background: rgba(255,191,0,0.04);
  border-left: 3px solid var(--secondary);
  border-radius: 0 0.75rem 0.75rem 0;
}

/* Tree view */
.tree-node {
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.15s ease;
}
.tree-node:hover { background: rgba(255,255,255,0.04); }
.tree-node.selected { 
  background: var(--primary-dim); 
  border: 1px solid rgba(0,245,230,0.2);
}

/* Graph node */
.graph-container canvas {
  border-radius: 0.75rem;
  background: rgba(0,0,0,0.3);
}
```

---

## 5. Paleta de Cores (Mantida)

| Token | Hex | Uso |
|-------|-----|-----|
| `--primary` | `#00F5E6` | CTAs, manager nodes, links ativos |
| `--secondary` | `#FFBF00` | Workers, warnings, amber badges |
| `--bg-base` | `#09090b` | Fundo principal |
| `--bg-surface` | `#131315` | Cards, painéis |
| `--text-primary` | `#f4f4f5` | Texto principal |
| `--text-muted` | `#52525b` | Labels, timestamps |

---

## 6. Responsividade

- **Desktop (>1280px):** Layout padrão com sidebar + content
- **Tablet (768-1280px):** Vault tree collapsa; graph full-width
- **Mobile (<768px):** Sidebar vira hamburger; chat full-screen

---

## 7. Micro-animações

| Elemento | Animação | Duração |
|----------|----------|---------|
| Tree node expand | `height: 0 → auto` + `opacity` | 200ms |
| Chat message appear | `translateY(8px) → 0` + `opacity` | 300ms |
| Graph node hover | `scale(1.2)` + glow | 150ms |
| Heartbeat pulse | `dot-pulse` existente | 1.5s loop |
| Tab switch | `opacity` + `translateX` | 250ms |
| Settings save toast | `translateY(-100%) → 0` | 300ms |
