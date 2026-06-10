# Spec 023: Hotfix de Consistência Visual

## Objetivo
Garantir que as telas do lado do cliente (`Início`, `Planos/Assinatura`, `Suporte` e `Perfil`) pareçam pertencer ao mesmo ecossistema, removendo discrepâncias de design criadas na Spec 022.

## BDD Scenarios

### Cenário: Rollback da tela de Login
- **Given:** A tela de login está com um design dark e cheio de efeitos.
- **When:** O agente restaurar o arquivo `login.tsx` via Git.
- **Then:** O login volta a ficar minimalista e branco.

### Cenário: Limpeza da tela de Assinatura
- **Given:** A tela de `assinatura.tsx` tem um botão flutuante de "Voltar" (`<ArrowLeft />`).
- **When:** O agente remover o header de navegação voltar.
- **Then:** A tela se comporta como uma aba primária do sistema (semelhante a Dashboard), alinhando o título com a borda superior padrão.

### Cenário: Simplificação da tela de Suporte
- **Given:** A tela `suporte.tsx` parece uma Landing Page com fontes 6xl e gradientes chamativos.
- **When:** O agente refatorar a interface mantendo apenas cards simples num fundo padrão.
- **Then:** O suporte se integra visualmente ao Dashboard e ao menu inferior, passando uma sensação de seriedade e funcionalidade.
