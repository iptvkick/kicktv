# Spec 003: UI Redesign (Instrument Sans) - Tasks

Estas tarefas deverão ser executadas pelo `frontend-engineer` e validadas contra o excesso de "AI Look".

## [ ] Frontend UI / Componentes (`frontend-engineer`)

### 1. Preparação Estilística
- [ ] Editar `index.html` para incluir `Instrument Sans` via Google Fonts.
- [ ] Limpar completamente `src/styles.css`: remover gradientes de background, `.liquid-glass`, e animações de deslocamento (`translateY(-4px)`).
- [ ] Definir a nova paleta de cores neutra (Dark e Light Mode) com acento verde. Exemplo: `--background: #f5f6f7;`, `--foreground: #212529;`.

### 2. Layout Mobile & Fixes
- [ ] Corrigir bug de responsividade no `Header` e Container da Landing Page, garantindo ausência de overflow no eixo X (mobile).
- [ ] Construir componente de navegação inferior `MobilePillNav` (Pill flutuante preta na borda inferior da tela, contendo ícones). E ocultar os links do Header tradicional quando na visualização Mobile.

### 3. Ajustes de Interface
- [ ] Substituir classes `rounded-lg`/`rounded-xl` nos cards principais por bordas grandes (`rounded-[24px]` ou `rounded-full` para botões).
- [ ] Remover sombras espaciais `shadow-lg` agressivas; usar borders finas ou cores de fundo preenchidas sólidas para delimitação.
- [ ] Revisar todas as telas (`Admin`, `Dashboard Cliente`, `Landing Page`) aplicando o look "Clean Banking/Travel" sem brilhos artificiais.
