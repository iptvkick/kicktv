# Design Doc: Estrutura Visual e Arquitetura de Dados (002)

## 1. Ajustes Visuais e de UI (Baseado no UX/UI 2026)
### 1.1 O Fim das Cores Fragmentadas
A atual salada de cores de fundo (`#13111A`, `#1E1B29`, classes Tailwind padrão do Shadcn) será substituída por um Dark Theme consistente.
- **Background Principal**: `bg-zinc-950`
- **Cards e Superfícies Glassmórficas**: `bg-white/5 backdrop-blur-xl border border-white/10`
- **Header**: Ficará no escopo exclusivo do `DashboardLayout.tsx`. O header do `Index.tsx` será **removido**.

### 1.2 Tela de Autenticação (Login)
- Seguirá o design **Apple Liquid Glass**.
- Fundo profundo com orbs desfocados sutis.
- Formulário minimalista e limpo, focado na alta conversão e zero distração.

## 2. Arquitetura do Supabase
Para suportar as features sem mock data, as tabelas precisam estar modeladas de forma relacional. O banco precisará (no mínimo) destas entidades:

1. **`users` (via auth.users estendido em public.profiles)**
   - Guarda o nível de acesso (Administrador vs Gerente).
2. **`units` (Unidades / Canais do Chatwoot)**
   - `id` (uuid)
   - `name` (text, ex: "Dom Pedro")
   - `chatwoot_inbox_id` (int) - Referência ao canal respectivo.
3. **`managers`**
   - Relacionamento com `units` (1 para 1 ou N para 1).
4. **`audits` / `leads`**
   - Tabela central onde os cards do Kanban existem.
   - `status` (novo, orçamento, negociando, encerrado).
   - `score` (inteiro, para geração da nota global).

*Na fase Vibe Apply, iremos checar se essas tabelas já foram criadas em migrações anteriores e atualizá-las se necessário.*
