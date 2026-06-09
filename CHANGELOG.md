# Changelog

## [2026-06-09]
- **[003-ui-redesign-instrument-sans]** Spec finalizada e arquivada (Redesign Clean Banking/Travel).
  - Remoção total do estilo "Liquid Glass", animações excessivas e elementos "AI-look".
  - Implementação global da fonte `Instrument Sans`.
  - Refatoração da paleta de cores para Solid Light (`#f5f6f7` bg, `#ffffff` cards) e Dark mode, com acento verde vibrante.
  - Criação da navegação mobile em formato flutuante (Pill Nav) e correção de overflow-x na Landing Page.
- **[002-maquina-saas-iptv]** Spec finalizada e arquivada (Fase 1: A Máquina de SaaS IPTV).
  - Modelagem estrita das tabelas dinâmicas: `onboarding_devices`, `onboarding_steps`, `subscription_plans`, `support_solutions`.
  - Configuração de banco de dados 100% dinâmico (Fricção Zero) com tutoriais injetados de Sideloading (Roku), Shortcodes (Firestick) e DNS (Smart TVs).
  - Criação de UI React/TanStack Router com Transições Imersivas (Dark Technical + Liquid Glass).
  - Criação das Edge Functions `create-trial` e `payment-webhook` para automatizar painel Xtream.
- **[023-backend-admin-real-data]** Spec finalizada e arquivada.
  - Correção de RLS e tipagens do banco de dados (Adição de coluna `nome` e tabela `integrations`).
  - Refatoração total do Painel Admin (`/admin/servidores`, `/admin/planos`, `/admin/index`) para utilizar dados reais do Supabase.
  - Adição da tela de Integrações (Asaas API Keys) e edição de perfis de usuário, operando em paralelo (Frontend/Backend) sob a Metodologia AI Tech Lead.

## [2026-06-08]
- **[008-admin-web-dashboard]** e **[009-admin-login-transitions]** Specs finalizadas e arquivadas. 
  - Restauração rigorosa da Master Spec "Minimalismo Claro". Remoção do tema Neon Green.
  - Otimização do Dashboard do Cliente com Skeletons (fim do travamento em banco de dados).
  - Criação de Transições Espaciais (Spatial Navigation com Framer Motion).
  - Resolução do problema de Permissão de Admin e construção da Interface Widescreen para gestão (AdminSidebar e Layout 100% Web).
- **[002-dynamic-config]** Spec finalizada e arquivada. 
  - Módulo de Configurações Dinâmicas totalmente implementado.
  - Criadas Edge Functions para Resiliência de Servidores (Fallback) e Renovação de Assinaturas.
  - Painel Admin estruturado com rotas dinâmicas (`/admin/servidores`, `/admin/planos`, `/admin/onboarding`).
  - Player Interativo integrado na Landing Page (consumindo YouTube e `onboarding_steps`).
  - Resolução de dependências do TailwindCSS Vite Plugin e fluxos de Autenticação.

## Histórico Anterior
- **[001-kicktv-saas]** Implementação inicial da Landing Page e estrutura do sistema.
