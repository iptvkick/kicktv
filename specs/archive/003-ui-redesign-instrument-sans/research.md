# Spec 003: UI Redesign (Instrument Sans) - Research (RPI-R)

## Análise de Referências Dribbble
O usuário solicitou uma mudança drástica na direção de arte. O estilo "Liquid Glass" e "Dark Technical" cheio de animações espaciais (Framer Motion exagerado, brilhos) deve ser substituído por um Minimalismo Tátil Sólido.

### 1. Referência: Travel Mobile App
- **Navegação Mobile:** Utiliza um "Floating Pill Navbar" na parte inferior da tela. Fundo escuro, cantos 100% arredondados (`rounded-full`), botões com ícones limpos.
- **Cards:** Extremamente arredondados (raio de borda alto, aprox. 24px a 32px). Fundo branco limpo, imagens ocupando todo o topo do card.

### 2. Referência: Banking Mobile App
- **Paleta de Cores:** Fundo principal cinza muito claro (`#f5f6f7`), cartões brancos (`#ffffff`) e texto quase preto (`#212529`). O Dark Mode será o inverso disso.
- **Cores de Destaque (Accent):** Verde Neobank intenso e vibrante para os cartões principais. Botões pretos (`#212529`) com texto branco para ações primárias.
- **Tipografia:** `Instrument Sans` para tudo (Display e Corpo).

### 3. Remoção do "AI Look"
- As animações `.interactive` que sobem o card em Y e aplicam scale e sombras grandes devem ser sumariamente deletadas.
- Fundos com `radial-gradient` (glow) serão removidos.
- Interfaces precisam ser secas, diretas, com feedback instantâneo no toque/hover (ex: mudança sutil de cor de fundo, sem movimentos espaciais).

### 4. Responsividade Crítica
- A Landing Page (LP) atual e os Headers estão quebrando em telas menores. O botão e o layout excedem o viewport (eixo X).
- É necessário adotar a Navbar inferior flutuante para resolver os problemas de header em dispositivos móveis.
