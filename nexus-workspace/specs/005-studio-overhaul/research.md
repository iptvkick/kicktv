# Research — 005-studio-overhaul

## Escopo
O usuário reportou **13 bugs/lacunas críticas** no Nexus Agency Studio após o onboarding funcionar pela primeira vez. Este spec trata da refatoração completa da aplicação para torná-la realmente funcional e open-source-ready.

## Bugs Reportados (Inventário Completo)

### BUG-01: Input só aceita 1 caractere por vez
- **Localização:** `Agents.tsx` modal `AgentForm`, linha 85/113/120-127
- **Causa-raiz:** O `AgentForm` é declarado como uma **função interna** dentro do componente `Agents()`. A cada re-render do estado `form`, o React destrói e reconstrói o `AgentForm` inteiro (incluindo os `<input>` e `<textarea>`), fazendo o cursor perder o foco após cada keystroke.
- **Fix:** Extrair `AgentForm` para fora do componente ou usar um componente estável com `useMemo`/`useCallback`, ou simplesmente mover `AgentForm` como componente top-level no mesmo arquivo.

### BUG-02: Sem heartbeat real
- **Localização:** `Sidebar.tsx` exibe hardcoded `● online` (linha 116), sem nenhuma verificação real.
- **Backend:** Não existe endpoint `/api/health` que retorne status detalhado do engine.
- **Fix:** Criar heartbeat poll no frontend via `setInterval` que chame `/api/health` e atualize o status visual em tempo real.

### BUG-03: Botão "Chat" no card de agente redireciona para Missões
- **Localização:** `Agents.tsx` linha 196-202 — usa `<a href="/missions?agent=...">` com texto "Chat".
- **Problema:** Não existe uma tela de chat dedicada. Ao clicar, vai para `/missions` que não tem interface de conversa.
- **Fix:** Criar uma nova página `Chat.tsx` dedicada com interface de conversação real-time, ou embutir um chat drawer no card do agente.

### BUG-04: Agentes não criam pastas/arquivos automaticamente
- **Problema:** Ao conversar com agentes, o backend não faz nada com o filesystem. A missão é enviada como `POST /api/agents/chat` que executa `wsl gemini-cli -p <message>` mas não persiste output em pastas.
- **Fix:** Implementar lógica de workspace por agente — pasta `workspaces/<agentId>/` onde outputs são salvos automaticamente.

### BUG-05: Vault precisa de árvore de pastas + visualização de arquivo + mind map
- **Localização:** `Vault.tsx` — Sidebar só mostra lista flat de `.md` files, sem hierarquia.
- **Preview:** Linha 154 diz "Preview de arquivos Markdown disponível na próxima fase." — é placeholder.
- **Mind map:** Inexistente. O usuário quer uma visualização estilo Obsidian com nós animados e zoom.
- **Fix:** Implementar tree view recursiva, markdown renderer real, e um graph view com D3.js ou react-force-graph.

### BUG-06: Botão "Configurar" no Vault vai para `/onboarding`
- **Localização:** `Vault.tsx` linha 72 — `<a href="/onboarding">Configurar →</a>`
- **Problema:** Redireciona para o fluxo de onboarding completo ao invés de abrir apenas a config da Vault.
- **Fix:** Abrir modal de configuração de Vault inline ou navegar para `/settings#vault`.

### BUG-07: Nova Missão fica carregando infinitamente
- **Localização:** `Missions.tsx` `handleSend()` linha 48-58 — chama `POST /api/agents/chat`.
- **Problema:** O backend `POST /api/agents/chat` tenta executar `wsl gemini-cli -p <message>` de forma síncrona, que pode travar/timeout. O frontend não tem feedback de erro, ficando com o spinner girando.
- **Fix:** Tornar a execução assíncrona, retornar imediatamente a missão como "pending", e atualizar via polling/SSE.

