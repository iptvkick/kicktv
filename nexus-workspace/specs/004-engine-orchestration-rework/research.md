# 004 — Engine Orchestration Rework: Research

## 1. Mapeamento do Projeto Existente

### Stack Atual
| Camada | Tecnologia | Notas |
|--------|-----------|-------|
| Frontend | React 18 + Vite + TypeScript | Tailwind v3.4, Framer Motion, Lucide |
| Backend | Express + Prisma (SQLite) | LanceDB para RAG |
| Execução | `child_process.spawn()` | `engine.ts` — buffered (não streaming) |
| Terminal UI | `TerminalBlock.tsx` | Read-only, sem stdin |

### Arquivos Chave
- `app/frontend/src/components/onboarding/StepEngine.tsx` — wizard de engines (371 linhas)
- `app/frontend/src/components/ui/TerminalBlock.tsx` — exibição de terminal (60 linhas)
- `app/backend/src/engine.ts` — executor de comandos (44 linhas)
- `app/backend/src/index.ts` — API principal (342 linhas)

### Problemas Críticos Encontrados
1. **`gemini auth --code`** não existe. Comando fabricado.
2. **`gemini.google.com/cli/auth`** não existe. URL fabricada.
3. **Auth é interno ao CLI**: `gemini` → menu interativo → escolha do método.
4. **Terminal é read-only**: Não aceita stdin, impossível interagir com processos.
5. **Execução é buffered**: `executeCommand()` só retorna quando o processo termina. Não serve para processos interativos.

---

## 2. Deep Research: Gemini CLI

**Fonte**: https://github.com/google-gemini/gemini-cli (103k ★)
**Docs**: https://www.geminicli.com/docs/get-started/authentication

### Instalação
```bash
npm install -g @google/gemini-cli   # global
npx @google/gemini-cli              # sem instalar
```

### Verificação
```bash
gemini --version
```

### Fluxo de Autenticação (Real)
Ao rodar `gemini` pela primeira vez, o CLI **ele mesmo** apresenta um menu interativo:

```
? How would you like to authenticate?
❯ Sign in with Google (recommended)
  Use Gemini API key
  Use Vertex AI
```

**Opção 1 — Sign in with Google (OAuth)**:
- CLI abre navegador automaticamente
- Usuário faz login no Google
- Token é cacheado em `~/.gemini/` para sessões futuras
- Free tier: 60 req/min, 1000 req/dia

**Opção 2 — Gemini API Key**:
- Requer `GEMINI_API_KEY` no env **antes** de rodar `gemini`
- Obtém key em: https://aistudio.google.com/apikey
- CLI detecta a env var e pula menu

**Opção 3 — Vertex AI**:
- Requer `GOOGLE_API_KEY` + `GOOGLE_GENAI_USE_VERTEXAI=true`
- Ou: ADC via `gcloud auth application-default login`

### Detecção de Auth Existente
Se já autenticado, `gemini` entra direto no REPL sem perguntar nada.

### Headless Mode
```bash
gemini -p "Your prompt here"               # resposta única
gemini -p "prompt" --output-format json     # JSON estruturado
gemini -p "prompt" --output-format stream-json  # streaming
```

---

## 3. Deep Research: OpenClaw

**Fonte**: https://github.com/openclaw/openclaw (369k ★, 41k commits)

### Instalação
```bash
npm install -g openclaw
```

### Verificação
```bash
openclaw --version
```

### Arquitetura
- **Gateway** principal que orquestra múltiplos agentes
- Suporta providers: Anthropic, OpenAI, Google, Local (Ollama)
- Configuração via `~/.openclaw/config.yaml` ou env vars
- Dashboard web embutido (porta configurável)

### Autenticação
- API Keys via env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, etc.
- Primeira execução: setup interativo para escolher provider e key

### Integração com Nexus
- Roda nativamente em Windows (Node.js)
- Não precisa de WSL

---

