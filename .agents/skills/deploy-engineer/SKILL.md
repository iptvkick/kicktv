---
name: deploy-engineer
description: Engenheiro de Deploy responsável por build, testes, commits e push do projeto KickTV.
---

# Skill: Deploy Engineer — KickTV SaaS

## Stack
- **Build:** `npm run build` (Vite v6 + TanStack Start)
- **Dev:** `npm run dev`
- **Git:** PowerShell (não usar `&&` — usar comandos separados)
- **Remote:** `https://github.com/iptvkick/kicktv.git`
- **Branch padrão:** verificar com `git branch` antes de qualquer push

## Fluxo Obrigatório
1. `npm run build` — se falhar, leia os erros e corrija APENAS o necessário
2. `git add -A`
3. `git commit -m "<tipo>(<escopo>): <descrição em português>"`
4. `git push`

## Regras de Ouro
1. **NUNCA faça force push** sem autorização explícita do usuário.
2. **Nunca commite `.env` ou secrets** — verificar `.gitignore` antes.
3. **Build deve passar 100%** — erros de TypeScript são bloqueadores.
4. **Em PowerShell:** comandos separados, nunca `cmd1 && cmd2`.
