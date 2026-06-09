# Research: Slugs Curtos & Entrega no Discord

## Contexto Atual
A geração de slugs em `capital_leads_prospector.py` simplesmente pega o nome inteiro da empresa, converte para minúsculas, remove acentos, substitui espaços por hífens e corta no limite de 50 caracteres.
Para um nome como "Agudo Vidros - SP ESPELHOS E PELICULAS", o slug fica `agudo-vidros-sp-espelhos-e-peliculas`. Embora caiba no Netlify, continua visualmente feio e poluído para a URL final (ex: `agudo-vidros-sp-espelhos-e-peliculas.netlify.app`).

O salvamento do lead é gerido por `orchestrator.py` via função `save_and_notify()`. O arquivo é salvo localmente em `Desktop/Leads_B2B`, e um alerta é emitido para o Discord contendo um resumo. O usuário não tem o arquivo completo (`.txt`) diretamente no Discord.

## Soluções Analisadas
- **Redução Inteligente de Slug:** Utilizar apenas as 3 primeiras palavras do nome da empresa para compor a base do slug, e limitar a um máximo de 25 caracteres. Ex: `Agudo Vidros - SP...` -> `agudo-vidros-sp`. 
- **Entrega Multi-Canal (Local + Nuvem):** 
  1. No desktop: O nome do arquivo salvo em `Leads_B2B` deve aderir ao formato limpo pedido (`NOME_DO_LEAD Data Hora.txt`).
  2. No Discord: Como o script `alerts.py` usa `urllib` sem dependências pesadas, implementar envio de arquivo (`multipart/form-data`) exige muito boilerplate. Uma alternativa muito mais estável (e visualmente agradável) é colar o conteúdo essencial do Lead diretamente em um bloco de código ` ```text ` na própria mensagem Embed de sucesso, transformando o Discord na verdadeira "caixa de entrada" do cliente sem precisar baixar `.txt`. Caso o payload ultrapasse o limite do embed, enviaremos apenas o resumo com URL e instruiremos a buscar o `.txt` na pasta.
