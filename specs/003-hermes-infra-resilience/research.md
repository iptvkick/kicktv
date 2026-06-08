# Research: Hermes Infra & Resilience

## Contexto Atual
A esteira de vendas B2B é orquestrada por uma combinação de scripts Python (`daemon_b2b.py`, `capital_leads_prospector.py`) e Bash (`run-gemini-job.sh`). 

### Problemas Mapeados (Pain Points):
1. **Silêncio de Falhas (Silent Failures):** Se o script Python crashear devido a uma exceção não tratada, ou se o prompt do Gemini travar, o sistema simplesmente para de processar. Não há nenhum aviso nativo avisando que a "fábrica parou".
2. **Ciclo de Sleep do Windows:** `time.sleep()` em Windows pausa a contagem quando o PC entra em modo de suspensão/hibernação. O cron job atrasa horas.
3. **Falta de Observabilidade:** Não temos um painel ou arquivo de log centralizado para saber *quantos* leads falharam na extração (e por quê), nem onde o Gemini engasgou.
4. **Auto-heal rudimentar:** O script em bash tem um loop de 3 tentativas para builds falhos de TS, mas isso não abrange erros de API do Vertex ou problemas de rate limit.

## Soluções Analisadas
- **Windows Task Scheduler + Script Singleton:** Em vez de rodar um daemon perpétuo com `time.sleep()`, delegamos o agendamento cron para o SO (Windows Task Scheduler). O script executa uma vez, limpa a memória, e sai.
- **Discord Webhooks para Alertas:** O webhook atual (`https://discord.com/api/webhooks/...`) deve receber:
  - Alerta VERDE (Sucesso - Site gerado)
  - Alerta AMARELO (Tentativa falha, auto-rescue iniciado)
  - Alerta VERMELHO (Falha crítica, job abortado)
  - Alerta AZUL (Heartbeat diário de saúde)
- **Log Centralizado e State Tracking:** Uso de um arquivo SQLite simples ou arquivo NDJSON em `~/.hermes/logs` para registrar todo estado de job.
