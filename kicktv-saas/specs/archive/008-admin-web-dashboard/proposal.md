# Proposal: Correção de SDD, Performance e Admin Widescreen

## Escopo
A Fase 6 consiste na estabilização final da Interface do Usuário (UI) garantindo 100% de aderência ao `sdd-design.md` original, a construção do Painel Administrativo Web (Widescreen) e a resolução definitiva dos problemas de performance (loading infinito) e usabilidade (transições duras).

## User Stories
1. **Como Usuário**, eu quero que a plataforma siga um design minimalista claro e elegante, sem cores neon ou hackers indesejadas.
2. **Como Administrador**, eu quero acessar meu painel no computador e ter a tela 100% preenchida (Widescreen) com uma barra lateral de navegação, ao invés de uma tela comprimida em formato de celular.
3. **Como Cliente**, eu quero que ao abrir o app ele carregue instantaneamente com Skeletons de "carregando", sem me deixar esperando em uma tela em branco.
4. **Como Usuário**, eu quero que a transição entre telas (ex: Dashboard para Perfil) seja fluida e suave, com animações.

## BDD Scenarios

### Cenário: Carregamento do Painel de Admin no PC
- **Given (Dado):** que o usuário logado possui a role `admin`.
- **When (Quando):** ele acessa `/admin/dashboard` pelo computador.
- **Then (Então):** ele vê um layout de 100% de largura (`w-full`), contendo uma barra lateral (Sidebar) elegante na cor `#212529` à esquerda com opções de navegação.

### Cenário: Tratamento de Lentidão (Loading States)
- **Given (Dado):** uma conexão lenta com o Supabase.
- **When (Quando):** o usuário entra no `/cliente/dashboard`.
- **Then (Então):** ele vê instantaneamente a estrutura (esqueleto/Skeleton) de Light Mode pulsando em cinza, sem tela branca.

### Cenário: Transição Suave de Página
- **Given (Dado):** o usuário está no `/cliente/dashboard`.
- **When (Quando):** ele clica em "Perfil" na barra inferior.
- **Then (Então):** a tela atual faz um *fade out* sutil e a tela de perfil faz um *fade in*, eliminando o efeito de tela piscando bruscamente.
