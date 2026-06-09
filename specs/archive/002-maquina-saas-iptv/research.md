# Fase 1: A Máquina de SaaS IPTV - Research (RPI-R)

## Escopo do Negócio
O objetivo é criar uma máquina de captação e conversão 100% automatizada e parametrizada. Nenhuma instrução de instalação, plano ou preço deverá ficar no código-fonte. O sistema lerá do banco de dados (Supabase), permitindo que o administrador edite qualquer etapa de onboarding pelo painel CMS.

## Benchmarking e Referências
- Foco em alta conversão: Landing page de resposta direta.
- Captação imediata do Lead via cadastro Supabase Auth antes de exibir tutoriais.

## Pesquisa Técnica Aplicada ao Onboarding (Para Ingestão Dinâmica)

### 1. Sideloading em Roku TV
- **Modo Desenvolvedor:** A ativação requer a sequência exata no controle remoto: Home (3x), Cima (2x), Direita, Esquerda, Direita, Esquerda, Direita.
- **Instalação IP:** O cliente anota o IP (`http://192.168...`), usa usuário `rokudev` e faz upload do arquivo `.zip` da aplicação via navegador do celular.

### 2. Downloader (Firestick e Android TV)
- **Pré-requisito:** Ativar "Instalar aplicativos desconhecidos" nas Opções para Desenvolvedores.
- **Shortcodes AFTVnews:** O usuário não precisa digitar URLs inteiras. Ao digitar um shortcode numérico no App Downloader (ex: 272483 para TiviMate), ocorre um redirect HTTP 302 automático para baixar o APK oficial. Isso será parametrizado na tabela `onboarding_devices`.

### 3. Autocura e Resolução de Erros
- **Traffic Shaping:** Operadoras (Claro, Vivo) estrangulam tráfego IPTV. A solução primordial é a troca de DNS da TV.
  - *Samsung:* Configurações de IP > DNS > `8.8.8.8` (Google) ou `1.1.1.1` (Cloudflare).
  - *LG WebOS:* Rede > Wi-Fi > Config Avançadas > Servidor DNS.
- **Cache Android TV:** A instrução será explícita para limpar apenas o cache e NUNCA os dados do app, para não apagar a lista e credenciais do cliente.

### 4. Integração Master API (Xtream Codes)
- A geração de testes (Trial) usará a API de Reseller (`api.php` / `manage_users.php`), e não a do player.
- Exemplo de request: `action=user`, `sub=add`, mapeando o id do pacote do trial e ID do membro.
- **Segurança:** O painel Xtream exigirá o registro dos IPs públicos da Supabase Edge Function na "IP Whitelist" de segurança para não rejeitar a chamada. Essa chamada não deve expor secrets no frontend.
