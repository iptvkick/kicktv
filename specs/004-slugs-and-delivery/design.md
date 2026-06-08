# Design: Slugs Curtos & Entrega no Discord

## Lógica de Slugs ( capital_leads_prospector.py )
A extração passará por uma filtragem agressiva:
```python
import re
# Tira acentos e caracteres especiais, mas mantém os espaços.
nome_limpo = re.sub(r'[^a-z0-9 ]+', '', re.sub(r'[\u0300-\u036f]', '', nome_negocio.lower())).strip()
# Pega apenas as 3 primeiras palavras
palavras = nome_limpo.split(' ')[:3]
# Junta com hífens
slug_raw = "-".join(palavras)
# Corta em 30 caracteres
slug = slug_raw[:30].strip('-')
```
Isso converte "Centro Automotivo Águia - Especializada" para `centro-automotivo-aguia`, ao invés de `centro-automotivo-aguia-especializada`.

## Lógica de Renomeação de Arquivo ( orchestrator.py )
A formatação atual do arquivo:
`filename = f"{nome_limpo} - {nicho_limpo} - {data_hora}.txt"`
Será mudada para algo mais cru e limpo:
`filename = f"{nome_limpo} {data_hora}.txt"` 
Com `data_hora` num formato elegante `DD-MM-YYYY HH-MM`.

## Lógica do Discord ( orchestrator.py & alerts.py )
A mensagem formatada `content` lida do `success_queue.txt` deve ser limpa e colocada como bloco ` ```text ` dentro do embed do Discord. Isso exigirá que o `send_discord_alert` suporte mensagens maiores ou tenha um estilo de formatação que valorize o link do site logo na primeira linha, e o número de WhatsApp em Markdown (que já está feito no `success_msg.md` do bash).
