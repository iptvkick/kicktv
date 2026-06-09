# Fase 1: A Máquina de SaaS IPTV - Proposal

## Requisitos do Sistema
1. Capturar o lead (Email/Senha) logo na landing page antes de fornecer o teste.
2. O sistema deve interrogar o usuário sobre qual dispositivo possui e renderizar um passo-a-passo parametrizado do banco de dados (Tabelas `onboarding_devices` e `onboarding_steps`).
3. Somente após a confirmação da instalação do App, gerar a credencial via API externa (Xtream) rodando em uma Edge Function segura.
4. Auto-cobrança integrada com PIX Dinâmico, refletindo atualizações (Webhooks) automaticamente no perfil do Supabase.
5. Painel de auto-atendimento para resolução de problemas técnicos comuns (FAQ dinâmico puxado do banco).
6. Painel Admin 100% gerenciável, onde o dono pode editar preços, tutoriais curtos, IDs de planos da API externa e links.

## BDD Scenarios

### Cenário: Onboarding Dinâmico e Geração de Teste Seguro
- **Given (Dado):** que o usuário "Joao" criou uma conta de Lead e está logado.
- **When (Quando):** ele seleciona o dispositivo "Firestick" e conclui as etapas dinâmicas de instalação do "Downloader".
- **And (E):** clica no botão "Já instalei o app".
- **Then (Então):** o frontend invoca a Edge Function `create-trial`, que se comunica com a API Xtream e retorna temporariamente o Usuário/Senha na tela, atualizando o status de Joao para `trial_active`.

### Cenário: Autocura Técnica contra Traffic Shaping
- **Given (Dado):** que um cliente Ativo sofre com travamentos durante os jogos.
- **When (Quando):** ele acessa o portal e clica em "Solução de Problemas" > "Está travando".
- **Then (Então):** o sistema interroga a marca da TV dele e exibe os tutoriais dinâmicos de como alterar o DNS para `8.8.8.8` (conforme cadastrado no CMS), sem necessidade de abrir ticket no WhatsApp.

### Cenário: Edição de Tutoriais pelo Admin
- **Given (Dado):** que o administrador logou com `role = 'admin'`.
- **When (Quando):** ele acessa a tela de "Gerenciar Dispositivos" e altera o shortcode do Firestick de 272483 para 999999.
- **Then (Então):** os próximos leads a acessarem o onboarding de Firestick visualizarão a nova instrução automaticamente no app frontend, sem necessidade de novo deploy.
