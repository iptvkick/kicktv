# Research: Admin UI, SDD Alignment & Redirection Fix

## Contexto e Desafios (RPI-R)
1. **Quebra de SDD (Estilo Visual):** O usuário reclamou que o design atual ficou "verde" (Neon Dopamine / Dark Mode) implementado pelas regras do UX-UI 2026, porém o **Software Design Document (SDD)** original exige um estilo "Clean Card-Based" Light Mode (`#f5f6f7` background, texto `#212529`). É imperativo reverter a tipografia e cores para as especificações do SDD.
2. **Ambiente Incorreto (`localhost:8080` vs `kicktv-saas`):** O usuário está visualizando a aplicação gerada pelo Lovable na raiz do projeto (que usa Vite na porta 8080), enquanto a regra #5 do SDD afirma que o desenvolvimento **deve ocorrer na pasta `kicktv-saas`** (Next.js App Router). Todo o código que estava no root (que eu portei recentemente) será desconsiderado, e o usuário precisará rodar o Next.js.
3. **Falta de Redirecionamento por Role:** O fluxo de autenticação atual (`GoTrue`) envia todos os logins diretos para `/cliente/dashboard`. A lógica não está verificando a tabela `profiles` (se `role === 'admin'`) para fazer o roteamento correto para `/admin/dashboard`.
4. **Telas Incompletas e Logout:** As telas secundárias do admin não foram construídas e o botão de logout deve estar visível e de fácil acesso na barra de navegação ou no perfil.

## Benchmarking (Revisitando o SDD original)
- **Top Navigation:** Branca/Clean com saudação simples e Avatar.
- **Bottom NavBar:** Uma "pílula" Dark Charcoal (`#212529`) com ícones brancos para a navegação.
- **Background:** Cinza claríssimo/Branco (`bg-zinc-50`).

As alterações da Fase 3 e 4 devem ser refatoradas no projeto `kicktv-saas` para respeitar essa constituição.
