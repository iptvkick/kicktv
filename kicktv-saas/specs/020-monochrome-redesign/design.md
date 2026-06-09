# Design (020-monochrome-redesign)

## Modificações Essenciais
1. `src/app/globals.css`: 
   - A cor `--primary` passará de `221.2 83.2% 53.3%` (azul) para `240 5.9% 10%` (zinc-900 / Preto). 
   - A cor `--primary-foreground` passará para Branco Puro.
   - O `--background` vai para `240 5% 96%` (cinza super claro).
2. `src/app/page.tsx` (Landing Page):
   - Remover as classes text-primary de partes decorativas e usar `text-zinc-900` ou apenas preto absoluto.
   - Os CTAs virarão automaticamente Pretos. O logo `K` ficará preto.
3. `src/app/auth/login/page.tsx` (Login):
   - Remover o botão azul e fundo azul do logo. O css `--primary` fará esse trabalho.
4. `src/app/cliente/perfil/page.tsx` (Perfil):
   - Corrigir a tela bizarra (fundo dark grey, fontes sumindo, verdes esquisitos, botão vermelho/rosa bizarro). Ela precisa de um visual App Travel (Limpo, cartões super arredondados brancos, navegação simples).
