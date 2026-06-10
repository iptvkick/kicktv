# Spec 021: Quality Assurance & Validation (Checkout)

## Requisitos
O usuário reportou falhas contínuas de integração com banco de dados e Asaas ("DB Error: permission denied for table subscriptions"). Para não dependermos de "tentativa e erro" manual, precisamos estabelecer uma bateria de testes rigorosos com múltiplos agentes.

Os objetivos desta Spec são:
1. **Auditoria de RLS (Row Level Security):** O `database-engineer` deve auditar rigorosamente as políticas das tabelas `subscriptions`, `invoices`, `plans` e `profiles`.
2. **Correção Definitiva de Insert/Update:** Garantir que as Edge Functions, mesmo rodando com a `service_role_key` ou `anon_key`, possuam permissão incondicional no schema `public` via SQL Grants corretos.
3. **Validação Simples:** O `backend-engineer` deverá escrever um script local em TypeScript/Deno para invocar a função `asaas-checkout` passando payloads mockados e validar a resposta (Status 200 e payload de QR Code) **ANTES** de devolver a demanda para o usuário testar no navegador.

## User Stories
- **Como** administrador do sistema, **quero** que os desenvolvedores virtuais auditem o banco de dados e executem testes end-to-end simulados **para** que eu não perca tempo testando recursos quebrados em tela.
- **Como** cliente final, **quero** clicar em assinar e ver meu QR Code na hora, sem exceções de banco de dados.

## Critérios de Aceite
1. Nenhuma Edge Function deve retornar 400 ou 500 por erro de SQL ou RLS.
2. Scripts de teste devem confirmar a geração correta de PIX via API do Asaas e a inserção no banco de dados.
3. As migrations de RLS e GRANTS devem estar impecavelmente configuradas no Supabase.

## BDD Scenarios

### Cenário: Geração de Assinatura Completa
- **Given:** Que o usuário X não tem assinaturas e clica no plano Y.
- **When:** A Edge function `asaas-checkout` é acionada.
- **Then:** O cliente Asaas é criado, a subscription Asaas é gerada, a subscription local é salva na tabela com sucesso e a Edge Function retorna a imagem Base64 do QR code.
