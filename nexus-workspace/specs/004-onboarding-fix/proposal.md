# Onboarding Orchestration Fix

## Objective
Establish a functional, bug-free onboarding experience for the Nexus Agency Studio that correctly spawns and streams terminal sessions (Gemini CLI, OpenClaw, Hermes) via Server-Sent Events (SSE) and handles backend database persistence seamlessly.

## Context & Problem
The current onboarding flow experienced critical failures:
1. `POST /api/setup/spawn` returned 404 Not Found, despite being registered in `index.ts`.
2. `POST /api/config/set` returned 500 Internal Server Error due to a Prisma Unique Constraint violation on the `Config` model's ID field.
3. The Express routing structure and Prisma schema generated stability blockers preventing a complete end-to-end "Gemini CLI" authentication loop in the browser.

## User Stories
- As a user, I want to click "Iniciar Setup" on the Gemini CLI engine and see a live terminal streaming its authentication flow without network errors (404).
- As a user, I want the system to successfully save my engine preference to the SQLite database without causing a 500 Unique Constraint error.

## BDD Scenarios

### Cenário: Configuração de Engine Salva com Sucesso
- **Given:** O banco de dados SQLite está limpo e a migration corrigida.
- **When:** O frontend envia `POST /api/config/set` com `{ "key": "engine", "value": "gemini-cli" }`.
- **Then:** O backend cria o registro com um UUID único e retorna `200 OK`.

### Cenário: Orquestração de Setup CLI Sem 404
- **Given:** O backend está rodando no porto 3000 com o Express configurado corretamente.
- **When:** O frontend envia `POST /api/setup/spawn` com `{ "command": "gemini", "args": ["auth"] }`.
- **Then:** O backend intercepta a rota, spawna a CLI interativa e retorna um `sessionId` com status `200 OK`.
