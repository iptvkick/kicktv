# Proposal & Requisitos — Configurações Dinâmicas (Admin)

## 1. Visão Geral
A funcionalidade `002-dynamic-config` transforma o KickTV SaaS em uma plataforma 100% "White-label" gerenciável. Todo o fluxo que antes possuía valores fixos no código passará a ser lido em tempo real do banco de dados, permitindo ao Administrador escalar a operação, ajustar preços e adaptar tutoriais sem precisar mexer em código.

## 2. Requisitos de Negócio

### 2.1 Gestão de Servidores (Xtream) e Fallbacks
- O sistema deve suportar uma arquitetura de múltiplos servidores Xtream.
- Haverá **1 Servidor Principal** (Hierarquia 1).
- Servidores secundários servirão como **Fallbacks** (Hierarquia 2, 3...). Caso o gerador de teste da Edge Function falhe no Servidor 1 (por instabilidade), ele tentará no Servidor 2 automaticamente.
- O Admin poderá configurar o "Nome da Playlist" padrão gerada.

### 2.2 Planos e Faturas (Asaas)
- O Admin pode criar múltiplos planos de renovação (Ex: Mensal, Trimestral, Anual) definindo valor e duração.
- O checkout deve permitir **Add-ons de Telas Extras**: O cliente pode adicionar até +3 telas (conexões simultâneas) na mesma assinatura, com o preço extra também sendo configurável pelo Admin.

### 2.3 Onboarding Builder (Dinâmico)
- A tela inicial (`/`) de "Onde você quer assistir?" passará a ser renderizada com base nos dispositivos cadastrados no banco.
- O Admin pode criar/editar dispositivos (Ex: Apple TV, Roku, Smart TV) e para cada um, definir "Passo a Passo" de instalação.
- Cada passo pode conter: Título, Texto descritivo e uma URL opcional (YouTube ou Imagem) para incorporar visualmente na UI do cliente.

### 2.4 Regras de Trial
- Duração do teste grátis configurável em horas via painel (Ex: de 4 para 2 horas aos finais de semana).

## 3. User Stories
- **US01:** Como *Admin*, quero configurar um segundo servidor Xtream como fallback para que eu não perca vendas caso o principal caia.
- **US02:** Como *Admin*, quero alterar o plano Trimestral de R$ 90 para R$ 80 devido a uma promoção de Black Friday.
- **US03:** Como *Cliente*, quero comprar uma linha de IPTV e na hora de pagar, adicionar "+1 Tela Extra" para minha sala.
- **US04:** Como *Admin*, quero adicionar um novo tutorial do "TiviMate" na tela inicial de clientes, contendo um link para o meu vídeo do YouTube ensinando a colocar o DNS.

## 4. Critérios de Aceite
- Nenhuma URL de servidor ou preço do Asaas pode ficar `hardcoded` em arquivos `.ts` ou Edge Functions.
- O Frontend deve exibir componentes de vídeo dinamicamente se o campo `youtube_url` do passo a passo existir.

## 5. BDD Scenarios

### Cenário: Geração de Teste com Queda do Principal
- **Given (Dado):** O sistema tem o Servidor A (Pri 1) e Servidor B (Pri 2) configurados.
- **When (Quando):** A Edge Function de trial bate no Servidor A e recebe "500 Internal Server Error".
- **Then (Então):** A função captura o erro, busca as credenciais do Servidor B e gera a conta lá, retornando sucesso ao cliente.

### Cenário: Inclusão de Telas Extras
- **Given (Dado):** O plano Anual custa R$ 300 e a "Tela Extra" custa R$ 10.
- **When (Quando):** O cliente seleciona o plano Anual e clica em "Adicionar 2 Telas".
- **Then (Então):** O checkout do Asaas é gerado no valor de R$ 320, e a Edge Function que aciona o Xtream altera as "Max Connections" do usuário para 3.