## 4. Deep Research: Hermes Agent (Nous Research)

**Fonte**: https://github.com/NousResearch/hermes-agent (134k ★, 7.3k commits)
**Docs**: https://hermes-agent.nousresearch.com/docs
**Site**: https://hermes-agent.nousresearch.com/hermes-agent

### O que é
Agente autônomo open-source (MIT) criado pela **Nous Research** (criadores do modelo Hermes). Não é um coding copilot — é um agente persistente que roda no seu servidor, aprende com o uso, e se torna mais capaz ao longo do tempo.

### Instalação (Linux/macOS/WSL2 — NÃO suporta Windows nativo)
```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

O installer cuida de tudo: Python 3.11 (via uv), Node.js v22, ripgrep, ffmpeg, venv, e o comando `hermes` global.

### Verificação
```bash
hermes --version
hermes doctor    # diagnóstico completo
```

### Setup / Configuração
```bash
hermes setup     # wizard completo
hermes model     # configura LLM provider e modelo
hermes tools     # configura ferramentas habilitadas
hermes gateway setup  # configura plataformas de mensagem
```

### Autenticação / Providers
- Suporta: OpenRouter, OpenAI, Anthropic, Nous Portal, ou qualquer endpoint compatível
- Config via: `hermes config set OPENROUTER_API_KEY your_key`
- Ou env vars: `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`

### Features Principais
- **Memória persistente** — lembra o que aprendeu entre sessões
- **Skills auto-geradas** — cria e melhora procedimentos durante uso
- **15+ plataformas** — Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Email, SMS, Teams...
- **6 backends de terminal** — Local, Docker, SSH, Daytona, Singularity, Modal
- **Subagentes** — delega trabalho em paralelo com isolamento
- **Sandbox real** — container hardening e namespace isolation
- **Web/Browser** — search, automation, vision, image gen, TTS
- **MCP support** — conecta com qualquer MCP server
- **Cron/Scheduled** — automações agendadas em linguagem natural
- **Voice Mode** — interação por voz em CLI, Telegram, Discord

### Integração com Nexus
- **Requer WSL2** no Windows (não roda nativo)
- Instalador detecta WSL automaticamente
- Comando `hermes` fica em `~/.local/bin/hermes`
- Config em `~/.hermes/`
- Processo interativo (REPL) — precisa de stdin piping

---

## 5. Benchmarking Visual: Onboarding Flows

### Referência 1: Cursor IDE
- Onboarding wizard de 3 passos
- Seleção de modelo (GPT-4, Claude, etc.) com cards visuais
- API key input com validação inline
- Terminal embutido para preview de comandos
- Branding: Dark mode, roxo/azul neon

### Referência 2: Warp Terminal
- Setup interativo do terminal
- Detecção automática de tools instaladas
- Progresso visual step-by-step
- Branding: Dark mode, gradientes sutis, tipografia bold

### Referência 3: Vercel Dashboard
- Onboarding de projeto com Git integration
- CLI install via `npm i -g vercel` mostrado inline
- Auth via browser redirect automático
- Branding: Preto/branco minimalista premium

---

## 6. Branding Atual do Nexus (Manter)

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg-primary` | `zinc-950` (#09090b) | Background principal |
| `--primary` | Neon Teal `#00F5E6` | Acentos, CTAs, bordas ativas |
| `--accent` | Amber `#FFBF00` | Warnings, destaques secundários |
| `--text-primary` | `#FAFAFA` | Texto principal |
| `--text-secondary` | `#A1A1AA` | Texto secundário |
| `--text-muted` | `#71717A` | Labels, captions |
| `--border` | `rgba(255,255,255,0.06)` | Bordas de painéis |
| **Font Heading** | Space Grotesk | Títulos |
| **Font Body** | Inter | Corpo |
| **Font Mono** | JetBrains Mono | Terminal |

**Estilo**: Liquid Tactical Noir — glassmorphism escuro com neon teal.
