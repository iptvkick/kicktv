# Proposal: Landing Page Premium & Onboarding Dinâmico

## 1. Visão Geral
Transformar a atual "página branca vazia" do projeto KickTV em uma **Landing Page de Alta Conversão**, acompanhada de um **Funil de Onboarding / Teste Grátis** imersivo, gamificado e totalmente dinâmico. O objetivo é mesclar o layout visual que o usuário tentou criar no passado (Sua TV Reinventada, Caixas de Aparelhos) com as regras de design de 2026, amarrando isso ao backend já estruturado (Spec 002).

## 2. Requisitos de Negócio (Business Rules)
1. **Landing Page Aberta**: O usuário deve poder entender o serviço, ver os planos (sem comprá-los de imediato, redirecionando para criar conta) e acessar a área de Suporte.
2. **Lead-First no Teste Grátis**: O fluxo de gerar teste grátis começa com a "Gamificação" (escolher o aparelho), mas **exige o Cadastro (Auth)** antes de exibir o Tutorial e as Credenciais. Não daremos credenciais para fantasmas.
3. **Área de Suporte Aberta**: Uma página dedicada (`/suporte`) que replica a "Central de Suporte" dos prints (Bug no App, Problema de Conexão, etc.), direcionando o usuário para o WhatsApp ou para artigos.

## 3. User Stories
- **Como visitante**, quero ser impactado por uma página linda nos 3 primeiros segundos, para sentir confiança no serviço.
- **Como visitante**, quero clicar em "Gerar Teste Grátis" e ser guiado por um passo-a-passo simples onde escolho minha TV, para não me sentir perdido com tecnologia.
- **Como visitante**, ao finalizar o cadastro no teste, quero ver na tela o tutorial exato de como instalar no aparelho que escolhi, junto com meu usuário e senha do iptv.

## 4. BDD Scenarios

### Cenário: Geração de Teste Grátis com Captura de Lead
- **Given (Dado)**: Que o visitante está na página inicial e clica em "Gerar Teste Grátis".
- **When (Quando)**: O visitante seleciona o aparelho "Smart TV Samsung", depois informa seu Nome, Email e Senha.
- **Then (Então)**: O sistema cadastra o usuário no Supabase Auth, aciona a Edge Function de gerar trial no Xtream, e redireciona o usuário para `/onboarding/success`, exibindo o player do YouTube de Smart TV e as credenciais geradas.

### Cenário: Bloqueio de Acesso Anônimo a Credenciais
- **Given (Dado)**: Que um visitante tenta burlar o sistema acessando diretamente `/onboarding/success`.
- **When (Quando)**: A página carrega.
- **Then (Então)**: O sistema detecta a ausência de sessão ativa e o redireciona imediatamente para `/auth/register` com a mensagem "Crie sua conta para ver suas credenciais."

### Cenário: Exibição da Grade de Suporte
- **Given (Dado)**: Que o visitante clica em "Suporte" no footer.
- **When (Quando)**: A página `/suporte` carrega.
- **Then (Então)**: Uma grade "Liquid Glass" com 6 botões interativos (Bug, Não consigo entrar, Problema de conexão) aparece, guiando para soluções rápidas.
