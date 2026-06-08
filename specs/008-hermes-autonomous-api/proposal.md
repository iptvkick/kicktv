# Proposal (ID: 008-hermes-autonomous-api)

## O Problema
O Agente IA ("Hermes") foi projetado para atuar como o publicador autônomo do portal CrivoCerto, mas no momento lhe falta a conexão direta com o banco de dados e um gatilho confiável (o "despertador") para que ele funcione sem interrupções (24/7), consumindo APIs, publicando e auditando dados.

## A Solução Proposta
Configuraremos a arquitetura do Supabase para funcionar nativamente como o cérebro relacional e orquestrador do Hermes.

1. **Exposição da API RESTful Completa:** O Supabase já possui o `PostgREST`. Iremos documentar/habilitar o uso dessa API para que o Hermes use requisições padrão (GET, POST, PATCH) para manipular a tabela de `posts` sem precisar de um servidor intermediário rodando.
2. **Sistema de Heartbeat via pg_cron + pg_net:** Criaremos um cron job dentro do próprio PostgreSQL do Supabase que realizará requisições HTTP (`pg_net.http_post`) para o servidor do Hermes (ex: endpoint de webhook) a cada hora, informando que é "hora de publicar".
3. **Gerenciamento de Estado do Agente:** Criação de uma tabela `agent_jobs` para rastrear o que o Hermes está fazendo (ex: Status: `pesquisando`, `gerando_texto`, `falha`).

## Requisitos de Negócio (BRDs)
- **BRD01:** O sistema deve permitir que um agente externo faça CRUD na tabela de posts de fora da aplicação Vite.
- **BRD02:** O agente não deve estar submetido às regras de RLS públicas, tendo permissões de "Administrador / Service Role".
- **BRD03:** O Supabase deve atuar como o *Scheduler* (Cron Job), acordando o Hermes autonomamente em intervalos definidos sem depender de Vercel/Cloudflare CRONs (que têm tempo de timeout curto).
- **BRD04:** As credenciais devem ser rotacionáveis e seguras, armazenadas de forma padronizada.

## User Stories
1. **Como Agente Autônomo (Hermes),** eu quero realizar chamadas HTTP diretas na rota `/rest/v1/posts` usando minha Service Role Key, para inserir novos reviews diretamente na produção.
2. **Como Agente Autônomo (Hermes),** eu quero receber um ping (POST) a cada 2 horas do servidor de banco de dados (`pg_cron`), para que eu saiba que devo iniciar meu fluxo de busca de produtos e redação de conteúdo.
3. **Como Administrador Humano,** eu quero visualizar no painel `/admin` os últimos trabalhos executados pelo Hermes na tabela `agent_jobs`, para auditar falhas ou sucessos.

## BDD Scenarios

### Cenário: Hermes Inserindo Post via REST API (PostgREST)
- **Given (Dado):** O agente gerou o conteúdo JSON final de um review do produto X.
- **When (Quando):** O agente envia uma requisição `POST` para `https://<id>.supabase.co/rest/v1/posts` com o header `Authorization: Bearer <Service_Role_Key>` e o corpo da mensagem.
- **Then (Então):** O Supabase ignora as regras de RLS (pois é Service Role), insere o registro no banco com status `published` e retorna `HTTP 201 Created`.

### Cenário: Automação via pg_cron Acorda o Agente
- **Given (Dado):** O relógio do banco de dados atinge a hora exata programada (ex: `0 * * * *` para rodar toda hora).
- **When (Quando):** O serviço interno do PostgreSQL (`pg_cron`) dispara a query agendada invocando a função `net.http_post`.
- **Then (Então):** Uma chamada HTTP é feita para o webhook do Hermes (`https://api.hermes.example/trigger`), iniciando o fluxo autônomo sem intervenção humana.

### Cenário: Agente Consulta Entidades Relacionadas
- **Given (Dado):** O agente precisa saber quais categorias existem antes de postar.
- **When (Quando):** O Hermes envia uma requisição `GET` para `https://<id>.supabase.co/rest/v1/categories?select=id,name`.
- **Then (Então):** A API do Supabase retorna um JSON array limpo contendo as categorias disponíveis, permitindo que o Hermes direcione o post corretamente.
