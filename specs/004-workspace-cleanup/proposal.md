# Proposal: Folder Organization System

## Visão Geral
Transformar a pasta raiz do `vscode` em um ambiente focado, livre de testes avulsos e lixos, padronizando um sistema organizacional por Domínio de ferramentas.

## Requisitos
- **Req 1**: Remover lixo raiz (apagar ou isolar `node_modules` avulso, `init`, arquivos sem sentido).
- **Req 2**: Agrupar scripts de automação/WakeOnLan em `_Utils/WakeOnLan`.
- **Req 3**: Agrupar projetos Tork espalhados em `Tork_Ecosystem`.
- **Req 4**: Agrupar testes de AI CLI (Claude, OpenManus) em `_AI_Labs`.
- **Req 5**: Agrupar workflows exportados (JSONs) em `_Workflows_Backups`.

## BDD Scenarios

### Cenário: Limpar raiz de NPM
- **Given:** Que há a pasta `node_modules` e arquivos `package.json` soltos em `Desktop/vscode`
- **When:** O bot de limpeza for acionado
- **Then:** Eles deverão ser removidos ou acomodados na pasta de Lixo se o usuário pedir backup, limpando a visão frontal.

### Cenário: Agrupar Tork
- **Given:** Arquivos .zip, e dezenas de pastas com prefixos `tork-`
- **When:** A organização de clientes for rodada
- **Then:** Todas existirão dentro da pasta `Tork_Group` e a raiz não terá menções soltas delas.
