# Tasks: Spec 023 - Consistência Visual

## Fase 1: Rollback & Ajustes (Frontend Engineer)
- `[x]` Executar `git restore src/routes/auth/login.tsx` (ou o Tech Lead pode fazer isso direto no terminal) para reverter a tela de Login.
- `[x]` Em `src/routes/cliente/assinatura.tsx`: Remover o botão `<button onClick={() => navigate({ to: '/cliente/dashboard' })}> <ArrowLeft /> </button>` do topo da tela. 
- `[x]` Em `src/routes/cliente/assinatura.tsx`: Garantir que a tag `<main>` tenha a mesma classe das outras rotas: `className="flex-1 flex flex-col pt-12 pb-24 px-6"`.
- `[x]` Em `src/routes/cliente/suporte.tsx`: Substituir o componente inteiro por um layout simples (remover fontes 5xl/6xl, remover gradientes extremos). Usar o cabeçalho "Central de Suporte" com `text-2xl font-bold` e botões com estilo de card simples.
