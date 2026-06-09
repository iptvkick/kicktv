# Checklist de Limpeza e Padronização (Spec 022)

- [ ] **Fase 1: Deleção de Lixo e Arquivos Antigos**
  - [ ] Remover permanentemente a pasta `kicktv-saas/` (se existir na raiz ou adjacente) usando o terminal, pois ela não faz mais parte da build do TanStack Start e apenas gera confusão e lentidão no agente de busca.
  - [ ] Limpar importações ou arquivos órfãos não usados no TanStack Start, caso haja.

- [ ] **Fase 2: Refatoração do Auth (Login)**
  - [ ] Acessar `src/routes/auth/login.tsx`.
  - [ ] Substituir o `bg-[#020817]` por `bg-background` (ou `#f8f9fa`).
  - [ ] Remover os círculos de `blur` azul absrato (`bg-blue-500/20`, etc.).
  - [ ] Substituir o logo `bg-blue-600` e sombras `shadow-[0_0_15px_rgba(...)]` por elementos limpos: fundo escuro no logo ou bordas de alto contraste `#212529`.
  - [ ] Atualizar as fontes de inputs e botões para que o texto fique legível (mudar textos brancos e borders translúcidas para bordas `#e5e7eb` com texto negro).

- [ ] **Fase 3: Refatoração do Layout e Dashboard Cliente**
  - [ ] Acessar `src/routes/cliente.tsx`. Remover `bg-zinc-950` e `bg-black`. Trocar para `bg-[#f8f9fa]`.
  - [ ] Acessar `src/routes/cliente/dashboard.tsx`. Revisar a paleta para garantir legibilidade impecável sob fundo claro.
  - [ ] Acessar `src/components/ui/BottomNavBar.tsx`.
  - [ ] Remover o tema escuro/verde neon (`dark:bg-[#111]`, `text-[#00FF66]`, etc.).
  - [ ] Implementar o design glass claro: `bg-white/90 backdrop-blur-md border border-gray-200`.
  - [ ] Os ícones ativos devem usar a cor forte `#212529` ou um leve `#f3f4f6` background hover, sem sombra verde embutida (`inset_0_0_10px`).

- [ ] **Fase 4: Validação (Build e Review)**
  - [ ] Verificar se as dependências (framer-motion, lucide-react) continuam corretas nas refatorações.
  - [ ] Assegurar que o sistema inteiro não possua menções à antiga estética escura cyberpunk.
