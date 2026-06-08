# Tasks: Nexus Overhaul

- [ ] **1. Consertar AgentFlowCanvas (Drag & Drop)**
  - [ ] Remover o `load()` do `handleConnect` em `Agents.tsx` para não forçar refetch síncrono da tela e destruir as posições do React Flow.
  - [ ] Ajustar o `useEffect` de `AgentFlowCanvas.tsx` para sincronizar `nodes` com `agents` vindos da API, mas sem sobrescrever instâncias ativas (usar alguma heurística de merge ou evitar update constante).

- [ ] **2. Desmockar o RAG / Vault**
  - [ ] Alterar `FileTree.tsx` para realizar o fetch real da API `/api/vault/tree`.
  - [ ] Garantir que o Vault exiba a árvore de diretórios correta.

- [ ] **3. Acessibilidade do Chat**
  - [ ] Adicionar link `/chats` no componente de Sidebar/AppRouter.
  - [ ] Criar a página `ChatsList.tsx` (ou ajustar o modal existente) para que se torne uma visualização de duas colunas (Esquerda = Lista de Agentes, Direita = Conversa com botão de "Limpar Histórico").

- [ ] **4. Consertar o Motor de Execução (Engine)**
  - [ ] Analisar e corrigir `runGeminiCli` no backend (`src/engine.ts` ou `index.ts`) para capturar respostas corretamente (verificar buffers do Child Process, e logs de erro).
  - [ ] Garantir que o backend crie missões como "done" e retorne o texto.

- [ ] **5. QA End-to-End Test (E2E)**
  - [ ] Realizar teste guiado utilizando o `browser_subagent` ou script manual na porta 5173 para validar se a hierarquia salva após F5, e se o agente retorna mensagem com sucesso sem redirecionamentos indesejados.
