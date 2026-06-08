# 004 — Engine Orchestration Rework: Proposal

## Resumo Executivo

Refatoração completa do onboarding de engines do Nexus Agency Studio para uma experiência **Terminal-First nativa**. O sistema atual fabrica comandos e URLs inexistentes. Esta proposta substitui tudo por processos reais interativos, com streaming de stdout/stderr em tempo real e capacidade de enviar input (stdin) direto do navegador para o processo CLI rodando no servidor.

---

## Requisitos Funcionais

### RF-01: Instalação de Engine via Terminal
O sistema deve executar o comando de instalação de cada engine (`npm install -g @google/gemini-cli`, `npm install -g openclaw`) e exibir o output em tempo real no TerminalBlock.

### RF-02: Verificação de Engine Instalada
O sistema deve verificar se a engine já está instalada rodando o comando de versão (`gemini --version`, `openclaw --version`) e exibindo o resultado.

### RF-03: Execução Interativa de Processo
O sistema deve spawnar processos interativos (ex: `gemini`) e transmitir stdout/stderr em **tempo real** via SSE (Server-Sent Events), permitindo que o usuário veja o menu de auth do CLI.

### RF-04: Input do Usuário para Processo (stdin)
O sistema deve permitir que o usuário envie input (texto digitado) de volta ao processo em execução, para interagir com menus interativos do CLI (ex: selecionar "Sign in with Google").

### RF-05: Atalho de API Key via Env Var
Para usuários que preferem API Key, o sistema deve permitir inserir a key, setá-la como env var, e depois spawnar o CLI com essa variável no ambiente.

### RF-06: Detecção Automática de Estado
O sistema deve detectar se o CLI já está autenticado (ex: `gemini` entra direto no REPL = já autenticado) e refletir isso na UI.

### RF-07: Gerenciamento de Processos
O sistema deve permitir matar processos em execução e gerenciar sessões ativas (evitar processos órfãos).

---

## Requisitos Não-Funcionais

### RNF-01: Latência de Streaming < 100ms
O output do processo deve aparecer no terminal do browser em menos de 100ms após ser emitido pelo processo.

### RNF-02: Sem Dependências Nativas (node-pty)
Usar `child_process.spawn` com stdin pipe, evitando `node-pty` que requer compilação nativa.

### RNF-03: Cross-Platform
Funcionar em Windows nativo (PowerShell) e WSL, com detecção automática.

### RNF-04: Segurança
Whitelist de comandos permitidos. Nunca executar comandos arbitrários.

---

## User Stories

### US-01: Instalar Gemini CLI
**Como** operador do Nexus,
**Quero** clicar em "Instalar" no card do Gemini CLI,
**Para que** o sistema execute `npm install -g @google/gemini-cli` e eu veja todo o output no terminal embutido.

### US-02: Verificar Instalação
**Como** operador,
**Quero** clicar em "Verificar" no card de uma engine,
**Para que** o sistema rode `<engine> --version` e me diga se está instalada.

### US-03: Autenticar via CLI Nativo
**Como** operador,
**Quero** clicar em "Iniciar Gemini" e interagir diretamente com o menu de auth do CLI no terminal embutido,
**Para que** eu escolha meu método de autenticação (OAuth, API Key, Vertex) como se estivesse no terminal real.

### US-04: Usar API Key Direta
**Como** operador,
**Quero** inserir minha GEMINI_API_KEY num campo e clicar em "Configurar e Iniciar",
**Para que** o sistema sete a env var e lance o Gemini já autenticado.

### US-05: Matar Processo
**Como** operador,
**Quero** clicar em "Parar" para encerrar um processo CLI em execução,
**Para que** eu possa reiniciar ou trocar de engine.

---

## Critérios de Aceite

| ID | Critério | Métrica |
|----|----------|---------|
| CA-01 | Instalação do Gemini CLI executa e mostra output real | Output contém "added N packages" |
| CA-02 | Verificação mostra versão real | Output contém padrão semver `v0.X.X` |
| CA-03 | Processo interativo spawna e exibe menu de auth | Output contém "How would you like to authenticate" |
| CA-04 | Stdin do browser chega ao processo | Selecionar opção no menu funciona |
| CA-05 | API Key via env var funciona | Gemini inicia sem menu de auth |
| CA-06 | Processo pode ser encerrado | Botão "Parar" mata o processo e libera porta |
| CA-07 | Zero TypeScript errors no build | `npm run build` retorna 0 |

---

## BDD Scenarios

### Cenário: Instalação bem-sucedida do Gemini CLI
- **Given (Dado):** O usuário está na tela de onboarding com "Gemini CLI" selecionado e o pacote NÃO está instalado
- **When (Quando):** O usuário clica no botão "Instalar"
- **Then (Então):** O terminal exibe em tempo real o output de `npm install -g @google/gemini-cli` e ao final mostra `✓ Instalação concluída`

### Cenário: Verificação de engine já instalada
- **Given (Dado):** O Gemini CLI já está instalado no sistema
- **When (Quando):** O usuário clica no botão "Verificar"
- **Then (Então):** O terminal exibe a versão (ex: `v0.40.1`) e o status muda para "Instalado ✓"

### Cenário: Autenticação interativa OAuth via CLI nativo
- **Given (Dado):** O Gemini CLI está instalado mas NÃO autenticado
- **When (Quando):** O usuário clica em "Iniciar Gemini" e o CLI apresenta o menu de auth
- **Then (Então):** O terminal exibe as opções de auth, o usuário pode digitar "1" para OAuth, e o CLI abre o browser para login automaticamente

### Cenário: Autenticação via API Key (atalho)
- **Given (Dado):** O usuário possui uma GEMINI_API_KEY válida
- **When (Quando):** O usuário insere a key no campo de API Key e clica "Configurar e Iniciar"
- **Then (Então):** O sistema seta `GEMINI_API_KEY` no environment e spawna `gemini`, que inicia sem menu de auth

### Cenário: Encerrar processo em execução
- **Given (Dado):** Um processo `gemini` está rodando no terminal embutido
- **When (Quando):** O usuário clica no botão "Parar"
- **Then (Então):** O processo é terminado (SIGTERM), o terminal mostra "Processo encerrado" e o botão volta a "Iniciar"

### Cenário: Engine já autenticada detectada
- **Given (Dado):** O Gemini CLI já foi autenticado previamente
- **When (Quando):** O usuário clica em "Iniciar Gemini"
- **Then (Então):** O CLI entra direto no REPL (sem menu de auth), e o status muda para "Conectado ✓"

### Cenário: Instalação do OpenClaw
- **Given (Dado):** O usuário selecionou "OpenClaw" e o pacote não está instalado
- **When (Quando):** O usuário clica em "Instalar"
- **Then (Então):** O terminal exibe em tempo real o output de `npm install -g openclaw` e ao final mostra sucesso

### Cenário: Instalação do Hermes Agent via WSL
- **Given (Dado):** O usuário selecionou "Hermes" e o sistema está rodando em Windows com WSL2 disponível
- **When (Quando):** O usuário clica em "Instalar"
- **Then (Então):** O sistema executa via WSL2: `curl -fsSL https://raw.githubusercontent.com/.../install.sh | bash`, mostra output em tempo real, e ao final detecta o comando `hermes` disponível

### Cenário: Setup interativo do Hermes Agent
- **Given (Dado):** O Hermes Agent está instalado via WSL2
- **When (Quando):** O usuário clica em "Iniciar Setup"
- **Then (Então):** O terminal spawna `wsl hermes setup`, exibe o wizard interativo de configuração, e o usuário pode selecionar provider/modelo pelo terminal embutido
