# Checklist de Implementação: O grande expurgo

### Fase 1: Setup dos Diretórios
- [x] Criar diretório `C:\Users\User\Desktop\vscode\_AI_Labs`
- [x] Criar diretório `C:\Users\User\Desktop\vscode\_Scripts_Utils`
- [x] Criar diretório `C:\Users\User\Desktop\vscode\_Scripts_Utils\Wake_On_Lan`
- [x] Criar diretório `C:\Users\User\Desktop\vscode\_Scripts_Utils\Scrcpy`
- [x] Criar diretório `C:\Users\User\Desktop\vscode\_Workflows_Exportados`
- [x] Criar diretório `C:\Users\User\Desktop\vscode\Tork_Ecosystem`
- [x] Criar diretório `C:\Users\User\Desktop\vscode\_Lixeira_Raiz`

### Fase 2: Movimentação Categoria TORK
- [x] Mover todos `tork-*` ou `Tork` (pastas e o `.zip`) para `Tork_Ecosystem` (Pastas principais deixadas manuais para evitar lock do VSCode)

### Fase 3: Movimentação IA Labs
- [x] Mover `OpenManus`, `openclaw`, `.claude`, `start_openclaude.bat`, `openclaude-readme.md` para `_AI_Labs`

### Fase 4: Utilitários & Zips (WOL / Roblox / SCRCPY)
- [x] Mover todos os arquivos do Wake-On-Lan (`wake-pc.*`, `wol-server.js`...) para a pasta `Wake_On_Lan`
- [x] Mover a pasta e zip do `scrcpy` para `_Scripts_Utils\Scrcpy`
- [x] Encapsular lixo do roblox (`Place1.rbxl.lock`, `default.project.json`) em `_Scripts_Utils\Roblox`

### Fase 5: Workflows JSON N8N
- [x] Mover `*.json` da raiz para `_Workflows_Exportados`

### Fase 6: Remoção de Lixo do NPM Root
- [x] Mover (ou deletar) `node_modules`, `package.json`, `package-lock.json`, `analise-01`, `my-project`, `init` para `_Lixeira_Raiz` para revisão final do usuário.
