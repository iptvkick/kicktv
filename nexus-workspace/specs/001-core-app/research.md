# Research & Context: Nexus Workspace (Modern Paperclip Alternative)

## Contexto do Usuário e Problema Atual
O usuário precisa de uma aplicação local equivalente ao "Paperclip" (um workspace de IA/agentes) em sua essência e objetivo, mas com os seguintes diferenciais críticos:
1. **Design e UX Avançados**: A interface atual do Paperclip é percebida como simples, feia, sem vida, sem animações, pouco original e nada intuitiva. O novo app deve ser moderno, vibrante, com animações fluidas e altamente intuitivo.
2. **Integração Flexível**: Deve permitir conectar facilmente ferramentas de CLI (como Gemini CLI), OpenClaw e Hermes.
3. **Resolução de Gargalos Técnicos**: O Paperclip atual força o uso de um adapter `gemini_local` que exige Docker e utiliza sintaxe antiga do Gemini CLI (faltando o `-p`, obrigatório fora de ambientes interativos).
4. **Ambiente do Usuário**: O usuário já configurou perfeitamente o Gemini CLI rodando liso no WSL, com Node, autenticação, JSON e agentes baseados em arquivos. O problema é estritamente a rigidez do Paperclip que insiste em comandos obsoletos e chamadas ao Docker.

## Benchmarking e Solução Proposta
- **Paperclip**: Focado em ser um frontend genérico para modelos. Pecados: design monótono, configuração rígida presa a setups antigos com Docker, sem gestão robusta de memória ou rede de agentes.
- **Nova Solução (Nexus Agency Studio)**: Uma plataforma completa para gerenciar uma agência de IA autônoma. Muito além de um simples chat, é um quartel general onde o Diretor orquestra uma hierarquia viva de agentes (C3PO, Coder-v1, Prospector, Vendedor).
- **Agnosticismo de Execução**: Backend leve em Node.js executa comandos CLI de forma configurável, respeitando o ambiente WSL nativo do usuário sem assumir a presença de Docker. Fornece pré-comandos copiáveis no onboarding para zero atrito.
- **Memória Quase Perfeita (RAG + Obsidian)**: O sistema absorverá contexto do `04_Vault` via Embeddings (ChromaDB ou LanceDB), garantindo que cada agente possua acesso dinâmico e cirúrgico à memória tática e histórica da empresa.

## UX/UI (Baseado em ux-ui-architect-2026)
- **Apple Liquid Glass & Dark Technical**: Interface translúcida, texturas de vidro, desfoque dinâmico e estética Dark Mode moderna (Zinc/Slate + Accent Colors neon como Teal/Violet).
- **Gamificação e Microinterações**: Botões e inputs responsivos, estados de carregamento elegantes, transições suaves (Framer Motion).
- **Acessibilidade**: Foco claro, contraste WCAG 2.2+, tipografia forte (Inter, Outfit).

## Conclusão da Pesquisa
O sistema não será apenas um "corretor de bugs" do Paperclip, mas uma **reinvenção da experiência do desenvolvedor/usuário** ao interagir com agentes. A configuração das conexões CLI/OpenClaw/Hermes será feita de forma amigável através da UI, abstraindo configurações complexas e focando na usabilidade.
