# Proposal: Asaas Sync & Client Onboarding

## Requisitos
- **REQ-01 (Backend/Asaas Sync):** Criar uma Edge Function `asaas-sync` que receba eventos do sistema (criação de plano, criação de cliente) e crie os respectivos recursos na API do Asaas (Customers e Subscriptions/Plans).
- **REQ-02 (Database/Triggers):** Configurar triggers de banco ou chamadas diretas no frontend para garantir que quando um `subscription_plan` for criado, ele seja enviado ao Asaas.
- **REQ-03 (Frontend/Cliente):** O Cliente recém-criado, ao acessar o dashboard, se não possuir um dispositivo vinculado (`dispositivo_principal`), deve obrigatoriamente passar por uma tela (ou aba inicial) de "Onde você vai instalar?". Somente após selecionar o dispositivo (ex: Roku, Android TV) os dados de acesso M3U e o tutorial específico daquele aparelho serão revelados.
- **REQ-04 (Frontend/Onboarding Flow):** A seleção de dispositivo deve atualizar a tabela `iptv_subscriptions` ou `profiles` salvando o aparelho escolhido para sempre exibir as instruções corretas.

## User Stories
1. **Como Administrador**, quero que ao criar um novo "Plano Mensal" no meu Admin, ele seja automaticamente sincronizado com a minha conta do Asaas, para que eu não tenha trabalho manual duplicado.
2. **Como Cliente**, quero que assim que eu criar minha conta e receber meu Trial de 4h, eu seja questionado sobre qual dispositivo vou usar, para receber instruções exatas e não ficar perdido.
3. **Como Administrador**, quero que meus clientes sejam espelhados no Asaas no instante em que se cadastram no meu sistema.

## BDD Scenarios

### Cenário 1: Sincronização de Novo Plano
- **Given (Dado):** O Administrador preencheu o formulário de "Novo Plano" na tela de Planos.
- **When (Quando):** Ele clica em "Salvar Plano".
- **Then (Então):** O Frontend chama a Edge Function de criação de plano. A function cria o plano no banco Supabase E dispara um POST para o Asaas criando o item na API de cobranças, cruzando os IDs em tempo real.

### Cenário 2: Seleção de Dispositivo Obrigatória
- **Given (Dado):** Um cliente entra no Dashboard pela primeira vez no Trial.
- **When (Quando):** A Aba "Dados Pessoais" carrega e detecta que `dispositivo_principal` é nulo.
- **Then (Então):** As credenciais (Usuário e Senha M3U) ficam ocultas. A UI exibe um grid de ícones "Selecione seu Aparelho". Ao clicar em um, o perfil é atualizado, a senha é revelada e o tutorial de instalação específico daquele aparelho (`onboarding_steps`) é exibido logo abaixo.
