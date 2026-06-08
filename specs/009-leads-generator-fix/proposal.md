# Proposal (ID: 009-leads-generator-fix)

## O Problema
1. **Mistério da Ferrari (Imagens Herdadadas no Hero):** O agente Gemini estava sendo induzido a usar uma imagem do Unsplash (`1618005182384-a83a8bd57fbe` ou `1614200179396`) para representar o tema "Dark Tech/Luxo". O problema é que a IA, ou o próprio Unsplash, retornava imagens indesejadas (como um carro esportivo) para sites que não têm nenhuma relação (ex: Clínicas Veterinárias). Isso infectou os sites recentes (`vet-premium-care-clinica-veterin-ria`).
2. **Esgotamento de Tokens (API Rate Limit):** O script `capital_leads_prospector.py` roda de forma muito frequente e a cota do Gemini (gemini-3.5-flash) excedeu o limite (`HTTP 429: Quota exceeded`).
3. **Cron Job Schedule:** O usuário solicitou que o cron rodasse entre as 9h e 18h (seg a sex), notificando lindamente no Discord (o script atual talvez não esteja formatado ou não esteja usando webhook do Discord).

## A Solução Proposta

1. **Revisão do Prompt Base (`run-gemini-job.sh`):**
   - **Proibir** estritamente links arbitrários do Unsplash para backgrounds no prompt do Gemini.
   - Forçar o uso exclusivo de **Gradients CSS (Tailwind)** ou imagens via *Placehold.co* (que sempre funciona sem surpresas).
   
2. **Correção Retroativa nos Sites Afetados:**
   - Vamos localizar a imagem do carro dentro do código-fonte (geralmente em `src/components/Hero.tsx` ou em `App.tsx`) dos sites gerados recentemente, como `vet-premium-care-clinica-veterin-ria`, e fazer um patch local substituindo por um CSS Gradient neutro de alta conversão. Em seguida faremos o push/deploy novamente para o Github/Netlify atualizar o site "ao vivo".

3. **Orquestração de API e Cron:**
   - O Cron job do Hermes deve ser atualizado para rodar a cada hora: `hermes cron create "0 9-18 * * 1-5" ... --deliver discord`.
   - Adicionaremos ou orientaremos sobre um "fallback" de API no `.env` do projeto para que o `run-gemini-job.sh` possa invocar um modelo de menor custo quando o principal estourar, ou configurar delays maiores (ex: rodar 1x por hora invés de infinitos loops no python).

## Requisitos de Negócio (BRDs)
- **BRD01:** Nenhum site gerado deve conter imagens "chutadas" que não tenham a ver com o nicho do cliente, a fim de não passar vergonha no momento da prospecção fria.
- **BRD02:** O sistema não deve travar por limite de rate limit de API (HTTP 429). Devem haver proteções ou espaçamento entre chamadas.
- **BRD03:** As notificações devem ser enviadas corretamente formatadas para o Discord do cliente em horário comercial (9-18h, SEG-SEX).

## BDD Scenarios

### Cenário: Gerando Site sem Imagens Alucinadas
- **Given (Dado):** O lead prospectado é "Vet Premium Care".
- **When (Quando):** O bot Gemini recebe o comando para gerar o código frontend.
- **Then (Então):** O prompt proíbe buscar fotos no Unsplash e obriga o uso de Tailwind CSS Gradients para a área do Hero, e Placehold.co nas outras imagens de galeria, impedindo o surgimento da "Ferrari".

### Cenário: Falha Segura em Caso de Token Esgotado
- **Given (Dado):** O saldo da conta Gemini atinge zero no dia (Quota 429).
- **When (Quando):** O CronJob roda a prospecção da hora.
- **Then (Então):** O script reconhece a falha sem entrar em loop eterno, loga o erro e aguarda o limite ser renovado sem sobrecarregar o painel da VPS com bash jobs suspensos.

## User Review Required
> [!IMPORTANT]
> - Precisaremos alterar a chave de API do Gemini no seu arquivo `.env` local (`agencia.env`) caso o limite gratuito mensal tenha sido realmente zerado. Ou podemos tentar diminuir o tamanho dos tokens no prompt?
> - Confirma se posso fazer a alteração via `sed` ou regex no site da Vet para arrancar a foto do carro e comitar no github local de lá?
