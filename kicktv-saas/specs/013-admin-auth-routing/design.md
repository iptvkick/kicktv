# Design Document: Admin Auth Routing

## 1. Abordagem Next.js SSR (Supabase Middleware)

O problema clássico do App Router é misturar Client-Side Auth e Server-Side Auth.
A arquitetura proposta aqui utiliza o Middleware oficial do Supabase para SSR (`@supabase/ssr`).

### 1.1 `middleware.ts`
O arquivo `middleware.ts` interceptará TODAS as requisições para `/admin/*` e `/cliente/*`.
O fluxo do middleware será:
1. `supabase.auth.getUser()`: Obtém o usuário seguro por cookies (HTTP-Only).
2. Se não houver usuário logado, joga para `/auth/login`.
3. Se houver usuário, ele lê a tabela `profiles` via `supabase.from('profiles').select('role')`.
   - **Nota Tática**: Para não explodir os limites do Supabase lendo a tabela a cada clique, a rota será defendida em níveis: Sessão (instantânea) -> Checagem de role nos layouts protegidos (Server Components).
   - Alternativamente, faremos a checagem Server-Side diretamente no `src/app/admin/layout.tsx` transformando-o num Server Component Assíncrono que barra qualquer renderização caso a `role` falhe.

### 1.2 O Layout Administrativo (Stitch MCP)
O `src/app/admin/layout.tsx` deixará de ser apenas casca visual. Ele será convertido para:
```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function AdminLayout({ children }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/cliente/dashboard')
  }

  return (
    // ... Layout UI
  )
}
```
Isso garante zero piscadas e bugs, impedindo totalmente o vazamento do escopo e protegendo as chaves visuais geradas pelo Supabase.
