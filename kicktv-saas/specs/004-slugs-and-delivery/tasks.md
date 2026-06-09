# Tasks: Slugs Curtos & Entrega no Discord

- [ ] `01-refactor-slug-logic`: Em `capital_leads_prospector.py`, alterar a criação da variável `slug`. Deve dividir por espaços, pegar apenas as 3 primeiras palavras, juntar com hífens e truncar rigidamente em 30 caracteres.
- [ ] `02-refactor-desktop-filename`: Em `orchestrator.py`, na função `save_and_notify`, simplificar o nome do arquivo final para `[nome_limpo] [data_hora].txt`.
- [ ] `03-refactor-discord-embed`: Em `orchestrator.py`, alterar o alerta `send_discord_alert("success", ...)` para incluir o bloco do Lead/Briefing extraído do txt de sucesso no corpo do embed.
- [ ] `04-test-regex-fix`: Garantir que `orchestrator.py` consiga extrair o Nome da Empresa usando o Regex limpo de forma imaculada.
