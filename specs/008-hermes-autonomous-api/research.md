# Research (RPI-R) - Integração Autônoma Hermes (Supabase REST)

## Contexto do Projeto
O CrivoCerto v2.0 foi arquitetado com uma separação clara entre o frontend (React/Vite/TanStack Router) e o backend (Supabase PostgreSQL + Edge Functions). Na especificação anterior (`006`), implementamos a estrutura inicial do banco de dados (`posts`, `categories`, `clicks_tracking`) e uma Edge Function básica (`agent-publish`) que serviu de prova de conceito.

## Desafio Atual
O usuário possui uma IA autônoma chamada "Hermes" (baseada na Agência B2B, mas adaptada para o CrivoCerto) que precisa ter a capacidade de:
1. **Publicar conteúdo:** Inserir posts formatados diretamente no banco de dados.
2. **Consultar dados:** Puxar o status de posts, ler categorias e tendências.
3. **Agendamento (Autonomia):** Ser ativada automaticamente de tempos em tempos sem intervenção humana.

## Pesquisa de Soluções Arquiteturais
Para que o Hermes (que provavelmente roda em um ambiente como n8n, Langchain, ou servidor próprio Node.js/Python) interaja nativamente com o CrivoCerto, temos as seguintes opções:

### 1. Supabase PostgREST API (A Melhor Escolha)
O Supabase expõe *automaticamente* todas as tabelas e views do PostgreSQL como uma API RESTful completa via [PostgREST](https://postgrest.org/).
- **Vantagens:** O Hermes não precisa de endpoints customizados (Edge Functions) para fazer o básico (CRUD). Ele pode usar métodos HTTP diretos (GET, POST, PATCH) para interagir com a tabela `posts`.
- **Autenticação:** O Hermes usará a `SUPABASE_SERVICE_ROLE_KEY` (Chave Admin) como um token Bearer (`Authorization: Bearer <token>`) para ignorar o RLS (Row Level Security) e ter controle total.

### 2. Supabase pg_cron (Agendamento Nativo)
Para que o Hermes seja ativado "toda hora", o banco de dados pode assumir o papel de orquestrador.
- O PostgreSQL suporta a extensão `pg_cron`.
- Podemos configurar um cron job diretamente no banco do Supabase que dispara uma requisição HTTP POST (via extensão `pg_net`) para o webhook do Hermes (ex: webhook no n8n) ou para uma Edge Function que atua como proxy para a IA.

### 3. Edge Functions (Para Lógica Complexa)
Se o Hermes for apenas um "cérebro" de LLM e precisar que o Supabase cuide de integrações de terceiros (ex: pesquisar na Amazon, Google Trends, e então injetar a resposta no LLM), podemos manter a Edge Function `agent-publish` como um backend BFF (Backend for Frontend/AI). 
- A Edge Function centraliza chaves de API ocultas.
- Ela pega as *trends*, envia o prompt para o Hermes via API, recebe o review e salva no banco.

## Benchmark Visual/Funcional de Integrações de IA
Concorrentes de portais autônomos (Newsletters geradas por IA, portais de deals automatizados) geralmente possuem:
- **Painel de Auditoria:** Onde o humano pode ver *o que* a IA gerou e aprovar/reprovar (no nosso caso, o painel `/admin/posts` já tem o início disso).
- **Múltiplos Status:** `draft` (necessita aprovação), `published` (aprovado ou publicado direto).

## Conclusão da Pesquisa
O caminho de menor fricção e maior escalabilidade é fornecer ao Hermes acesso **direto e cru** à API PostgREST do Supabase usando a chave Service Role, aliado à configuração da extensão `pg_net` e `pg_cron` no Supabase para criar o "batimento cardíaco" (heartbeat) do sistema, acionando o Hermes a cada X horas.
