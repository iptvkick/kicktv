# Tasks (ID: 009-leads-generator-fix)

- [ ] Ler o arquivo `C:\Users\User\AppData\Local\hermes\scripts\run-gemini-job.sh` e remover por completo a menção das URLs do Unsplash (linhas 59-64).
- [ ] Injetar no `run-gemini-job.sh` a regra obrigatória do "CSS Gradients" e dos ícones Lucide React para todas as imagens de Hero/Fundos.
- [ ] Ler o `C:\Users\User\AppData\Local\hermes\scripts\jobs\vet-premium-care-clinica-veterin-ria\src\components\Hero.tsx` ou similar, e corrigir a imagem local com o `replace_file_content` removendo o carro de luxo e adicionando um background dark gradient.
- [ ] Realizar um `npm run build` e um `git push origin main` na pasta do `vet-premium-care...` para forçar o deploy de correção no Netlify.
- [ ] Identificar e corrigir o Rate Limit: Reduzir a frequência de re-tentativas no script Python `capital_leads_prospector.py` ou instruir o cliente sobre a troca da API KEY.
- [ ] Configurar o Cron Job no Hermes para rodar o Python a cada hora, de segunda a sexta, com output para o Discord usando a CLI do Hermes (`hermes cron create "0 9-18 * * 1-5" ...`).
