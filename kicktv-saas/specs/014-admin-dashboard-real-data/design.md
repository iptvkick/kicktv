# Arquitetura Visual e DB (014-admin-dashboard-real-data)

## Banco de Dados (Supabase)
### Consultas Necessárias (Dashboard):
1. **Ativos:** `SELECT count(*) FROM iptv_subscriptions WHERE status = 'ativo'`
2. **Receita:** `SELECT sum(valor) FROM payments WHERE status = 'pago' AND created_at >= start_of_month`
3. **Trials:** `SELECT count(*) FROM iptv_subscriptions WHERE status = 'trial'`
4. **Registros Recentes:** `SELECT * FROM iptv_subscriptions ORDER BY created_at DESC LIMIT 5`
5. **Servidores (Mock por enquanto):** Já que não temos tabela `servers`, manteremos os cards `Servidor Xtream A` e `B` como componentes visuais placeholder na Dashboard até criarmos a tela `/admin/servidores`.

## Design System (Stitch MCP / Tailwind 2026)
### Componentes da Dashboard
- **Cards de Métrica (4 colunas):**
  - Fundo `#ffffff`, bordas sutis com opacidade `border-gray-100`.
  - Box Shadow sutil (Liquid Glass) tipo `shadow-[0_4px_24px_rgba(0,0,0,0.02)]`.
  - Títulos em `text-gray-500` tamanho `text-xs font-semibold tracking-wider uppercase`.
  - Valores em `text-3xl font-bold text-gray-900`.
  - Ícone flutuando no canto direito com `bg-gray-50 text-gray-400 p-2 rounded-xl`.
- **Tabela de Registros:**
  - Layout limpo, sem bordas verticais.
  - Status Pills: 
    - `bg-emerald-100 text-emerald-700` para Ativo.
    - `bg-amber-100 text-amber-700` para Trial.

### Páginas Secundárias (Cascas)
- `/admin/planos`: Página contendo título `Gerenciar Planos` e layout em branco flexível.
- `/admin/servidores`: Página para `Servidores Xtream`.
- `/admin/tutoriais`: Página para vídeos de onboarding.
