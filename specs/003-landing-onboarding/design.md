# Design Architecture: KickTV 2026 (TripGlide Aesthetic)

## 1. Identidade Visual e Vibe (TripGlide)
Conforme definido pelo usuário, a Vibe do projeto abandonará o "dark mode neon" e o verde hacker antigo, e abraçará o **Minimalismo Clean e Premium** inspirado no TripGlide. 
O foco aqui é clareza extrema, auto-contraste e leveza visual.

- **Fundo Principal (Background)**: `#f5f6f7` (Um cinza gelo super claro e relaxante).
- **Texto e Elementos de Destaque**: `#212529` (Chumbo/Preto suave).
- **Cartões Primários**: `#ffffff` (Branco puro) com sombras muito difusas e limpas (`shadow-sm`, `shadow-md` muito sutis).
- **Cartões de Contraste / CTAs Fortes**: Fundo `#212529` com texto `#ffffff`.
- **Raio de Borda (Border Radius)**: Extremamente acentuado, arredondado amigável (`rounded-[24px]` a `rounded-[32px]` para cards grandes, `rounded-full` para botões).

## 2. Tipografia (Instrument Sans)
- **Fonte Principal**: `Instrument Sans`.
- **Headings**: Pesos bold/extrabold, com letter-spacing um pouco apertado (`tracking-tight`). 
- A legibilidade é a prioridade. Botões claros devem ter fonte escura e vice-versa. (Correção do erro anterior onde o botão branco estava com fonte branca).

## 3. Motion Design (Fim do App "Duro")
O aplicativo ganhará vida através de micro-animações do Framer Motion e transições CSS:
- **Transições de Tela**: Entradas em `fade-in-up` suaves.
- **Hover Dinâmico**: Cartões e botões ganham vida ao passar o mouse (`hover:-translate-y-1 hover:shadow-lg transition-all duration-300`).
- **Botões (CTAs)**: Efeito de escala ao clicar (`active:scale-95`).
- **Onboarding/Wizard**: Ao avançar de passo, o card atual desliza para a esquerda (`slide-out`) e o novo entra da direita (`slide-in`).

## 4. UI/UX do Funil de Onboarding
1. **`/` (Home)**: 
   - Estilo limpo, hero centrado com botões arredondados.
   - Mockup imersivo do app em um card contrastante.
2. **`/auth/register` (Teste Grátis)**: 
   - Formulário limpo, fundo branco sobre fundo `#f5f6f7`. Apenas os campos essenciais.
3. **`/onboarding` (Wizard de Dispositivos)**:
   - Uma grade maravilhosa de botões (Smart TV, Android, iOS), seguindo o estilo "Pills" ou "Cards" da imagem de referência.
4. **`/suporte`**: 
   - Fundo claro, cards brancos organizados de forma clean, textos legíveis e ícones minimalistas pretos.

## 5. Acessibilidade (WCAG 2.2)
- Alto contraste mantido entre o texto `#212529` e fundos claros.
- Contraste absoluto resolvido nos botões.
