# Design: Hermes Infra Resilience & Observability

## Architecture
A arquitetura muda de um "Daemon" perpétuo em Python (sujeito a bloqueios de I/O e ciclo de energia) para um "Job-based execution" disparado pelo **Windows Task Scheduler**.

### Fluxo de Componentes
1. **Windows Task Scheduler:** Orquestrador principal. Dispara `orchestrator.py` a cada hora, entre as 09:00 e 18:00 de Seg-Sex.
2. **orchestrator.py:** O cérebro que avalia o estado atual.
   - Escreve um log de status: `[INFO] Job Iniciado`.
   - Se for o primeiro run do dia, envia Heartbeat para o Discord.
   - Envolve `capital_leads_prospector.py` em um bloco de `try...except` com retries.
3. **Log Streamer:** Um logger centralizado que escreve em `logs/hermes_status.log`.
4. **Alerta Tracker:** Uma função utilitária `discord_alert(level, title, message)` enviando Embeds ricos para o canal do cliente.
   - **Cores dos Embeds:** Verde (`0x00FF00`) para sucesso; Vermelho (`0xFF0000`) para erro fatal; Amarelo (`0xFFFF00`) para retry.

## Padrões de Observabilidade
- **File System:** Usaremos a convenção de armazenar os estados em `C:\Users\User\AppData\Local\hermes\scripts\infra\status.json`.
- **Error Types:**
  - `APIQuotaError`
  - `LLMTimeoutError`
  - `BuildCompilationError`

## UI e Interações (Webhook)
O Discord atuará como a "UI" desse Daemon invisível. O cliente não precisará mais "olhar para a janela preta".
- Se um log fatal ocorrer, a stack trace amigável é jogada na channel.
- Se o job concluir 100%, o link cai no canal do Discord e continua gerando o arquivo `.txt` nativo no desktop.
