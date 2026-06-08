# Research — Phase 3: Nexus Studio Deep Overhaul

## Análise do Estado Atual (06/05/2026)

### Stack
- **Backend:** Node.js + Express + Prisma (SQLite) + LanceDB (RAG stub)
- **Frontend:** React + Vite + Tailwind + Framer Motion
- **Engine:** `executeCommand('wsl', ['gemini-cli', '-p', ...])` — execução síncrona via child_process
- **Auth:** JWT com bcrypt

---

## BUGS CONFIRMADOS PELO USUÁRIO (testes de 06/05)

### BUG-A: Chat não retorna resposta real do Gemini CLI
- **Sintoma:** Mensagens do agente retornam `"Processado via gemini-cli: <echo da msg>"` em vez da resposta real.
- **Causa raiz:** O `executeCommand('wsl', ['gemini-cli', '-p', systemPrompt])` provavelmente falha silenciosamente (wsl não encontrado, gemini-cli não autenticado, ou timeout). O fallback cai para o texto dummy `Processado via ${engine}: ${message}`.
- **Evidência:** Screenshot mostra "Processado via gemini-cli: teste" e "Sem resposta do motor." — ou seja, o `result.stdout` vem vazio.

### BUG-B: Missões criam-se automaticamente como "concluído"
- **Sintoma:** Ao criar missão, ela já aparece como concluída sem log.
- **Causa raiz:** O endpoint `POST /api/agents/chat` cria um ChatSession e retorna imediatamente com `status: 'processing'`. Porém o `GET /api/missions` mapeia TODAS as sessions como `status: 'done', progress: 100` (linha 189 do backend). Não existe campo `status` real no schema do Prisma.
- **Fix necessário:** Adicionar campo `status` no model `ChatSession` (enum: pending/running/done/error).

### BUG-C: Criar missão gera uma conversa nova sem pedir
- **Sintoma:** Ao criar missão, o endpoint `POST /api/agents/chat` sempre cria uma nova `ChatSession`, poluindo o histórico.
- **Causa raiz:** Lógica hardcoded em `POST /api/agents/chat` → `prisma.chatSession.create()` sempre roda.

### BUG-D: Dashboard feed/log ruim e metade do card não utilizado
- **Sintoma:** O Context Feed mostra dados confusos, duplicados, e o card de "Memória Ativa" está mal aproveitado.
- **Causa raiz:** O feed acumula em memória (`feedLog[]`) e o polling do frontend concatena sem dedup. O card de memória apenas lista 5 arquivos do vault sem qualquer interação.

### BUG-E: Nenhum agente responde de verdade
- **Sintoma:** Todos os agentes retornam o mesmo texto template.
- **Causa raiz:** Mesmo que BUG-A. A execução real do Gemini CLI não está funcionando. Precisa de validação do path WSL e fallback robusto.

---

## FEATURES PEDIDAS PELO USUÁRIO

### FEAT-1: Chat UX tipo OpenClaw
- Chat deve ter tela facilitada para acessar conversas.
- Botão "Novo Chat" que limpa o histórico visual (cria nova session).
- Lista lateral de conversas anteriores com o agente.
- Sem criar sessão extra ao enviar missão.

### FEAT-2: Agentes como Fluxograma Empresarial (Drag & Drop)
- Substituir o grid de cards por um canvas drag-and-drop.
- Permitir conectar agentes visualmente (manager → workers).
- Suportar hierarquias multi-nível (worker pode ter sub-workers).
- Estilo empresarial, nível Apple, com animações suaves.
- Lib candidata: `@xyflow/react` (React Flow) — a mais madura para node-based editors.

### FEAT-3: Vault como Obsidian (Árvore + Preview + MindGraph)
- Sidebar esquerda: árvore de pastas/arquivos recursiva com ícones e expand/collapse.
- Painel central: preview de Markdown renderizado (com `react-markdown`).
- Tab de MindGraph: visualização de bolinhas animadas com zoom, usando `react-force-graph-2d`.
- API `/api/vault/tree` já existe no backend.

### FEAT-4: Tela de Custos e Limites
- Tela nova `/costs` para tracking de uso.
- Filtros por data e agente.
- Gasto por dia, semana, e previsão mensal.
- Dados diretos, sem burocracia — cards com valores e gráfico de barras simples.
- Backend: model `UsageLog` para registrar cada chamada de API/engine com tokens/custo.

---

## Benchmarking

### OpenClaw (referência do usuário)
- Chat limpo, sessões na lateral, novo chat com 1 clique.
- Dashboard com logs em tempo real.

### Obsidian (referência para Vault)
- Árvore de pastas na lateral com expand/collapse.
- Preview de Markdown com syntax highlight.
- Graph view com nós interconectados.

### React Flow (referência para Agentes)
- Canvas drag-and-drop com nós customizados.
- Edges animadas, zoom, pan, minimap.
- Usado por n8n, Langflow, etc.
