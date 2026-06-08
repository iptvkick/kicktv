# Tasks: Nexus Agency Studio

Esta lista contém os passos granulares para a implementação da aplicação.

## Fase 1: Core de Execução e Banco Local
- [ ] Inicializar o projeto (Vite + Node/Express).
- [ ] Configurar o banco de dados local SQLite (Prisma ou Drizzle) para gerenciar `agents`, `chat_sessions`, `messages`, e `configs`.
- [ ] Criar o engine de subprocessos no backend (agnóstico, que roda as ferramentas diretamente no OS via child_process sem amarras de Docker).

## Fase 2: O Cérebro (Memória e RAG)
- [ ] Implementar integração com banco de vetores (ex: LanceDB/Chroma local) para armazenar embeddings.
- [ ] Criar rotina (cron ou manual na UI) que varre a pasta `04_Vault` e sincroniza o markdown do Obsidian para o banco de vetores.
- [ ] Implementar a lógica de pipeline no envio de prompts:
  1. O usuário digita a mensagem no chat do Agente.
  2. O backend converte a mensagem em query vetorial e busca o contexto no RAG.
  3. O backend constrói o payload final injetando as memórias relevantes e o envia ao OpenClaw/Gemini CLI.

## Fase 3: UX/UI Design System & Onboarding Premium (Stitch MCP)
- [ ] Criar o Design System com TailwindCSS (Apple Liquid Glass, cores vibrantes de contraste, tipografia forte e microinterações).
- [ ] Construir o **Onboarding Premium**:
  - Telas guiadas com animações de transição.
  - Tela de conexão do Gemini CLI/OpenClaw oferecendo os "pré-comandos copiáveis" para facilitar o setup.
  - Seletor visual da pasta do `Obsidian Vault`.

## Fase 4: Agency Hierarchy & Chats Individuais
- [ ] Criar o Dashboard visual (Agency Map) mostrando os agentes e a hierarquia ativa.
- [ ] Desenvolver a interface de Chat Individual:
  - Uma sidebar navegável exibindo os agentes disponíveis.
  - Uma tela de chat focada com histórico infinito preservado e renderização impecável de Markdown.
  - Feedback visual (pulse) no chat quando a memória/RAG está sendo acessada.

## Fase 5: Testes Integrados e Delegação
- [ ] Simular um ciclo de vida real: Falar com o C3PO (Manager), ele delegar para o Coder-v1 (via OpenClaw), os dados retornarem à UI e o RAG ser utilizado para buscar especificações anteriores no Vault.
- [ ] Revisão geral de performance, refinamento do CSS e garantia de que tudo roda independentemente do Docker e sem as velhas falhas do Paperclip.
