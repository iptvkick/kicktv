# Research (020-monochrome-redesign)

## Contexto e Problema
O CEO enviou fortes críticas ao estado atual do layout, que ainda apresenta resquícios da cor azul primária, botões azuis vibrantes, elementos neons e componentes defeituosos (ex: tela de perfil com textos de loading em verde e fontes brancas ilegíveis em fundos brancos).

A diretriz absolutista e incontestável de agora em diante (registrada no arquivo raiz `.agents/DESIGN_SYSTEM.md`) é um design "Monochrome Elegance" estritamente baseado no Dribbble "Travel Mobile App".

## Análise do Dribbble
1. **Paleta:** Fundo primário muito claro (`bg-[#F2F2F6]`), foreground escuro puro (`text-zinc-950`). Sem acentos azuis, sem glow.
2. **Componentes (Cartões):** Brancos puros (`bg-white`), bordas ultrarredondas (`rounded-[32px]`), sombras mínimas ou inexistentes.
3. **CTAs e Menus:** Botões primários sempre em PRETO SÓLIDO (`bg-zinc-900` com `text-white`). Menus de navegação seguem o estilo de pílula flutuante preta.
4. **Login:** Extremamente limpo, minimalista e legível.
5. **Perfil:** A área de Perfil do cliente atual precisa de correção imediata para legibilidade e adequação a essa nova linguagem monocromática.

## Conclusão
A cor `--primary` configurada no `globals.css` está gerando botões azuis (`#2563eb`). Precisamos alterar o núcleo do CSS para que `primary` seja `zinc-900` (preto/quase preto). Toda a UI se corrigirá instantaneamente. A tela de Perfil precisa de uma refatoração específica em suas classes para remover aberrações (verde, fontes brancas erradas, botões rosas).
