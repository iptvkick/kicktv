## Problema confirmado

**Site publicado** (elevate-your-broadcast.lovable.app) não carrega. Preview do Lovable funciona.

Quando algo funciona em preview/local e quebra só no publicado, em TanStack Start sobre Cloudflare Worker, a causa é quase sempre uma destas:

1. **`src/start.ts` faltando** → `attachSupabaseAuth` não é registrado → qualquer chamada autenticada do navegador para uma server function retorna `401 Unauthorized: No authorization header`. Hoje o projeto **não tem** esse arquivo.
2. **Erros SSR engolidos pelo runtime** → Worker responde 500 com body genérico `{"unhandled":true}` e nada aparece no log. Sem um boundary, vira tela branca.
3. **`client.ts` lendo `process.env` no browser** → fallback que não existe em runtime do Worker pode quebrar o bundle do navegador.

## Correções (cirúrgicas, só publicação)

### 1. Criar `src/start.ts`
Mínimo necessário: importa `attachSupabaseAuth` e registra como `functionMiddleware` global. Isso é o que mais provavelmente está fazendo o publicado morrer.

### 2. Adicionar boundary de erro no `src/routes/__root.tsx`
- `errorComponent` que loga o erro real no console (`console.error(error)`).
- `notFoundComponent` simples.
Resultado: se ainda quebrar, você vê o motivo real em vez de tela branca/500 mudo.

### 3. Limpar `src/integrations/supabase/client.ts`
Tirar o `|| process.env.SUPABASE_URL` do browser client. Manter apenas `import.meta.env.VITE_*` que é o que existe em runtime no navegador.

### 4. Publicar novamente
Depois das 3 mudanças, republicar. Se ainda quebrar, agora vai haver erro real visível no console do navegador no published — aí dá pra atacar com precisão.

## O que **não** vou tocar

- Rotas, design, layout, conteúdo, Supabase, migrations, package.json, vite.config.ts. Nada disso.

Confirma e eu executo as 3 mudanças e te falo pra republicar.