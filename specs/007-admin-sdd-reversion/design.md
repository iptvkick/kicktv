# Design: SDD Reversion & Admin Screens

## 1. UX/UI 2026: Readequação ao Clean Minimalist
A interface deve retornar à paleta descrita no `001-kicktv-saas/sdd-design.md`:
- **Background Root:** `#f5f6f7` (zinc-50) em vez de `#000000`.
- **Textos:** `#212529` (zinc-900) em vez de `#ffffff`.
- **Primary Accent:** Utilizaremos o Dark Charcoal para os botões e destaques, não o Verde Neon.
- **Enclausuramento do Desktop:** Continua ativo! A diferença é que a coluna flutuante do centro terá fundo `#ffffff` e uma sombra leve (shadow-lg), trazendo elegância pura em vez da vibe "hacker".

## 2. Lógica de Redirecionamento (Auth)
A tela de Login de `kicktv-saas` (caso exista) ou o MiddleWare precisará verificar se a conta recém-logada possui o perfil de administrador:
```typescript
const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
if (profile.role === 'admin') router.push('/admin/dashboard');
else router.push('/cliente/dashboard');
```

## 3. O Painel Admin (`kicktv-saas/src/app/admin/*`)
Teremos um design estruturado para as telas de administração:
- **Admin Dashboard:** Visão geral rápida.
- **Admin Planos (`/admin/planos`):** CRUD de planos (onde os preços são definidos).
- **Admin Servidores (`/admin/servidores`):** Listagem e edição das URLs do XTream Codes.
A `BottomNavBar` de Admin exibirá os ícones: `Dashboard` (LayoutDashboard), `Planos` (ListTree), `Servidores` (Server), e `Sair` (LogOut).
