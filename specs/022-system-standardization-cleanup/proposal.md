# Spec 022: System Standardization & Cleanup

## Objetivo
Padronizar todas as telas, componentes, layouts e roteadores do projeto TanStack Start (`projetos antigravity`), garantindo que a **estética Branco Minimalista/Maximalista** (inspirada em Travel Mobile App e Apple Liquid Glass) seja aplicada uniformemente. O objetivo também inclui a exclusão sumária de todo lixo acumulado, códigos redundantes, e resquícios de temas dark, azul neon, ou verde neon.

## Requisitos
1. **Design Monocromático/Claro**: Eliminar todos os fundos `#020817`, `bg-zinc-950`, `bg-black`, além de efeitos neon e brilhos coloridos (`blur-[120px] bg-blue-500/20`). Fundo padrão será `#f8f9fa` ou `white`, com tipografia em `#212529`.
2. **Componentização Padrão**: Assegurar que `BottomNavBar`, modais, botões e wrappers utilizem o mesmo padrão visual do design system.
3. **Limpeza de Lixo**: Deletar a subpasta `kicktv-saas/` completamente, pois toda a lógica de negócio foi migrada para a raiz do TanStack Start e ela só está gerando confusão.
4. **Resolução de Bugs de Roteamento**: Garantir que as rotas Auth (`login.tsx`, `register.tsx`) funcionem perfeitamente sem erros de compilação ou imports incorretos, e que os redirects de sessão estejam fluidos.
5. **Delegação Rigorosa**: O trabalho de código será feito EXCLUSIVAMENTE pelo Agente (Frontend Engineer), orquestrado pelo Tech Lead após aprovação.

## BDD Scenarios

### Cenário: Acesso à Tela de Login
- **Given (Dado):** Um usuário não autenticado acessa `/auth/login`
- **When (Quando):** A tela carrega
- **Then (Então):** A interface exibida deve ser estritamente branca/clara, sem glows azuis, sem fundo preto, garantindo consistência com a Landing Page aprovada.

### Cenário: Navegação Interna do Cliente (BottomNavBar)
- **Given (Dado):** O cliente está logado e navega na `/cliente/dashboard`
- **When (Quando):** Ele visualiza o BottomNavBar
- **Then (Então):** A barra de navegação deve ser branca translúcida (Glassmorphism), com ícones em tons de cinza/preto, sem elementos em verde neon. A transição de abas deve manter o estado de forma fluida.

### Cenário: Remoção de Lixo do Sistema
- **Given (Dado):** O repositório contendo a pasta antiga `kicktv-saas/`
- **When (Quando):** A tarefa de limpeza for executada
- **Then (Então):** A pasta deve ser completamente removida, e nenhum componente do TanStack Start deve depender de arquivos que não estejam em `src/`.
