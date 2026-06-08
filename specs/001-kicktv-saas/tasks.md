# Master Task List — KickTV SaaS

> **Aviso ao Agente Implementador:** Siga rigorosamente esta ordem. Não avance de fase sem concluir os testes da fase anterior.

## Fase 1: Setup do Projeto e Infraestrutura de Dados (O Coração)
- [ ] 1.1. Inicializar o projeto Frontend (Next.js / Vite) com TailwindCSS, TypeScript e Shadcn UI.
- [ ] 1.2. Conectar o projeto ao Supabase remoto (usando a URL e Key do cliente, ou CLI link).
- [ ] 1.3. Executar o SQL de criação das 4 tabelas base (`profiles`, `iptv_subscriptions`, `payments`, `support_tickets`).
- [ ] 1.4. Configurar as políticas de RLS (Row Level Security) rigorosamente para as tabelas.
- [ ] 1.5. Gerar e baixar os Tipos TypeScript (`types.ts`) a partir do banco (Supabase CLI).
- [ ] 1.6. Injetar as variáveis de ambiente sensíveis fornecidas de forma segura (GitHub, Supabase URL/Anon Key).

## Fase 2: Regras de Negócio e Edge Functions (O Cérebro)
- [ ] 2.1. Criar a Edge Function `generate-trial`: Conectar a uma API Xtream mockada (ou real, se providenciada depois) e inserir na tabela `iptv_subscriptions`.
- [ ] 2.2. Criar a Edge Function `renew-subscription`: Preparar endpoint POST para receber webhook, validar payload e estender `data_vencimento`.
- [ ] 2.3. Criar a Edge Function `self-healing-dns`: Receber a requisição, analisar tipo de dispositivo na tabela `iptv_subscriptions` e devolver a instrução.

## Fase 3: Design System e Autenticação (A Pele Base)
- [ ] 3.1. Configurar `globals.css` com as variáveis de cor (Zinc, Neon) e aplicar fontes (Outfit, Inter).
- [ ] 3.2. Implementar as animações e estilos globais de *Liquid Glass* (backdrop blur, glass borders).
- [ ] 3.3. Configurar fluxo de Login/Auth do Supabase (Email/Senha ou Magic Link) no frontend.

## Fase 4: Área Pública & Onboarding
- [ ] 4.1. Criar Landing Page (`/`) com Hero otimizado e botão de captura.
- [ ] 4.2. Desenvolver o Wizard de Dispositivos (`/onboarding`) - UI visual e seletor de aparelhos.
- [ ] 4.3. Integrar o final do Wizard com a chamada da função `generate-trial` e redirecionar para a tela de Sucesso.

## Fase 5: Portal do Cliente
- [ ] 5.1. Criar layout do Dashboard do Cliente (`/cliente/dashboard`).
- [ ] 5.2. Puxar dados do Supabase e exibir credenciais ativas e status de vencimento.
- [ ] 5.3. Criar tela e fluxo para Web Player (`/cliente/player`).
- [ ] 5.4. Implementar formulário interativo de Suporte Integrado (`/cliente/suporte`) chamando o self-healing.

## Fase 6: Painel Administrativo
- [ ] 6.1. Criar layout restrito para Admin (`/admin/dashboard`).
- [ ] 6.2. Criar Listagem de Clientes (`/admin/clientes`) com botão de acesso rápido (WhatsApp link).
- [ ] 6.3. Criar painel de Tickets não resolvidos (`/admin/tickets`).

## Fase 7: Revisão e Testes Finais
- [ ] 7.1. Testar RLS forjando requests não autorizadas.
- [ ] 7.2. Testar UX Mobile.
- [ ] 7.3. Auditoria Visual: Checar se o design está "Premium 2026" conforme `design.md`.