### BUG-08: Botão "Configurações" na sidebar vai para `/settings` que não existe
- **Localização:** `Sidebar.tsx` linha 94 — `<NavLink to="/settings">`
- **App.tsx:** Rota `/settings` não existe. O catch-all `*` redireciona para `/`, que redireciona para `/onboarding` se `onboarded !== 'true'` ou `/dashboard`.
- **Conclusão:** Clicar em "Configurações" causa redirect para onboarding se `onboarded` não estiver setado, dando a impressão de "voltar ao começo".
- **Fix:** Criar página `Settings.tsx` dedicada com todas as configurações do studio.

### BUG-09: Lista de "Memória Ativa" no Dashboard é mock
- **Localização:** `Dashboard.tsx` linhas 323-335 — Array hardcoded `['Q3_Financial_Report.pdf', 'Client_Alpha_Profile.json', 'System_Prompt_v8.txt']`.
- **Fix:** Conectar à API de Vault/RAG e mostrar arquivos reais indexados recentemente.

### BUG-10: Heartbeats precisam de configuração por agente
- **Problema:** Não existe conceito de heartbeat configurável. O status "online" é estático.
- **Fix:** Adicionar campo `heartbeatIntervalMs` e `lastHeartbeat` no model Agent, com endpoint de ping.

### BUG-11: Falta cron + modo dreaming para consolidação de memória
- **Referência:** OpenClaw faz consolidação de memória do dia a cada 24h em horário configurável.
- **Fix:** Implementar sistema de scheduled jobs no backend (usando `node-cron` ou similar) com endpoint de configuração.

### BUG-12: "C3PO" hardcoded no Agency Map
- **Localização:** `Dashboard.tsx` linha 17 — fallback `{ id: 'm', name: 'C3PO (Manager)', role: 'manager' }`.
- **Placeholder inputs:** `Agents.tsx` linha 86 `placeholder="Ex: Coder-v1"`.
- **Problema:** Nomes específicos do projeto do usuário hardcoded. Prejudica open-source.
- **Fix:** Remover todos os nomes/exemplos específicos. Usar placeholders genéricos neutros.

### BUG-13: Onboarding acessível após configurar tudo
- **Problema:** Mesmo após completar onboarding, a rota `/onboarding` continua acessível diretamente. Deveria redirecionar para dashboard se `onboarded === 'true'`.
- **Fix:** Adicionar guard na rota de onboarding em App.tsx.

## Análise de Concorrentes

### Dify.ai
- **UX Forte:** Visual drag-and-drop studio, RAG pipeline visual, agent workflow builder.
- **Padrão:** Sidebar fixa com tree view de projetos, workspace management.
- **Lição:** Vault/Knowledge Base usa tree hierárquica com preview inline.

### Chainlit
- **UX Forte:** Chat interface com step-by-step agent reasoning visible.
- **Padrão:** Conversational UI onde cada "step" do agente é um card expansível.
- **Lição:** Real-time streaming de pensamento do agente com feedback visual.

### assistant-ui (React)
- **UX Forte:** Framework-agnostic, composable chat components com streaming nativo.
- **Padrão:** Thread-based conversations, generative UI, human-in-the-loop.
- **Lição:** Chat deve ser thread-based, não modal-based.

## Arquitetura Atual (Resumo)

| Camada | Tecnologia | Estado |
|--------|-----------|--------|
| Frontend | React + Vite + Tailwind + Framer Motion | Parcialmente funcional |
| Backend | Express + Prisma + SQLite + LanceDB | Stubs em muitos endpoints |
| CLI Engine | child_process.spawn (via wsl) | Funciona mas é síncrono |
| RAG | LanceDB (stub) | Não implementado de fato |
| Auth State | Config model (key/value) | Funciona |

## Dependências do Projeto

```json
{
  "frontend": ["react", "react-router-dom", "framer-motion", "lucide-react", "axios", "tailwindcss"],
  "backend": ["express", "cors", "@prisma/client", "dotenv", "@lancedb/lancedb", "@xenova/transformers"],
  "devDeps": ["typescript", "tsx", "prisma", "vite"]
}
```
