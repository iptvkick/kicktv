# Research: Workspace Cleanup

## O Problema
A pasta principal de desenvolvimento `C:\Users\User\Desktop\vscode` está muito poluída com arquivos soltos. Há misturas de projetos reais, testes de IA, scripts utilitários (Wake-on-lan) e arquivos de dependência node vazados no root.

## Achados e Mapeamento
Mapeamos 24 subdiretórios e 24 arquivos na raiz:
1. **Modelos N8n/Make (JSONs)**: Diversos arquivos exportados soltos.
   * `001 Assistente 2.0.json`, `05. Escalar humano.json`...
2. **Frameworks de IA / Agentes**:
   * `OpenManus`, `openclaw`, `.claude`, `start_openclaude.bat`, `openclaude-readme.md`.
3. **Projetos "Tork"**:
   * Muitos clones e backups: `Tork`, `tork-crm`, `tork-pdf`, `tork-crm_backup_full.zip`...
4. **Wake-on-LAN**:
   * `wake-pc.bat`, `wol-server.js`, `Wake-PC.ps1`, docs.
5. **Roblox**:
   * `roblox` dir, `default.project.json`, `Place1.rbxl.lock`.
6. **Lixo de NPM no Root**:
   * `node_modules`, `package.json`, `package-lock.json` na raiz não fazem sentido.

## Análise de Concorrentes (Boas práticas de Dev)
- **Zero arquivos soltos na raiz**: O workspace principal deve ter apenas pastas nomeadas por organização ou domínio de estudo.
- **Categorização clara**: Separar "Projetos Ativos" de "Testes/Labs" e "Utilitários".
- **Limpeza de dependências**: Não ter node_modules e package.json na raiz do Desktop/vscode.
