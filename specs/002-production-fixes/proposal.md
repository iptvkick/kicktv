# Proposal: Correções de Produção e Interface (002-production-fixes)

## Contexto
A página inicial está sofrendo de problemas de espaçamento, escondendo o bloco principal. Paralelamente, configurações base do Supabase e TanStack Start no ambiente de produção apresentam riscos (variáveis `process.env` no browser, middleware de autenticação sem registro).

## Requisitos
1. **Frontend**: Corrigir espaçamentos na `index.tsx` para garantir que a primeira dobra seja visível imediatamente.
2. **Integração**: Refatorar `supabase/client.ts` removendo dependência de `process.env`.
3. **Integração**: Criar `src/start.ts` injetando o middleware de autenticação em `functionMiddleware`.
4. **Frontend**: Implementar Fallback Error Boundary e NotFound na root.
5. **Frontend/SEO**: Atualizar os metadados em `__root.tsx` para IPTV.

## BDD Scenarios

### Cenário: Carregamento do site na Home
- **Given (Dado):** que o usuário acessa a página inicial.
- **When (Quando):** a página é carregada.
- **Then (Então):** o Hero text e CTA devem estar visíveis "above the fold" sem a necessidade de scroll.

### Cenário: Erro 500 em produção
- **Given (Dado):** que o usuário navega para uma rota que lança uma exceção.
- **When (Quando):** o erro não tratado estoura.
- **Then (Então):** a aplicação deve exibir a UI do Error Boundary padrão do TanStack Start.
