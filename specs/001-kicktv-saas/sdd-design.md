# Software Design Document (SDD) — KickTV SaaS

Este documento segue os princípios de Especificação Orientada a Design (SDD) e servirá como a "Constituição Visual e Sistêmica" para a implementação do KickTV SaaS.

## 1. Diretrizes de Design Visual (Baseado na Referência)

A interface deve ser **mobile-first**, garantindo responsividade fluida para Web, Tablet e Mobile. A referência de UI fornecida adota um estilo "Clean Card-Based", com foco em espaços em branco (negative space), bordas super arredondadas e navegação minimalista.

### 1.1 Tipografia
- **Família Tipográfica Principal:** `Instrument Sans`
- **Uso:** Deve ser utilizada em toda a aplicação (Headings, Body, Labels).

### 1.2 Paleta de Cores
A paleta abandona o "Neon Dopamine" anterior em favor de um minimalismo elegante e de alto contraste:
- **Primary Text / Active Elements / Floating Bars:** `#212529` (Dark Charcoal)
- **Background Principal:** `#f5f6f7` (Light Grayish-White)
- **Cards / Containers Secundários:** `#ffffff` (Pure White)
- *Nota:* O Dark Mode pode inverter a lógica, mas o MVP iniciará com este Light Mode premium.

### 1.3 Estrutura de Interface (Mobile-First)
- **Top Navigation:** Minimalista, contendo saudação ("Olá, [Nome]") e Avatar.
- **Pills de Navegação:** Botões arredondados (ex: `IPTV`, `VOD`, `Suporte`) com o estado ativo usando fundo `#212529` e texto `#ffffff`.
- **Cards de Conteúdo (Hero/Features):** 
  - Bordas com raio grande (`rounded-3xl` ou `24px`).
  - Imagens de fundo com gradiente sutil para legibilidade do texto.
  - Botão de ação (ex: "Ver Credenciais") integrado fluidamente ao card.
- **Floating Bottom Navigation:** Uma "pílula" flutuante (floating pill) na parte inferior da tela, na cor `#212529`, com ícones brancos para navegação principal (Início, Player, Suporte, Perfil). No desktop, isso se converte em uma Sidebar lateral ou Topbar expandida.
- **Bottom Sheets / Modais:** Botões de ação principal (CTA) como "Renovar Assinatura" ou "Pagar via Asaas" devem ser grandes, pretos (`#212529`), e fixados na parte inferior da tela durante os fluxos de checkout.

## 2. Tradução da UI para o Contexto KickTV

1. **Página Inicial / Dashboard do Cliente:**
   - **Greeting:** "Olá, João" + Avatar.
   - **Hero Card:** Status da assinatura (Ex: "Ativo - Vence em 15 dias"). Fundo escuro ou imagem temática, botão interno "Assistir Agora".
   - **Sessões (Upcoming):** Faturas pendentes, Notícias do servidor, ou atalhos para Suporte (Day 1 / Day 2 logic adaptado para tutoriais de Onboarding).

2. **Área de Onboarding (Landing):**
   - Segue a estrutura de "Tour schedule". O cliente seleciona o dispositivo em listas expansíveis (Accordions) minimalistas com ícones correspondentes.
   - CTA Gigante fixado no rodapé: "Gerar Teste Grátis".

## 3. Especificação do Sistema (Backend & Lógica)

- **Stack:** Next.js (App Router), Tailwind CSS, Shadcn UI (com tokens customizados para `#212529` e `Instrument Sans`).
- **Gateway de Pagamento:** Integração com **Asaas** (Webhooks para confirmar pagamento PIX e acionar a renovação automática).
- **Banco de Dados (Supabase):** 
  - Tabela `profiles` (Auth).
  - Tabela `iptv_subscriptions` (Credenciais Xtream).
  - Tabela `payments` (Logs do Asaas).
  - Tabela `support_tickets` (Sistema de Self-Healing).
- **Edge Functions:** A ponte segura entre o Frontend e a API Xtream. Nenhuma chamada Xtream ocorre no cliente.

## 4. Regras do SDD (Constituição do Agente)
- Não escreveremos código diretamente na raiz do workspace, o projeto será iniciado na pasta `kicktv-saas`.
- Os componentes devem refletir fielmente as imagens importadas (raios de borda, padding generoso, tipografia geométrica).
- A cada finalização de fase de implementação, um teste de aceitação deve passar antes do commit.
