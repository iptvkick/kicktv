# Tasks: Landing Page & Onboarding Dinâmico

## Fase 1: Arquitetura Global e Theming
- [ ] Atualizar `tailwind.config.ts` (ou `index.css`/variáveis CSS) para acomodar a paleta Dark Dopamine (`#0a0a0c` e `#00E676`).
- [ ] Criar classes de utilidade global para "Liquid Glass" no CSS.
- [ ] Atualizar o `RootComponent` (`__root.tsx`) ou layout base com o fundo global e a fonte (Inter/Space Grotesk).

## Fase 2: Construção da Nova Landing Page (`/`)
- [ ] Criar Componente **Hero Section** (Texto gigantesco "Sua TV, Reinventada", subtexto e botão CTA de alto contraste).
- [ ] Criar Componente **Device Grid** (Qual dispositivo você está usando?) consumindo os ícones da Lucide ou SVGs baseados nas categorias (TV, Mobile, PC).
- [ ] Criar Componente **Planos Cards** (Apresentação visual dos Planos, inspirada na print do Ultra Krator+).
- [ ] Implementar Navbar transparente com blur dinâmico ao rolar.
- [ ] Linkar os CTAs de criar teste para `/auth/register`.

## Fase 3: Roteamento de Onboarding
- [ ] Modificar o fluxo de `/auth/register` para aceitar um `?device_id=` (search param). 
- [ ] Assim que o usuário concluir o cadastro no `/auth/register`, acionar no background a API do Xtream (via Supabase Edge Function `generate-trial`, que já existe) E redirecionar para a página do Player.
- [ ] Criar a página de Sucesso do Onboarding (`/onboarding/tutorial`), que buscará o trial ativo do usuário, exibirá as credenciais em um card para cópia e mostrará o tutorial do dispositivo escolhido.

## Fase 4: Página de Suporte (`/suporte`)
- [ ] Criar Rota `/suporte`.
- [ ] Criar Header "Qual tipo de suporte você precisa?".
- [ ] Montar a Grid 2x3 de Cartões Liquid Glass ("Bug no aplicativo", "Problema de conexão", etc.).
- [ ] Adicionar funcionalidade básica de redirecionamento (Ex: abrir pop-up de WhatsApp ou linkar para uma URL fixa).

## Fase 5: Refinamento e Validação
- [ ] Injetar as animações `framer-motion` ou CSS puro (`fade-in-up`, `hover:scale`).
- [ ] Revisão Mobile-first (Testar empilhamento de colunas em telas pequenas).
- [ ] Build e validação de conflitos.
