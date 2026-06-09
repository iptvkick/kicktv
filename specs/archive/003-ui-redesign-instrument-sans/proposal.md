# Spec 003: UI Redesign (Instrument Sans) - Proposal

## Requisitos do Sistema
1. **Tipografia Unificada:** Substituir `Outfit` e `Inter` por `Instrument Sans` (Google Fonts) em toda a aplicação.
2. **Nova Paleta de Cores:** Implementar Light e Dark mode seguindo a referência bancária: Fundos cinza/pretos neutros e sólidos (`#212529` e `#f5f6f7`), abandonando os tons de Indigo/Cyan brilhantes. Adicionar uma cor de destaque vibrante (ex: verde limão).
3. **Fim do Liquid Glass:** Remover todos os efeitos de `backdrop-blur`, gradientes radiais, bordas reflexivas e animações excessivas.
4. **Navegação Mobile (Pill):** Ocultar links complexos do header em mobile e implementar uma barra de navegação inferior flutuante (formato de pílula) para os clientes/admins acessarem o dashboard.
5. **Correção de LP Mobile:** Refatorar o container da Landing Page para não causar overflow-x.

## BDD Scenarios

### Cenário: Navegação Mobile Clean
- **Given (Dado):** que o usuário acessa o Dashboard por um celular (tela < 768px).
- **When (Quando):** ele desliza a tela para visualizar seus testes.
- **Then (Então):** o header superior condensa ou some, e uma barra inferior arredondada (Floating Pill Navbar) permanece fixa oferecendo acesso rápido à Início, Planos e Perfil, sem animações saltitantes.

### Cenário: Troca de Tema (Light/Dark)
- **Given (Dado):** que o usuário está no Light Mode do Painel Admin.
- **When (Quando):** ele alterna para o Dark Mode.
- **Then (Então):** os fundos `#f5f6f7` mudam para `#0a0a0f`, e os cards brancos `#ffffff` mudam para `#212529`, mantendo a tipografia Instrument Sans perfeitamente legível sem nenhum brilho no background.

### Cenário: Interação sem "AI Look"
- **Given (Dado):** que o usuário passa o mouse sobre um botão de "Gerar Teste".
- **When (Quando):** o hover ocorre.
- **Then (Então):** o botão apenas sofre uma leve alteração de opacidade ou cor de fundo (transição seca), sem se mover no eixo Y ou expandir sombras enormes.
