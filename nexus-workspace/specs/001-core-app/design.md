# Design Spec: Nexus Agency Studio

## Filosofia de Design e Estética (UX/UI 2026)
- **Apple Liquid Glass & Maximalismo Tátil:** Painéis com `.backdrop-blur-xl`, cores vibrantes e dopamínicas contrastando com fundos Dark Technical.
- **Microinterações e Motion:** O sistema terá feedback de estado em todas as interações. Quando o modelo processar um RAG, o usuário verá o fluxo de "buscando na memória" com animações suaves e imersivas.

## Arquitetura de UI (Stitch MCP)

### 1. Onboarding Premium ("A Primeira Impressão")
- Fluxo guiado tela a tela com animações hero (Framer Motion).
- **Passo 1:** Boas-vindas à "Nova Era" da sua Agência.
- **Passo 2:** Conexão Agnóstica - Fornece caixas de código prontas (ex: `wsl gemini-cli -p`) com botões "Copy" em uma interface de vidro, ensinando o usuário exatamente como colar e configurar a comunicação.
- **Passo 3:** Setup da Memória - Input visual elegante para apontar a rota da pasta do `Obsidian Vault` (`04_Vault`).
- **Passo 4:** Sincronização dos Agentes (lendo os arquivos JSON da pasta `02_Agents`).

### 2. Dashboard da Agência (Hierarchy Map)
- Visualização de **Nós Conectados** (estilo React Flow) mostrando quem é o Manager (C3PO) e quem são os workers subordinados (Coder-v1, Vendedor, Prospector).
- Linhas com animações pontilhadas em movimento mostram tarefas transitando ativamente entre eles.

### 3. Painel de Interação Individual (Chat Room)
- Ao invés de um chat monolítico, a UI permite abrir a "Sala" de cada agente específico.
- **Context Awareness Indicator:** Um pequeno ícone no header do chat do agente que pisca ou brilha (pulse neon) quando ele acessa arquivos do RAG/Obsidian para responder.
- Renderização limpa e premium do markdown, suportando sintaxes avançadas, syntax highlight para código e respostas estruturadas.

## Arquitetura de Backend / Database (Supabase MCP & RAG)

### Memória "Quase Perfeita" (O Motor Cognitivo)
Para que os agentes tenham histórico real e contexto de negócios, a aplicação utilizará:
- **Vector Database Local:** Uma instância embutida leve (ex: LanceDB, ChromaDB local, ou Supabase pgvector caso seja acoplado no cloud) para guardar embeddings de todas as notas do Obsidian.
- **Pipeline RAG:**
  1. Varredura e indexação contínua da pasta `04_Vault`.
  2. Cada prompt enviado para o agente faz uma busca semântica antes, injetando silenciosamente os chunks de contexto no system prompt da chamada.
- **Persistência de Histórico de Chat:**
  - Armazenamento em um banco SQLite local (ou Supabase) das tabelas `chat_sessions` e `messages`, permitindo que ao fechar a UI e reabrir amanhã, a memória tática de conversa do agente "Coder-v1" esteja preservada.

### Conectores Agentes x Plataforma (Sem Docker)
- O backend rodará os processos e passará os comandos recebidos pelas rotas REST/WS diretamente para o executor do host (via child_process), injetando os argumentos salvos durante o Onboarding (ex: `wsl`, `gemini-cli`, `-p`).
