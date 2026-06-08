# Proposal: Hermes Infra Resilience & Observability

## Visão Geral
Construir uma infraestrutura robusta, autogerenciada e tolerante a falhas para a máquina de vendas "Hermes". O sistema precisa se recuperar de erros imprevistos (limites de API, falhas de I/O) e notificar o usuário ativamente se a esteira parar, garantindo 100% de confiabilidade operacional.

## Requirements
1. **Delegation of Scheduling:** O cronjob não deve ser gerido por um `while True` em Python. Deve ser movido para o Agendador de Tarefas do Windows (Task Scheduler), garantindo execução imune a suspensões do SO.
2. **Centralized Logging:** Todo job (com ID do slug) deve ter seu state (INICIADO, SUCESSO, FALHA) escrito num arquivo de log central (ex: JSONL ou SQLite).
3. **Smart Alerting:** Integração obrigatória com Discord Webhooks:
   - Notificar quando o robô inicializa o ciclo diário.
   - Notificar em caso de erro fatal (ex: Gemini fora do ar, limites de quota).
   - Notificar sucessos com URL do site.
4. **Auto-rescue:** Blocos `try/catch` globais no Prospector que forcem retentativas exponenciais caso a API do Vertex ou Google Maps retorne 429 (Rate Limit) ou 500.
5. **Heartbeat Signal:** O script deve disparar uma notificação às 09:00am e 18:00pm para provar que a esteira de prospecção iniciou e finalizou o dia, assegurando o usuário do status do motor.

## User Stories
- **Como** um gestor de vendas automatizadas, **eu quero** receber um ping no meu Discord toda manhã confirmando que a esteira ligou, **para** não precisar checar manualmente se o script quebrou.
- **Como** engenheiro de infraestrutura, **eu quero** que o script tente novamente gerar um site se a API der erro na primeira vez, **para** que eu não perca leads por causa de instabilidades da web.
- **Como** usuário corporativo, **eu quero** ser avisado imediatamente se a fábrica falhar de forma irrecuperável, **para** que eu possa intervir e não perder o dia inteiro de trabalho do bot.

## BDD Scenarios

### Cenário: Recuperação Automática de Limite de Quota (Rate Limit)
- **Given (Dado):** O sistema aciona o Prospector, mas a API do Vertex AI retorna um erro `HTTP 429 Too Many Requests`.
- **When (Quando):** O except handler captura o erro...
- **Then (Então):** O sistema deve aguardar 60 segundos (Backoff), fazer uma retentativa automática (até 3x) antes de marcar o job como FALHA.

### Cenário: Alerta de Erro Fatal no Bash
- **Given (Dado):** O site foi gerado, mas o comando `npm run build` falha repetidamente além das 3x do Auto-Heal.
- **When (Quando):** O script Bash atinge a diretiva `exit 1` forçada.
- **Then (Então):** O wrapper Python deve detectar que o subprocesso falhou e disparar um alerta VERMELHO para o Discord com as últimas linhas do log de erro.

### Cenário: Daily Heartbeat
- **Given (Dado):** O relógio do sistema atinge 09:00am numa Segunda-feira.
- **When (Quando):** O Windows Task Scheduler aciona o Hermes.
- **Then (Então):** O bot envia a mensagem "🩺 **Heartbeat**: Iniciando a caçada B2B do dia." no Discord, confirmando a sanidade do SO.
