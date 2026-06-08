# 004 — Engine Orchestration Rework: Tasks

## Fase 1: Backend — Process Manager com SSE Streaming

- [ ] **T-01**: Refatorar `engine.ts` — Criar classe `ProcessManager` com Map de sessões
  - Método `spawn(cmd, args, env?)` → retorna `sessionId` (UUID)
  - Método `sendInput(sessionId, text)` → escreve no stdin do processo
  - Método `kill(sessionId)` → SIGTERM no processo, limpa sessão
  - Método `subscribe(sessionId, res)` → registra SSE subscriber
  - Auto-cleanup: remove sessão ao receber evento `exit` do processo
  - Whitelist de segurança: `['npm', 'npx', 'gemini', 'openclaw', 'go', 'node']`

- [ ] **T-02**: Adicionar endpoints SSE em `index.ts`
  - `POST /api/setup/spawn` — Spawna processo, retorna `{sessionId}`
  - `GET /api/setup/stream/:sessionId` — SSE stream de stdout/stderr/exit
  - `POST /api/setup/input/:sessionId` — Envia stdin ao processo
  - `POST /api/setup/kill/:sessionId` — Mata processo
  - Manter endpoints antigos (`/api/setup/run-command`) para retrocompatibilidade

- [ ] **T-03**: Testar backend isoladamente
  - Subir servidor, chamar `POST /spawn` com `{command: "node", args: ["-e", "console.log('hello')"]}`
  - Verificar SSE stream retorna `hello` e `exit` com código 0
  - Testar envio de stdin com processo `node` interativo

## Fase 2: Frontend — TerminalBlock Interativo

- [ ] **T-04**: Upgrade `TerminalBlock.tsx` para suporte interativo
  - Adicionar prop `interactive?: boolean` e `sessionId?: string`
  - Quando `interactive=true`: mostrar input field + botão Send na parte inferior
  - Conectar ao SSE endpoint `GET /api/setup/stream/:sessionId`
  - Parse de SSE events e append ao array de linhas
  - Input: ao pressionar Enter ou clicar Send, `POST /api/setup/input/:sessionId`
  - Botão "Parar" (X) no header do terminal → `POST /api/setup/kill/:sessionId`
  - Strip de códigos ANSI básicos do output
  - Auto-scroll no new output

- [ ] **T-05**: Adicionar hook `useProcessSession.ts`
  - Custom hook que encapsula: spawn, SSE subscribe, send input, kill
  - Gerencia estado: `idle | spawning | running | exited`
  - Retorna: `{sessionId, lines, status, spawn(), sendInput(), kill()}`
  - Cleanup no unmount (kill + close SSE)

## Fase 3: Frontend — StepEngine Reworked

- [ ] **T-06**: Reescrever `StepEngine.tsx` — Engine Cards (manter layout)
  - Manter grid 3 colunas com glassmorphism
  - Adicionar badge de status dinâmico em cada card
  - Status: "Não instalado" | "Instalado v0.X.X" | "Autenticado ✓"
  - Reset de estado ao trocar de engine

- [ ] **T-07**: Implementar fluxo Gemini CLI
  - **Botão "Instalar"**: Chama `spawn("npm", ["install", "-g", "@google/gemini-cli"])` → streaming no terminal
  - **Botão "Verificar"**: Chama `spawn("gemini", ["--version"])` → detecta versão no output
  - **Botão "Iniciar Gemini"**: Chama `spawn("gemini")` → abre sessão interativa, CLI apresenta menu de auth, usuário interage pelo terminal input
  - **Painel "API Key"**: Input para `GEMINI_API_KEY` → `spawn("gemini", [], {env: {GEMINI_API_KEY: value}})` → CLI inicia sem menu de auth
  - Detecção de "already authenticated": se output não contém menu de auth → marcar como conectado

- [ ] **T-08**: Implementar fluxo OpenClaw
  - **Botão "Instalar"**: `spawn("npm", ["install", "-g", "openclaw"])`
  - **Botão "Verificar"**: `spawn("openclaw", ["--version"])`
  - **Painel "API Keys"**: Inputs para provider keys (Anthropic/OpenAI)
  - **Botão "Iniciar"**: `spawn("openclaw", [], {env: {ANTHROPIC_API_KEY: value}})`

- [ ] **T-09**: Implementar fluxo Hermes Agent (Nous Research)
  - **Detecção WSL**: Se Windows, verificar se WSL está disponível (`wsl --status`) antes de prosseguir
  - **Botão "Instalar"**: `spawn("wsl", ["bash", "-c", "curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash"])` (em WSL) ou direto `bash -c "curl ... | bash"` (em Linux/macOS)
  - **Botão "Verificar"**: `spawn("wsl", ["hermes", "--version"])` ou `spawn("hermes", ["--version"])`
  - **Botão "Iniciar Setup"**: `spawn("wsl", ["hermes", "setup"])` → wizard interativo no terminal
  - **Painel "API Key"**: Input para `OPENROUTER_API_KEY` / `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`
  - **Botão "Doctor"**: `spawn("wsl", ["hermes", "doctor"])` → diagnóstico completo
  - Nota: Hermes **NÃO roda nativamente no Windows** — todos os comandos via `wsl` prefix

- [ ] **T-10**: Lógica de "Avançar"
  - Botão "Avançar: Conectar Vault" habilitado somente quando engine instalada + auth configurada
  - Salvar config: `POST /api/config/set {key: "engine", value: selected}`
  - Salvar versão: `POST /api/config/set {key: "engine_version", value: detected}`

## Fase 4: Cleanup e Polimento

- [ ] **T-11**: Remover código morto
  - Remover `handleAuth()` antigo do StepEngine
  - Remover endpoint `/api/setup/gemini-auth` (não existe no CLI real)
  - Remover link fake `gemini.google.com/cli/auth`
  - Limpar imports não usados

- [ ] **T-12**: CSS / Microinterações
  - Estilizar terminal input field (teal border, JetBrains Mono)
  - Animação de status badge transitions (color morph 300ms)
  - Botão kill (X) com hover vermelho
  - Loading spinner nos action buttons

- [ ] **T-13**: Testes e Validação
  - `npm run build` — zero TypeScript errors
  - Teste manual: navegar `/onboarding`, instalar Gemini CLI, verificar, autenticar
  - Verificar que processos são mortos ao sair da página (cleanup)
  - Verificar que SSE funciona cross-browser

## Dependências entre Tasks

```
T-01 ─→ T-02 ─→ T-03 (Backend core)
                   ↓
T-04 ─→ T-05 ─→ T-06 → T-07 → T-08 → T-09 → T-10 (Frontend)
                                                        ↓
                                              T-11 → T-12 → T-13 (Cleanup)
```
