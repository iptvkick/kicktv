# Feature Proposal: Nexus Overhaul (RAG, Flow, and Chat UX)

## 1. Requisitos Principais

1. **AgentFlowCanvas Persistente e Estável**:
   - Atualizações no React Flow não podem recriar os nós na interface até que o usuário troque de página ou solicite ativamente.
   - O drag-and-drop de conexões e reposicionamentos deve salvar suavemente no backend sem fazer o canvas piscar ou desfazer ações.
   
2. **Integração Real do RAG Vault**:
   - `FileTree` deve puxar a listagem real do diretório Vault local via `/api/vault/tree`.
   - `MindGraph` deve refletir nós de arquivos interligados baseados nos links (ex: `[[file]]`) dentro dos arquivos reais.

3. **Nova Interface Dedicada para Chats**:
   - Criar uma página `Chats` e adicionar um atalho claro na Sidebar lateral para que os usuários possam acessar rapidamente as conversas com cada agente, limpando histórico e criando novos fluxos com a mesma facilidade do projeto OpenClaw.

4. **Resolução de Logs e Comunicação do Gemini-CLI**:
   - O `engine.ts` deve processar a stdout/stderr da chamada CLI do gemini de forma robusta e garantir que a resposta do agente retorne ao frontend perfeitamente, sem falsos positivos de falha.
   - O log do dashboard deve expor mensagens úteis em vez de blocos genéricos.

## 2. User Stories

- **US1**: Como usuário, quero arrastar meus agentes pelo canvas e conectá-los sem que eles voltem imediatamente para a posição original, para que eu possa gerenciar a hierarquia confortavelmente.
- **US2**: Como usuário, quero abrir a aba Vault e ver minhas pastas reais do computador na barra lateral esquerda.
- **US3**: Como usuário, quero clicar na aba "Chats" na barra lateral para ver minha lista de agentes e iniciar uma conversa nova limpando o histórico com 1 clique.
- **US4**: Como desenvolvedor e usuário, quero ter certeza de que as respostas do Gemini estão chegando na tela de chat perfeitamente.

## 3. BDD Scenarios

### Cenário: Arrastando e salvando a posição de um Agente
- **Given (Dado):** O usuário está na tela de Agentes (`/agents`) visualizando o AgentFlowCanvas.
- **When (Quando):** O usuário arrasta o nó de um agente (ex: "Worker 1") para a esquerda e solta o clique do mouse.
- **Then (Então):** A posição é enviada em background via PUT para `/api/agents/:id`, a tela NÃO recarrega bruscamente, e o nó permanece na nova posição permanentemente.

### Cenário: Navegação Real no Vault
- **Given (Dado):** O backend foi configurado com um caminho válido em `vaultPath`.
- **When (Quando):** O usuário acessa a rota `/vault`.
- **Then (Então):** A `FileTree` na esquerda exibe pastas e arquivos reais (ex: `knowledge_base`, `guidelines.md`).

### Cenário: Acesso facilitado ao Chat
- **Given (Dado):** O usuário está em qualquer lugar do painel Nexus.
- **When (Quando):** O usuário clica no item "Chats" na barra lateral esquerda.
- **Then (Então):** Uma tela nova se abre listando todas as sessões recentes ou permitindo escolher um agente da lista para iniciar imediatamente uma troca de mensagens, similar ao layout do OpenClaw.

### Cenário: Comunicação Real com o Motor (Gemini)
- **Given (Dado):** O agente tem um system prompt configurado e o gemini-cli está autenticado.
- **When (Quando):** O usuário envia "Qual o dia de hoje?" no input da tela de Chat.
- **Then (Então):** A mensagem aparece no balão do usuário, e logo em seguida o balão do assistente exibe a resposta textual gerada pelo Google Gemini, deixando o status da missão como `done`.
