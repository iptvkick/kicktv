# Phase 0: Research (RPI-R)
**Contexto**: O usuário deseja um redesign radical da Landing Page e do fluxo de Onboarding (Teste Grátis / Primeiros Passos), substituindo um design antigo, estático e de baixa conversão por uma experiência Premium "Apple Liquid Glass" (2026), baseada no framework do KickTV.

### 1. Análise do Material Fornecido (Antigo vs Novo)
- **O Antigo (Prints Fornecidos)**:
  - Predominância de um verde sólido sobre fundo preto (estilo matriz/hacker antigo).
  - Caixas quadradas simples, UI pouco refinada, aparência de "template barato".
  - O fluxo perguntava o Aparelho, se já tinha o app instalado, mostrava planos (Essencial, Premium, Ultra) e quantidade de telas adicionais.
  - Havia também uma central de suporte ("Sou novo cliente" / "Já sou cliente" / "Bug no app").

- **O Novo (Objetivo)**:
  - Fim do blanding e da interface "crua". Adoção de **Maximalismo Tátil** e **Neo-Minimalismo**.
  - O fluxo deve ser dinâmico (já temos o motor Supabase `onboarding_devices` e `onboarding_steps` funcionando graças a Spec 002).
  - A conversão (Geração de Teste Grátis) precisa estar acessível, mas estruturada de forma inteligente para captar o Lead antes de entregar o ouro.

### 2. Análise Estratégica de Conversão
Para um SaaS de Streaming/IPTV, o funil ideal de 2026 funciona assim:
1. **Página de Vendas (Landing Page)**: Aberta, focada no hero (Sua TV, Reinventada), exibindo o poder da plataforma e a facilidade, com prova social pesada.
2. **Funil de Teste Grátis (Wizard Aberto)**:
   - *Passo 1*: Escolha do Dispositivo (Gera compromisso cognitivo).
   - *Passo 2*: Criação da Conta (Nome, E-mail, Senha) -> **Lead Capturado**.
   - *Passo 3*: "Mágica Acontecendo" -> O sistema bate nas Edge Functions e gera as credenciais do Xtream.
   - *Passo 4*: O Onboarding Player Dinâmico carrega o vídeo correspondente ao aparelho escolhido e exibe a URL/User/Senha gerada na tela.
3. **Pós-Teste / Up-sell (Restrito/Logado)**: Escolha de Planos e Pagamento Asaas (Já funcional no `/cliente/dashboard`).
4. **Central de Ajuda/Suporte**: Aberta ao público, mas focada em autoatendimento visual.

### 3. Benchmarking Visual
- **Netflix / Disney+**: Fundo escuro imersivo, tipografia colossal para nomes de séries/planos. Botões chamativos.
- **Apple TV+**: Uso abundante de "Liquid Glass" (vidro fosco translúcido), micro-animações, cards que flutuam sutilmente com refração de luz.
- **Tendência 2026**: Neon Dopamine (Verde Esmeralda/Lime como accent, contrastando com Preto Profundo `#0a0a0a` e Cinza Chumbo).

### 4. Direcionamento
A nova interface será construída dividindo o front-end em 3 grandes blocos:
- `/`: Landing Page Premium
- `/onboarding`: Funil "Step-by-Step" de captação e geração do teste.
- `/suporte`: Autoatendimento inteligente.
