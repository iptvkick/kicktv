# Tasks: Hermes Infra Resilience

- [ ] `01-create-orchestrator`: Criar `orchestrator.py` para substituir o loop do `daemon_b2b.py`. Este script deve rodar uma única vez por chamada, gerenciar retries e fazer o logging em arquivo.
- [ ] `02-implement-discord-alerts`: Construir um módulo reutilizável `alerts.py` para formatar embeds via webhook do Discord contendo cores (verde/sucesso, vermelho/erro, azul/heartbeat) e timestamps de erro.
- [ ] `03-refactor-prospector-rescue`: Adicionar blocos `try/except` no `capital_leads_prospector.py` para interceptar Quota Limits, aguardar X segundos e fazer retentativas. Em caso de falha absoluta, emitir alerta vermelho e sair.
- [ ] `04-bash-error-capture`: Alterar `run-gemini-job.sh` para fazer echo seguro dos erros fatais (ex: falhas de build prolongadas) e garantir que o retorno para o orchestrator não seja silencioso, para acionar o Discord Alert.
- [ ] `05-setup-windows-task-scheduler`: Documentar o comando PowerShell e testar a criação nativa de um cronjob do SO (`schtasks`) para invocar o `orchestrator.py` toda hora cheia entre 09h e 18h de Seg a Sex, garantindo imunidade à hibernação do PC.
