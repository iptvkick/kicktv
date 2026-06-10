# Spec 008: E2E Agentic Testing (QA Pipeline) - Tasks

## [ ] Instalação e Configuração (`deploy-engineer` ou `frontend-engineer`)
- [ ] Instalar o Playwright (`npm i -D @playwright/test`)
- [ ] Rodar a instalação dos navegadores necessários (`npx playwright install chromium`)
- [ ] Criar o arquivo `playwright.config.ts` na raiz do projeto.
- [ ] Adicionar script `"test:e2e": "playwright test"` no `package.json`.

## [ ] Casos de Teste (`frontend-engineer`)
- [ ] Criar o arquivo de teste `tests/e2e.spec.ts`.
- [ ] Implementar teste E2E do fluxo de administração (onboarding, planos, servidores, configuracoes).
- [ ] Implementar teste E2E do fluxo de onboarding do cliente.
- [ ] Validar que nenhum console error ou 403 Forbidden ocorre durante os fluxos.

## [ ] Testes de Banco e Backend (`database-engineer` e `backend-engineer`)
- [ ] Criar script de teste local de queries SQL para testar RLS.
- [ ] Executar chamadas mock na API e nas Edge Functions para garantir o fluxo de pagamento/webhook e trial.

## [ ] Execução e Validação Final (`deploy-engineer`)
- [ ] Iniciar o servidor de desenvolvimento.
- [ ] Rodar os testes E2E do Playwright (`npm run test:e2e`).
- [ ] Garantir que 100% dos testes passem com sucesso.
- [ ] Desligar o servidor e documentar o walkthrough dos testes.
