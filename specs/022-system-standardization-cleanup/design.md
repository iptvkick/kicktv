# Design System: Clean & Maximalist (2026)

Este documento dita a estética absoluta do projeto `projetos antigravity` a partir de agora.

## Cores Principais
- **Background Base**: `#f8f9fa` (Slate/Grey super claro) ou Branco absoluto `#ffffff`.
- **Textos e Acentos Fortes**: `#212529` (Cinza chumbo/preto) ou `#000000`. Textos de apoio em `#212529/60` ou `#64748b`.
- **Alertas/Ações Secundárias**: Tons suaves de vermelho ou verde apenas onde estritamente funcional (ex: botão de logout `text-red-600 bg-red-50`). Sem glows neon.

## Regras de Componentes
1. **Glassmorphism Claro**: Modais, NavBars e Overlays não podem usar `bg-black/50`. Devem usar fundos brancos translúcidos (`bg-white/70 backdrop-blur-xl border border-black/5`).
2. **Sombras**: Utilizar `shadow-sm`, `shadow-md` ou `shadow-xl` nativos do Tailwind, simulando luz difusa natural. Nunca usar sombras com cores vibrantes (`shadow-[0_0_15px_blue]`).
3. **Cantos Arredondados**: Estilo Apple. Componentes maiores usam `rounded-[32px]` ou `rounded-[24px]`. Componentes menores `rounded-xl` ou `rounded-full`.
4. **Tipografia Maximalista**: Headers `text-3xl`, `text-4xl` ou maiores com `font-bold` ou `font-extrabold` e `tracking-tight`. Cores estritamente escuras de alto contraste em fundos claros.

## Especificidades de Rota
- **`/auth/login`**: Remover o background escuro (#020817) e os borrões azuis de fundo. Usar o card branco flutuando no fundo cinza claro. Botão primário pode ser um cinza bem escuro (`bg-[#212529]`) ou um tom de primary brand color suave.
- **`/cliente/dashboard` & `/cliente/perfil`**: O container principal precisa ter `bg-[#f8f9fa]`. O BottomNavBar deve acompanhar o glass claro.
- **`src/styles.css`**: Não introduzir variáveis que quebrem os componentes existentes (ex: forçar o `--background` para preto em algum componente local). O CSS global será mantido limpo.
