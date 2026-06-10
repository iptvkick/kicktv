# Proposal: Spec 013 (Bugfixes & Profile CPF)

## Requisitos
- **REQ-01 (Swipe Fix):** A tela `dashboard.tsx` deve responder aos swipes sem ser bloqueada pelo navegador no mobile.
- **REQ-02 (Database CPF):** Adicionar a coluna `cpf` (VARCHAR) na tabela `profiles`.
- **REQ-03 (UI Perfil):** A seção "Dados Pessoais" dentro de `perfil.tsx` (ou subtela) deve possuir campos de input editáveis e um botão de Salvar para gravar as informações (Nome/Email/CPF) usando Supabase.

## User Stories
1. **Como Cliente**, quero clicar em "Dados Pessoais" no meu Perfil, preencher meu CPF e Salvar, para que minhas faturas do Asaas saiam formatadas corretamente e meu acesso não seja bloqueado por falta de dados.
2. **Como Cliente no Celular**, quero poder arrastar a tela Início para a esquerda sem que a tela "fique presa".
