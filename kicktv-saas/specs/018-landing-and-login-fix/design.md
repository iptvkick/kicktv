# Design (018-landing-and-login-fix)

## 1. Unificação Visual: Branco Minimalista/Maximalista
**Para `src/app/page.tsx` (Landing Page) e `src/app/auth/login/page.tsx`:**
- Fundo: `bg-slate-50` ou `bg-white` (remover backgrounds em `bg-background` caso herdem o dark theme global indesejado).
- Tipografia: Texto principal em `text-gray-900` e `text-gray-600`. Títulos expressivos `font-black text-5xl+`.
- Componentes: Limpos. Botões sólidos em cor primária moderna sem glows extremos (`bg-blue-600 text-white shadow-sm hover:bg-blue-700`).
- Os `globals.css` root variables também devem ser verificados para certificar que o modo claro é o padrão absoluto e agradável.

## 2. Correção Lógica de Login
**Para `src/app/auth/login/page.tsx`:**
```typescript
      // Tratamento aprimorado
      if (profileError) {
        console.warn("Perfil não encontrado ou erro. Fallback para Cliente.", profileError);
        router.push("/cliente/dashboard");
        return;
      }
```
