# Proposal (020-monochrome-redesign)

## Requisitos
1. Extirpar **completamente** a cor azul do projeto.
2. Unificar toda a interface sob a paleta Monocromática (Preto, Branco e Cinza).
3. Corrigir as fontes invisíveis e detalhes verdes divergentes na página de Perfil do Cliente.
4. Transformar todos os botões primários (`bg-primary`) em botões pretos sólidos (`bg-zinc-900` ou alterando o root).

## BDD Scenarios

### Cenário: Landing Page Monocromática
- **Dado** que o usuário acessa a raiz `/`
- **Quando** a página carrega
- **Então** ele não vê nenhum elemento em azul. Os textos de impacto são pretos, o botão de "Teste Grátis" é preto sólido (`bg-zinc-900`), e a palavra "Reinventada" é preta ou chumbo sem sombras coloridas.

### Cenário: Correção de Tela de Perfil
- **Dado** que o cliente acessa `/cliente/perfil`
- **Quando** a tela renderiza
- **Então** o texto de loading é cinza ou preto, as fontes de botões são legíveis, os cartões não são cinzas sombrios com botão rosa de saída, mas sim perfeitamente adequados ao design de App de Viagem Monocromático.
