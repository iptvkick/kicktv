# Fase Research (RPI-R) — Nexus Studio Overhaul

## 1. Contexto e Objetivos

O usuário relatou problemas críticos de usabilidade e funcionalidade na versão atual do Nexus Agency Studio (introduzida na Phase 3):

- **Bug 1: AgentFlowCanvas "Resetando"**: Ao arrastar ou conectar nós, o layout "pula" ou desfaz as mudanças, o que estraga a experiência drag-and-drop.
- **Bug 2: Vault Completamente Mockado**: A tela de RAG (Vault) contém `FileTree` e `MindGraph` falsos que não interagem com o sistema de arquivos local nem mostram arquivos reais de uma memória vetorial/obsidian.
- **Bug 3: Acessibilidade do Chat**: Está muito difícil iniciar um chat com um agente. Atualmente, os chats só podem ser acessados com um duplo-clique no AgentFlowCanvas ou via modal de Edição. O usuário deseja uma tela dedicada ou um acesso bem mais fácil aos chats.
- **Bug 4: Falha na Resposta do Motor (Gemini CLI)**: Os agentes respondem "Sem resposta do motor." ou "Processado via gemini-cli: oi". Isso indica que a integração com o motor não está capturando a resposta real do `gemini-cli` ou as pastas do RAG não estão sendo criadas.

## 2. Análise Técnica (Achados)

### AgentFlowCanvas (Reset Bug)
- **Causa**: O `useEffect` do `AgentFlowCanvas.tsx` é dependente de `agents`. Quando `handleConnect` é acionado em `Agents.tsx`, ele faz o `api.put` e imediatamente chama `load()`. O `load()` busca os agentes do banco e altera a prop `agents`.
- **Efeito**: Isso dispara o `useEffect`, que recria *completamente* os arrays `nodes` e `edges` com base nos dados brutos do DB, sobrescrevendo qualquer estado efêmero do `ReactFlow` e causando "pulos" visuais. Se posições ainda não tinham sido persistidas perfeitamente, elas retornam ao estado antigo.

### Vault (Mock Bug)
- **Causa**: `FileTree.tsx` e `MindGraph.tsx` não utilizam os endpoints do backend. O backend *possui* as rotas `/api/vault/tree` e `/api/vault/files`, mas o frontend não as chama.
- **Efeito**: A UI não reflete o conteúdo real do disco (Obsidian).

### Chat UI (Accessibility)
- **Causa**: Não há um link dedicado no `AppShell` (Sidebar) para "Chats". Os chats são atrelados às sessões (`/api/missions` ou rotas dinâmicas).
- **Efeito**: Fluxo não intuitivo para usuários que querem simplesmente abrir uma interface de chat como no OpenClaw.

### Engine Integration (No Response)
- **Causa**: A função `runGeminiCli` no backend (`app/backend/src/engine.ts`) pode estar chamando o processo e aguardando um stdout, mas o output do gemini-cli talvez venha no stderr ou a API de stream falha silenciosamente. O backend cai no fallback de "Sem resposta do motor".

## 3. Conclusão da Pesquisa
Para resolver as dores do usuário, devemos:
1. Sincronizar o estado do React Flow sem causar recriações totais da árvore.
2. Integrar a `FileTree` para fazer requisições reais a `/api/vault/tree`.
3. Adicionar uma nova rota `/chats` e uma opção na Sidebar.
4. Refatorar e consertar o `engine.ts` para que a comunicação com o Gemini CLI seja capturada perfeitamente.
