# Design: Folder Architecture 2026

No contexto de arquivos do Windows, não aplicaremos UI components (Stitch) nem DB (Supabase), pois o ambiente é o **File System Local**.

## Árvore de Diretórios Ideal (Root: \vscode\)
\`\`\`text
C:\Users\User\Desktop\vscode\
├── _AI_Labs/                 # Testes como OpenManus, openclaw, start_openclaude
├── _Scripts_Utils/           # WakeOnLan, scrcpy, roblox soltos e afins
├── _Workflows_Backups/       # JSONs estáticos exportados de plataformas nocode
├── Tork_Ecosystem/           # Todos os projetos e zips relacionados ao cliente Tork
├── projetos/                 # Pasta legada, não tocar
├── projetos antigravity/     # Onde sua atividade focada atual reside (Aqui)
├── cartolai/                 ... (Demais projetos não tocados)
├── bot/                      ...
└── crm/                      ...
\`\`\`

## Tratamento de Lixo Oculto
Qualquer artefato de inicialização ou lixo inútil temporário como o diretório `my-project`, o misterioso `init` ou a pasta `node_modules` na raiz será varrido para a exclusão (ou empurrado temporariamente para o `_Trash` para sua verificação) a fim de garantir "Desktop Zen".
