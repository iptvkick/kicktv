# Proposal: Nexus Agency Studio

## Resumo
**Nexus Agency Studio** (anteriormente Nexus Workspace) é uma plataforma definitiva para orquestração visual e autônoma de agências IA locais. Inspirada nas qualidades do Paperclip (interface visual), OpenClaw (orquestração de rede de agentes) e Hermes (performance cognitiva e execução ágil), esta aplicação cria um hub central onde o usuário gerencia uma estrutura hierárquica real de agentes (ex: C3PO como manager, Coder-v1 como executor, Prospector, Vendedor). 

A diferença vital: o sistema rompe com a rigidez de dependências Docker legadas, integrando-se perfeitamente com o WSL e o Gemini CLI através de configurações agnósticas. Além disso, traz um sistema de memória implacável (Vectorização/RAG/Obsidian).

## Requisitos de Negócio e Funcionais

1. **Gestão de Agência Autônoma e Hierárquica:**
   - Criação e visualização de um organograma vivo da agência (quem reporta a quem, quem delega tarefas).
   - Delegação de tarefas via UI e acompanhamento do fluxo de execução entre agentes (ex: Manager repassando para o Coder).

2. **Memória "Quase Perfeita" (RAG + Obsidian):**
   - Integração nativa com o Vault do Obsidian (`04_Vault`).
   - Geração e consulta de Embeddings/Vectors em tempo real para contexto persistente: cada agente lembra de todo o histórico relevante da agência.
   - Banco vetorial local leve (ex: ChromaDB local, SQLite vss, ou LlamaIndex).

3. **Interação Individual com Agentes (Chat & Histórico):**
   - Painel de mensagens independente para cada agente. O usuário pode abrir o chat do "Coder-v1" e ver todo o histórico de conversas e execuções dele, ou falar com o "C3PO" (Manager) para delegar algo para a equipe.
   - Preservação perpétua do histórico utilizando o banco local/RAG.

4. **Onboarding Premium e Configuração "Zero Atrito":**
   - Um fluxo de onboarding "Liquid Glass" deslumbrante (ux-ui-architect-2026) que guia o usuário na conexão de seus executáveis locais.
   - Fornecimento de **pré-comandos copiáveis** para facilitar a integração imediata do Gemini CLI no WSL, do OpenClaw e dos adapters necessários, sem requerer que o usuário digite configurações complexas do zero.

5. **Agnosticismo de Infraestrutura (Sem Docker Obrigatório):**
   - Campos de configuração abertos (ex: Path = `wsl gemini-cli`, Args = `-p`), removendo a trava estrutural que afligia o Paperclip original.

## User Stories
- **US1:** Como Diretor da Agência, quero acessar um Onboarding deslumbrante que já me forneça os comandos exatos de conexão com meu Gemini CLI no WSL, para que eu não perca tempo adivinhando parâmetros.
- **US2:** Como Diretor da Agência, quero visualizar a hierarquia da minha equipe de IA (C3PO, Coder-v1, Prospector) em um mapa interativo e delegar tarefas no topo da cadeia.
- **US3:** Como Usuário, quero que os agentes leiam automaticamente as anotações do meu Obsidian Vault via RAG, para que eles tenham memória contextual perfeita do que já foi decidido ou documentado.
- **US4:** Como Usuário, quero poder clicar em qualquer agente específico (ex: Vendedor) e conversar apenas com ele, mantendo um histórico persistente dessa thread.

## Critérios de Aceite
- O Onboarding deve ser responsivo e seguir as animações `ux-ui-architect-2026`.
- A integração RAG deve ser capaz de indexar markdown local e responder baseada nesse contexto.
- O aplicativo não pode falhar caso o Docker não esteja em execução, utilizando os binds de CLI informados pelo usuário.
- O histórico de chat deve persistir após recarregar a aplicação.
